export function formatParams(params: Record<string, any>): string {
  const url: string[] = [];
  Object.keys(params).map((e) => {
    if (params[e] && params[e] !== '' && params[e] !== undefined) {
      if (typeof params[e] === 'object') {
        if (params[e].join(',') !== '') {
          url.push(`${e}=${params[e]?.join('+')}`);
        }
      } else {
        if (params[e] !== '') {
          url.push(`${e}=${params[e]}`);
        }
      }
    }
  });

  return `${url.join('&')}`;
}
