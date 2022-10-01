export const serverFetch = async <T>(url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(res.statusText);
  }

  const json = await res.json();
  return json as T;
};
