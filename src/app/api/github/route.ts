export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const githubUrl = searchParams.get("url");

  if (!githubUrl) {
    return Response.json({ error: "GitHub URL is required" }, { status: 400 });
  }

  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) {
    return Response.json(
      { error: "Invalid GitHub URL format" },
      { status: 400 },
    );
  }

  const [, owner, repo] = match;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Get basic repo info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );
    const repoData = await repoResponse.json();

    // Get languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers },
    );
    const languagesData = await languagesResponse.json();

    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      { headers },
    );
    const commitsData = await commitsResponse.json();

    if (!repoResponse.ok) {
      return Response.json(
        { error: repoData.message },
        { status: repoResponse.status },
      );
    }

    const result = {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      languages: languagesData,
      lastCommit: commitsData[0]?.commit?.message || "No commits",
      lastCommitDate: commitsData[0]?.commit?.author?.date || null,
      lastCommitAuthor: commitsData[0]?.commit?.author?.name || null,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      homepage: repoData.homepage,
      topics: repoData.topics || [],
    };

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch repository data" },
      { status: 500 },
    );
  }
}
