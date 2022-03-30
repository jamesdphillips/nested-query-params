import { QueryParams, QueryParamVal } from "./types";

/**
 * Serializes the given object to a valid query parameter string. Supported
 * types are Arrays, Objects and basic value types. Heavily inspired by
 * {@link https://github.com/rails/rails/blob/main/activesupport/lib/active_support/core_ext/object/to_query.rb#L61-L89|Rack's nested query parser}.
 *
 * @example
 * // returns "?one[two]=3";
 * parseQuery({ one: { two: "3" } });
 */
export function printQuery(query: QueryParams, ns?: string): string {
  return "?" + printQueryParams(query, ns);
}

export function printQueryParams(query: QueryParams, ns?: string): string {
  const makeKey = (key: string) => (ns ? `${ns}[${key}]` : key);
  return Object.entries(query)
    .map(([key, val]) => printQueryParamVal(val, makeKey(key)))
    .join("&");
}

export function printQueryParamVal(query: QueryParamVal, ns: string): string {
  if (typeof query === "object") {
    if (!Array.isArray(query)) {
      return printQueryParams(query, ns);
    }
    const prefix = `${ns}[]`;
    if (query.length === 0) {
      return printQueryParamVal("", prefix);
    }
    return query.map((q) => printQueryParamVal(q, prefix)).join("&");
  }
  return `${encode(ns)}=${encode(query)}`;
}

function encode(str: string) {
  return encodeURIComponent(str);
}
