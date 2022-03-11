/**
 * TypeScript implementation of Rack's Nested Query Parser.
 *
 * @example
 * // returns { foo: { bar: "baz" } };
 * parseNestedSearchParams("?foo[bar]=baz")
 *
 * @example
 * // returns { foo: { bar: ["baz", "foo"] } };
 * parseNestedSearchParams("?foo[bar][]=baz&foo[bar][]=foo")
 *
 * @link https://github.com/rack/rack/blob/bad8fe37c8867596855dcd0b3fe3030acc6b8621/lib/rack/query_parser.rb#L63-L68
 */

import { splitQuery } from "./util";

type MaybeArray<T> = T | Array<MaybeArray<T>>;

export type SearchParamKey = string;
export type SearchParamVal = MaybeArray<SearchParams | string>;
export type SearchParam = [SearchParamKey, SearchParamVal];
export type SearchParams = {
  [key: SearchParamKey]: SearchParamVal;
};

export enum SearchParamPathComponentKind {
  Map,
  List,
}
export type SearchParamPathComponent =
  | [SearchParamPathComponentKind.Map, string]
  | [SearchParamPathComponentKind.List];

const console = prepareConsole(window.console, "nested-query-params");

/**
 * Expands a search params into structural types. Supported types are Arrays,
 * Objects and basic value types. Heavily inspired by
 * {@link https://github.com/rack/rack/blob/bad8fe37c8867596855dcd0b3fe3030acc6b8621/lib/rack/query_parser.rb#L63-L68|Rack's nested query parser}.
 *
 * @example
 * // returns { one: { two: "3" } };
 * parseQuery("?one[two]=3")
 */
export function parseQuery(query: string): SearchParams {
  const pairs = splitQuery(query);

  return pairs.reduce((acc: SearchParams, [key, value]) => {
    const comps = parseQueryParamKey(key);
    if (Array.isArray(value)) {
      return value.reduce(
        (acc, value) => applyNestedParam(acc, comps, value),
        acc,
      );
    }
    return applyNestedParam(acc, comps, value);
  }, {});
}

/**
 * Parses nested search parameters keys into their individual path components.
 */
export function parseQueryParamKey(
  key: SearchParamKey,
): SearchParamPathComponent[] {
  if (key.trim() === "") {
    return [];
  }
  let start: number;
  if ((start = key.indexOf("[", 1)) === -1) {
    return [[SearchParamPathComponentKind.Map, key]];
  }
  const head = key.slice(0, start);
  const rest = key.slice(start);
  return [
    [SearchParamPathComponentKind.Map, head],
    ...parseQueryParamKeyComponents(rest),
  ];
}

/**
 * Applies given key value pair to search parameters.
 */
function applyNestedParam(
  params: SearchParams,
  comps: SearchParamPathComponent[],
  value: SearchParamVal,
): SearchParams {
  const [head] = comps;
  if (!head) {
    return params;
  }
  if (head[0] !== SearchParamPathComponentKind.Map) {
    console.warn("#applyNestedParam", "cannot apply list op to root");
    return params;
  }
  return applyComponent(params, comps, value) as SearchParams;
}

function applyComponent(
  params: SearchParamVal,
  comps: SearchParamPathComponent[],
  value: SearchParamVal,
): SearchParamVal {
  const log = prepareConsole(console, "#applyComponent");
  const [head, ...rest] = comps;
  if (!head) {
    return params;
  }
  if (head[0] === SearchParamPathComponentKind.Map) {
    if (typeof params !== "object" || Array.isArray(params)) {
      params = {};
    }
    if (rest.length === 0) {
      return {
        ...params,
        [head[1]]: Array.isArray(value) ? value[value.length - 1] : value,
      };
    }
    const key = head[1];
    return {
      ...params,
      [head[1]]: applyComponent(params[key], rest, value),
    };
  }
  if (head[0] === SearchParamPathComponentKind.List) {
    if (!Array.isArray(params)) {
      params = [];
    }
    if (rest.length === 0) {
      return [
        ...(params as string[]),
        ...(Array.isArray(value) ? value : [value]),
      ];
    }
    const [peek] = rest;
    if (peek[0] !== SearchParamPathComponentKind.Map) {
      log.warn("expected map");
      return params;
    }
    const last = params[params.length - 1] || undefined;
    if (typeof last === "object" && !Array.isArray(last) && !last[peek[1]]) {
      const next = applyNestedParam(last, rest, value);
      return [...params.slice(0, -1), next];
    } else if (Array.isArray(last)) {
      log.warn("nested arrays are not supported");
    } else if (last && typeof last !== "object") {
      log.warn("expected map");
    }

    // add value to list if list was previously empty or the given key is
    // already in the map.
    const next = applyNestedParam({}, rest, value);
    return [...params, next];
  }
  return params;
}

function parseQueryParamKeyComponents(
  key: SearchParamKey,
): SearchParamPathComponent[] {
  // list
  if (key.startsWith("[]")) {
    return [
      [SearchParamPathComponentKind.List],
      ...parseQueryParamKeyComponents(key.slice(2)),
    ];
  }
  // map
  let start: number;
  if (key.startsWith("[") && (start = key.indexOf("]", 1)) !== -1) {
    return [
      [SearchParamPathComponentKind.Map, key.slice(1, start)],
      ...parseQueryParamKeyComponents(key.slice(start + 1)),
    ];
  }
  return [];
}

interface Console {
  info(..._: any): void;
  warn(..._: any): void;
  debug(..._: any): void;
  error(..._: any): void;
}

function prepareConsole(parent: Console, ...init: any[]): Console {
  return (["info", "error", "warn", "debug"] as const).reduce(
    (acc, method) => ({
      [method]: (...msgs: any[]) => parent[method](...init, ...msgs),
      ...acc,
    }),
    {} as Console,
  );
}
