export async function fetchGitHubProjects(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos = await response.json();

        // Filter by checking if they have a README
        const promises = repos.map(async (repo) => {
            try {
                const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
                if (readmeRes.ok) {
                    return repo;
                }
            } catch (e) {
                // Ignore error, just filter out
            }
            return null;
        });

        const results = await Promise.allSettled(promises);
        return results
            .filter(r => r.status === 'fulfilled' && r.value !== null)
            .map(r => r.value);

    } catch (error) {
        console.error('Error in fetchGitHubProjects:', error);
        return [];
    }
}

export async function fetchRepoReadme(username, repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`);
        if (!response.ok) throw new Error('README not found');

        const data = await response.json();

        // Base64 decoding, handling utf-8
        // atob can break on utf8 chars, so using escape/decodeURIComponent
        const decodedContent = decodeURIComponent(escape(atob(data.content)));
        return decodedContent;
    } catch (error) {
        console.error('Error fetching readme:', error);
        return null;
    }
}
