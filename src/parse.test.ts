import { parseQuery, parseQueryParamKey } from "./parse";
import { QueryParamPathComponentKind } from "./types";

describe("parseSearchParamKey", () => {
  it("parses nested keys properly", () => {
    expect(parseQueryParamKey("test")).toEqual([
      [QueryParamPathComponentKind.Map, "test"],
    ]);
    expect(parseQueryParamKey("test[key]")).toEqual([
      [QueryParamPathComponentKind.Map, "test"],
      [QueryParamPathComponentKind.Map, "key"],
    ]);
    expect(parseQueryParamKey("foo[bar][baz]")).toEqual([
      [QueryParamPathComponentKind.Map, "foo"],
      [QueryParamPathComponentKind.Map, "bar"],
      [QueryParamPathComponentKind.Map, "baz"],
    ]);
    expect(parseQueryParamKey("foo[bar][][baz]")).toEqual([
      [QueryParamPathComponentKind.Map, "foo"],
      [QueryParamPathComponentKind.Map, "bar"],
      [QueryParamPathComponentKind.List],
      [QueryParamPathComponentKind.Map, "baz"],
    ]);
    expect(parseQueryParamKey("foo[]")).toEqual([
      [QueryParamPathComponentKind.Map, "foo"],
      [QueryParamPathComponentKind.List],
    ]);
    expect(parseQueryParamKey("foo[][bar][]")).toEqual([
      [QueryParamPathComponentKind.Map, "foo"],
      [QueryParamPathComponentKind.List],
      [QueryParamPathComponentKind.Map, "bar"],
      [QueryParamPathComponentKind.List],
    ]);
  });
});

describe("parseQuery", () => {
  it("parses nested queries properly", () => {
    expect(parseQuery("?foo=bar")).toEqual({
      foo: "bar",
    });
    expect(parseQuery("?foo")).toEqual({
      foo: "",
    });
    expect(parseQuery("?foo=")).toEqual({
      foo: "",
    });
    expect(parseQuery("?foo=bar&foo=baz")).toEqual({
      foo: "baz",
    });
    expect(parseQuery("?foo&foo=")).toEqual({
      foo: "",
    });
    expect(parseQuery("?foo&foo=")).toEqual({
      foo: "",
    });
    expect(parseQuery("?foo=1&bar=2")).toEqual({
      foo: "1",
      bar: "2",
    });
    expect(parseQuery("?foo[]")).toEqual({
      foo: [""],
    });
    expect(parseQuery("?foo[]=")).toEqual({
      foo: [""],
    });
    expect(parseQuery("?foo[]=bar")).toEqual({
      foo: ["bar"],
    });
    expect(parseQuery("?foo[]=bar&foo[]")).toEqual({
      foo: ["bar", ""],
    });
    expect(parseQuery("?foo[]=bar&foo[]=")).toEqual({
      foo: ["bar", ""],
    });
    expect(parseQuery("?foo=bar&baz[]=1&baz[]=2&baz[]=3")).toEqual({
      foo: "bar",
      baz: ["1", "2", "3"],
    });
    expect(parseQuery("?foo[]=bar&baz[]=1&baz[]=2&baz[]=3")).toEqual({
      foo: ["bar"],
      baz: ["1", "2", "3"],
    });
    expect(parseQuery("?x[y][z]")).toEqual({
      x: { y: { z: "" } },
    });
    expect(parseQuery("?x[y][z]=1")).toEqual({
      x: { y: { z: "1" } },
    });
    expect(parseQuery("?x[y][z]=1&x[y][z]=2")).toEqual({
      x: { y: { z: "2" } },
    });
    expect(parseQuery("?x[y][z][]=1&x[y][z][]=2")).toEqual({
      x: { y: { z: ["1", "2"] } },
    });
    expect(parseQuery("?x[y][][z]=1")).toEqual({
      x: { y: [{ z: "1" }] },
    });
    expect(parseQuery("?x[y][][z][]=1")).toEqual({
      x: { y: [{ z: ["1"] }] },
    });
    expect(parseQuery("?x[y][][z]=1&x[y][][w]=2")).toEqual({
      x: { y: [{ z: "1", w: "2" }] },
    });
    expect(parseQuery("?x[y][][v][w]=1")).toEqual({
      x: { y: [{ v: { w: "1" } }] },
    });
    expect(parseQuery("?x[y][][z]=1&x[y][][v][w]=2")).toEqual({
      x: { y: [{ z: "1", v: { w: "2" } }] },
    });
    expect(parseQuery("?x[y][][z]=1&x[y][][z]=2")).toEqual({
      x: { y: [{ z: "1" }, { z: "2" }] },
    });
    expect(parseQuery("?foo[bar]=baz")).toEqual({
      foo: { bar: "baz" },
    });
    expect(parseQuery("?foo[bar][]=baz&foo[bar][]=foo")).toEqual({
      foo: { bar: ["baz", "foo"] },
    });
  });
});
