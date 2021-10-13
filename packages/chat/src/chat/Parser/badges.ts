export default function badges (data: string): any {
  const result: any = {};
  const chunks = data.split(','); // Separate each badge type

  chunks.forEach((chunk) => {
    const separator = chunk.indexOf('/');
    const name = chunk.slice(0, separator);

    result[name] = chunk.slice(separator + 1) || null;
  });

  return result;
}
