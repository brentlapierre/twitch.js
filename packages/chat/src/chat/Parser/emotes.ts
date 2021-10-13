export default function emotes (data: any): any {
  const result: any = {};
  const chunks = data.split('/');

  chunks.forEach((chunk: any) => {
    const separator = chunk.indexOf(':');
    const emoteId = chunk.slice(0, separator);

    result[emoteId] = [];

    const indexRanges = chunk.slice(separator + 1).split(',');

    indexRanges.forEach((indexRange: any) => {
      const indexes = indexRange.split('-');
      result[emoteId].push(indexes);
    });
  });

  return result;
}
