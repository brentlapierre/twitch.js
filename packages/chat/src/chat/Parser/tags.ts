export default function tags (data: any): any {
  const result: any = {};
  const chunks = data.split(';');

  chunks.forEach((chunk: any) => {
    const separator = chunk.indexOf('=');
    const tagName = chunk.slice(0, separator);

    result[tagName] = chunk.slice(separator + 1) || null;
  });

  return result;
}
