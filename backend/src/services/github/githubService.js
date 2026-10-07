const githubApiClient = require('./githubApiClient');
const githubTechDetector = require('./githubTechDetector');
const githubOwnershipEvaluator = require('./githubOwnershipEvaluator');
const githubResumeMatcher = require('./githubResumeMatcher');
const githubEvidenceService = require('./githubEvidenceService');

const GitHubProfile = require('../../models/GitHubProfile');
const StudentProfile = require('../../models/StudentProfile');
const ResumeAnalysis = require('../../models/ResumeAnalysis');
const { getIsConnected } = require('../../config/database');

class GithubService {
  /**
   * Connects and verifies a student's GitHub username or profile URL
   */
  async connectGithub(candidateId, usernameOrUrl) {
    const cleanUsername = githubApiClient.normalizeUsername(usernameOrUrl);

    // Verify username exists on GitHub
    const userProfile = await githubApiClient.fetchUserProfile(cleanUsername);

    // Save handle to StudentProfile
    let profile = await StudentProfile.findOne({ user: candidateId });
    if (!profile) {
      profile = await StudentProfile.findOne({ studentId: candidateId });
    }

    if (profile) {
      if (!profile.platformHandles) {
        profile.platformHandles = {};
      }
      profile.platformHandles.github = cleanUsername;
      await profile.save();
    }

    return {
      success: true,
      message: `GitHub profile "@${cleanUsername}" connected successfully.`,
      profile: {
        username: cleanUsername,
        name: userProfile.name,
        avatarUrl: userProfile.avatar_url,
        bio: userProfile.bio,
        publicRepos: userProfile.public_repos,
        followers: userProfile.followers,
        profileUrl: userProfile.html_url,
      },
    };
  }

