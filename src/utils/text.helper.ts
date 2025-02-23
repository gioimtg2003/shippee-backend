export const parseJsonSafely = (json: string | any) => {
  if (!json) return {};
  if (typeof json === 'string') {
    try {
      const data = JSON.parse(json ?? '');
      return data;
    } catch {
      return json;
    }
  }

  return json;
};
