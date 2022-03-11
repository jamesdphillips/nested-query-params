type QueryPair = [key: string, val: string];
type QueryPairs = QueryPair[];

export function splitQuery(search: string) {
  // remove first '?'
  if (search.indexOf("?") === 0) {
    search = search.slice(1);
  }

  const pairs = search.split("&");
  return pairs.reduce((acc: QueryPairs, value) => {
    const index = value.indexOf("=");
    if (index > -1) {
      return [
        ...acc,
        [
          decode(value.slice(0, index)),
          decode(value.slice(index + 1)),
        ] as QueryPair,
      ];
    }
    return [...acc, [decode(value), ""] as QueryPair];
  }, []);
}

function decode(str: string) {
  return str
    .replace(/[ +]/g, "%20")
    .replace(/(%[a-f0-9]{2})+/gi, function (match) {
      return decodeURIComponent(match);
    });
}
