export const calculateLanguagePercentages = (
  languages: Record<string, number>,
) => {
  const total = Object.values(languages).reduce((acc, val) => acc + val, 0);
  return Object.entries(languages)
    .map(([lang, bytes]) => ({
      name: lang,
      percentage: ((bytes / total) * 100).toFixed(1),
      bytes,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5);
};
