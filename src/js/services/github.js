const token = "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";

// Create a reusable options object with your authorization headers
const fetchOptions = {
    headers: {
        'Authorization': `token ${token}`
    }
};

export async function fetchGitHubProjects(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, fetchOptions);
        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos = await response.json();

        // Return all repositories without checking their READMEs 
        // to prevent N API requests. We will rely solely on the blacklist.
        return repos.filter(repo => !repo.fork);

    } catch (error) {
        console.error('Error in fetchGitHubProjects:', error);
        return [];
    }
}

export async function fetchRepoReadme(username, repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, fetchOptions);
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
