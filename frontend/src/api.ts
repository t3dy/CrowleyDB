export async function fetchJSON(filename: string) {
  try {
    const response = await fetch(`/data/${filename}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
