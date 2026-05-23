export async function fetchJSON(filename: string) {
  try {
    const basePath = window.location.pathname.endsWith('/')
      ? window.location.pathname
      : window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/') + 1);
    const response = await fetch(`${window.location.origin}${basePath}data/${filename}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