  /**
   * Complete GitHub Intelligence pipeline: Fetch -> Detect -> Evaluate -> Match -> Evidence -> Persist
   */
  async analyzeGithub(candidateId, options = {}) {
    if (!getIsConnected()) {
      throw new Error('Database is currently unavailable. Please verify MongoDB connection.');
    }

    // 1. Resolve student's GitHub username
    let username = null;
    if (options.username) {
      username = githubApiClient.normalizeUsername(options.username);
    }

    let profile = await StudentProfile.findOne({ user: candidateId });
    if (!profile) {
      profile = await StudentProfile.findOne({ studentId: candidateId });
    }

    if (!username) {
      if (profile?.platformHandles?.github && profile.platformHandles.github !== 'alexkumar-dev') {
        username = profile.platformHandles.github;
      } else {
        const existingDoc = await GitHubProfile.findOne({ candidateId });
        if (existingDoc && existingDoc.username) {
          username = existingDoc.username;
        } else if (profile?.platformHandles?.github) {
          username = profile.platformHandles.github;
        }
      }
    }

    if (!username) {
      throw new Error('No GitHub username connected. Please connect your GitHub account first.');
    }

    const cleanUsername = githubApiClient.normalizeUsername(username);

    // Save/update handle to StudentProfile
    if (profile) {
      if (!profile.platformHandles) profile.platformHandles = {};
      profile.platformHandles.github = cleanUsername;
      await profile.save();
    }

    // 2. Cache Check (if analyzed within last 10 minutes and not forced)
    if (!options.forceRefresh) {
      const cached = await GitHubProfile.findOne({ candidateId, username: cleanUsername });
      if (cached && cached.lastAnalyzedAt) {
        const diffMinutes = (Date.now() - new Date(cached.lastAnalyzedAt).getTime()) / (1000 * 60);
        if (diffMinutes < 10) {
          console.log(`[GithubService] Returning cached GitHub intelligence for @${cleanUsername}`);
          return {
            success: true,
            isCached: true,
            message: 'GitHub intelligence retrieved from cache.',
            githubProfile: cached,
          };
        }
      }
    }

    console.log(`[GithubService] Fetching real-time GitHub data for @${cleanUsername}...`);

    // 3. Fetch GitHub Profile & Repositories
    const rawUserProfile = await githubApiClient.fetchUserProfile(cleanUsername);
    const rawRepos = await githubApiClient.fetchUserRepos(cleanUsername);

    console.log(`[GithubService] Found ${rawRepos.length} public repositories for @${cleanUsername}`);

    // 4. Retrieve candidate's latest ResumeAnalysis for Cross-Matching
    const latestResumeAnalysis = await ResumeAnalysis.findOne({ candidateId }).sort({ createdAt: -1 });
    const resumeProjects = latestResumeAnalysis?.projects || [];
    const resumeSkills = latestResumeAnalysis?.skills || [];

    // 5. Deep Concurrent Repository Analysis
    const languageTotals = new Map();
    const globalTechSet = new Set();

    // Helper to analyze a single repository with concurrent file inspections
    const analyzeRepo = async (repo) => {
      const isFork = !!repo.fork;
      const ownershipStatus = githubOwnershipEvaluator.evaluateOwnership(repo, cleanUsername);
      const recencyStatus = githubOwnershipEvaluator.evaluateRecency(repo);

      // Concurrent fetch of repo languages, manifest files, and readme
      const [
        languagesMap,
        packageJson,
        reqTxt,
        pyproject,
        dockerfile,
        dockerCompose,
        pomXml,
        goMod,
        cargoToml,
        readme
      ] = await Promise.all([
        githubApiClient.fetchRepoLanguages(repo.owner.login, repo.name).catch(() => ({})),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'package.json').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'requirements.txt').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'pyproject.toml').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'Dockerfile').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'docker-compose.yml').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'pom.xml').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'go.mod').catch(() => null),
        githubApiClient.fetchRepoFile(repo.owner.login, repo.name, 'Cargo.toml').catch(() => null),
        githubApiClient.fetchRepoReadme(repo.owner.login, repo.name).catch(() => null),
      ]);

      let totalBytes = 0;
      const langArray = [];

      for (const [lName, lBytes] of Object.entries(languagesMap || {})) {
        totalBytes += lBytes;
      }

      for (const [lName, lBytes] of Object.entries(languagesMap || {})) {
        const pct = totalBytes > 0 ? Math.round((lBytes / totalBytes) * 100) : 0;
        langArray.push({ name: lName, bytes: lBytes, percentage: pct });
      }

      // Check dependency files
      const detectedTechs = new Set();
      const dependencyFiles = [];

      if (repo.language) detectedTechs.add(repo.language);
      for (const l of langArray) {
        if (l.percentage > 10) detectedTechs.add(l.name);
      }

      if (packageJson) {
        dependencyFiles.push('package.json');
        const jsTechs = githubTechDetector.detectFromPackageJson(packageJson);
        jsTechs.forEach((t) => detectedTechs.add(t));
      }

      if (reqTxt) {
        dependencyFiles.push('requirements.txt');
        const pyTechs = githubTechDetector.detectFromRequirementsTxt(reqTxt);
        pyTechs.forEach((t) => detectedTechs.add(t));
      }

      if (pyproject) {
        dependencyFiles.push('pyproject.toml');
        const pyTechs = githubTechDetector.detectFromRequirementsTxt(pyproject);
        pyTechs.forEach((t) => detectedTechs.add(t));
      }

      if (dockerfile) {
        dependencyFiles.push('Dockerfile');
        detectedTechs.add('Docker');
      }

      if (dockerCompose) {
        dependencyFiles.push('docker-compose.yml');
        detectedTechs.add('Docker Compose');
      }

      if (pomXml) {
        dependencyFiles.push('pom.xml');
        const javaTechs = githubTechDetector.detectFromJavaBuild(pomXml);
        javaTechs.forEach((t) => detectedTechs.add(t));
      }

      if (goMod) {
        dependencyFiles.push('go.mod');
        const goTechs = githubTechDetector.detectFromGoMod(goMod);
        goTechs.forEach((t) => detectedTechs.add(t));
      }

      if (cargoToml) {
        dependencyFiles.push('Cargo.toml');
        const rustTechs = githubTechDetector.detectFromCargoToml(cargoToml);
        rustTechs.forEach((t) => detectedTechs.add(t));
      }

      let readmeSnippet = '';
      if (readme) {
        const readmeTechs = githubTechDetector.detectFromReadme(readme);
        readmeTechs.forEach((t) => detectedTechs.add(t));
        readmeSnippet = readme.substring(0, 300).replace(/[\r\n]+/g, ' ').trim();
      }

      const hasDependencies = dependencyFiles.length > 0;
      const hasReadme = !!readme;
      const evidenceStrength = githubOwnershipEvaluator.evaluateEvidenceStrength(
        ownershipStatus,
        hasDependencies,
        hasReadme,
        repo.archived
      );

      const repoTechArray = Array.from(detectedTechs);

      return {
        githubRepoId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        description: repo.description || '',
        owner: repo.owner.login,
        ownerType: repo.owner.type,
        isFork,
        isArchived: !!repo.archived,
        visibility: repo.visibility || (repo.private ? 'private' : 'public'),
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        pushedAt: new Date(repo.pushed_at),
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0,
        size: repo.size || 0,
        defaultBranch: repo.default_branch || 'main',
        primaryLanguage: repo.language || '',
        languages: langArray,
        languagesMap,
        detectedTechnologies: repoTechArray,
        dependencyFilesFound: dependencyFiles,
        topics: repo.topics || [],
        license: repo.license?.spdx_id || repo.license?.name || null,
        openIssues: repo.open_issues_count || 0,
        ownershipStatus,
        recencyStatus,
        evidenceStrength,
        readmeSnippet,
        hasReadme,
        hasDependencies,
        matchedResumeProjects: [],
      };
    };

    // Process all repositories in parallel batches
    const BATCH_SIZE = 6;
    const analyzedRepositories = [];

    for (let i = 0; i < rawRepos.length; i += BATCH_SIZE) {
      const batch = rawRepos.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map((r) => analyzeRepo(r)));
      analyzedRepositories.push(...batchResults);
    }

    // Accumulate languages and global tech set
    for (const repo of analyzedRepositories) {
      for (const [lName, lBytes] of Object.entries(repo.languagesMap || {})) {
        const currentTotal = languageTotals.get(lName) || { count: 0, bytes: 0 };
        languageTotals.set(lName, {
          count: currentTotal.count + 1,
          bytes: currentTotal.bytes + lBytes,
        });
      }
      (repo.detectedTechnologies || []).forEach((t) => globalTechSet.add(t));
      delete repo.languagesMap; // Clean up temporary field
    }

    // 6. Resume ↔ GitHub Matching
    const projectMatches = [];
    for (const resumeProj of resumeProjects) {
      const matchResult = githubResumeMatcher.matchProjectWithRepositories(resumeProj, analyzedRepositories);
      projectMatches.push(matchResult);

      if (matchResult.matchedRepo) {
        const repoItem = analyzedRepositories.find((r) => r.name === matchResult.matchedRepo.name);
        if (repoItem) {
          repoItem.matchedResumeProjects.push({
            resumeProjectName: resumeProj.name,
            matchStatus: matchResult.matchStatus,
            matchScore: matchResult.matchScore,
            matchReason: matchResult.matchReason,
          });
        }
      }
    }

    // Skill Claims Matching
    const { verifiedSkillMatches, pendingSkillClaims } = githubResumeMatcher.matchSkillsWithRepositories(
      resumeSkills,
      analyzedRepositories
    );

    // 7. Sync Evidence & SkillClaims in MongoDB Atlas
    await githubEvidenceService.syncEvidenceFromGithub(
      candidateId,
      verifiedSkillMatches,
      pendingSkillClaims,
      analyzedRepositories,
      projectMatches
    );

    // 8. Compute Statistics
    const originalRepos = analyzedRepositories.filter((r) => r.ownershipStatus === 'OWNED');
    const forkedRepos = analyzedRepositories.filter((r) => r.ownershipStatus === 'FORKED');
    const activeRepos = analyzedRepositories.filter((r) => r.recencyStatus === 'ACTIVE');
    const staleRepos = analyzedRepositories.filter((r) => r.recencyStatus === 'STALE');
    const archivedRepos = analyzedRepositories.filter((r) => r.isArchived);

    const totalStars = analyzedRepositories.reduce((acc, r) => acc + (r.stars || 0), 0);
    const totalForks = analyzedRepositories.reduce((acc, r) => acc + (r.forks || 0), 0);

    const sortedLanguages = Array.from(languageTotals.entries())
      .map(([name, data]) => ({ name, count: data.count, bytes: data.bytes }))
      .sort((a, b) => b.bytes - a.bytes);

    const matchedCount = projectMatches.filter((p) => p.matchStatus === 'MATCHED').length;

    // 9. Generate Deterministic Insights
    const insights = [
      `You have ${originalRepos.length} original public ${originalRepos.length === 1 ? 'repository' : 'repositories'} on GitHub.`,
      activeRepos.length > 0
        ? `${activeRepos.length} ${activeRepos.length === 1 ? 'repository shows' : 'repositories show'} active commits in the last 30 days.`
        : 'No public repositories updated in the last 30 days.',
      sortedLanguages.length > 0
        ? `${sortedLanguages[0].name} is your most frequently detected language (${sortedLanguages[0].count} repositories).`
        : 'Multiple programming languages detected across repositories.',
      matchedCount > 0
        ? `${matchedCount} resume ${matchedCount === 1 ? 'project has' : 'projects have'} verified matching GitHub repositories.`
        : 'No resume projects directly matched to public GitHub repositories yet.',
      verifiedSkillMatches.length > 0
        ? `${verifiedSkillMatches.length} resume technical ${verifiedSkillMatches.length === 1 ? 'claim has' : 'claims have'} verified codebase proof.`
        : 'Resume technical claims are awaiting repository code evidence.',
      pendingSkillClaims.length > 0
        ? `${pendingSkillClaims.length} resume ${pendingSkillClaims.length === 1 ? 'claim requires' : 'claims require'} additional public repository evidence.`
        : 'All detected resume claims have supporting repository evidence.',
    ];

    const statistics = {
      totalRepositories: analyzedRepositories.length,
      originalRepositories: originalRepos.length,
      forkedRepositories: forkedRepos.length,
      archivedRepositories: archivedRepos.length,
      activeRepositories: activeRepos.length,
      staleRepositories: staleRepos.length,
      totalStars,
      totalForks,
      languages: sortedLanguages,
      detectedTechnologies: Array.from(globalTechSet),
      verifiedResumeSkillsCount: verifiedSkillMatches.length,
      matchedProjectsCount: matchedCount,
    };

    // 10. Persist GitHubProfile Document
    const updatedGitHubProfile = await GitHubProfile.findOneAndUpdate(
      { candidateId },
      {
        candidateId,
        studentProfile: profile ? profile._id : null,
        collegeId: profile ? profile.collegeId : null,
        username: cleanUsername,
        profileUrl: rawUserProfile.html_url || `https://github.com/${cleanUsername}`,
        name: rawUserProfile.name || cleanUsername,
        avatarUrl: rawUserProfile.avatar_url || '',
        bio: rawUserProfile.bio || '',
        company: rawUserProfile.company || '',
        location: rawUserProfile.location || '',
        blog: rawUserProfile.blog || '',
        twitterUsername: rawUserProfile.twitter_username || '',
        publicRepos: rawUserProfile.public_repos || analyzedRepositories.length,
        publicGists: rawUserProfile.public_gists || 0,
        followers: rawUserProfile.followers || 0,
        following: rawUserProfile.following || 0,
        accountCreatedAt: rawUserProfile.created_at ? new Date(rawUserProfile.created_at) : null,
        profileUpdatedAt: rawUserProfile.updated_at ? new Date(rawUserProfile.updated_at) : null,
        lastAnalyzedAt: new Date(),
        repositories: analyzedRepositories,
        statistics,
        insights,
      },
      { upsert: true, new: true }
    );

    console.log(`[GithubService] Successfully analyzed @${cleanUsername}. Verified skills: ${verifiedSkillMatches.length}`);

    return {
      success: true,
      message: 'GitHub intelligence analysis completed successfully.',
      githubProfile: updatedGitHubProfile,
      projectMatches,
      verifiedSkills: verifiedSkillMatches,
      pendingClaims: pendingSkillClaims,
    };
  }

  /**
   * Retrieves existing GitHub profile analysis
   */
  async getProfile(candidateId) {
    if (!getIsConnected()) {
      return null;
    }
    return await GitHubProfile.findOne({ candidateId });
  }
}

module.exports = new GithubService();
