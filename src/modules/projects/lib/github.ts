export const fetchRepoInfo = async (githubUrl: string | undefined) => {
  if (!githubUrl) return;

  const response = await fetch(
    `/api/github?url=${encodeURIComponent(githubUrl)}`,
  );

  return await response.json();
};
