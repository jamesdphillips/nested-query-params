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

export * from "./parse";
export * from "./print";
export * from "./types";
