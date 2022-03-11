import {
  parseQuery,
  parseQueryParamKey,
  SearchParamPathComponentKind,
} from "./main";

describe("parseNestedSearchParamKey", () => {
  it("parses nested keys properly", () => {
    expect(parseQueryParamKey("test")).toEqual([
      [SearchParamPathComponentKind.Map, "test"],
    ]);
    expect(parseQueryParamKey("test[key]")).toEqual([
      [SearchParamPathComponentKind.Map, "test"],
      [SearchParamPathComponentKind.Map, "key"],
    ]);
    expect(parseQueryParamKey("foo[bar][baz]")).toEqual([
      [SearchParamPathComponentKind.Map, "foo"],
      [SearchParamPathComponentKind.Map, "bar"],
      [SearchParamPathComponentKind.Map, "baz"],
    ]);
    expect(parseQueryParamKey("foo[bar][][baz]")).toEqual([
      [SearchParamPathComponentKind.Map, "foo"],
      [SearchParamPathComponentKind.Map, "bar"],
      [SearchParamPathComponentKind.List],
      [SearchParamPathComponentKind.Map, "baz"],
    ]);
    expect(parseQueryParamKey("foo[]")).toEqual([
      [SearchParamPathComponentKind.Map, "foo"],
      [SearchParamPathComponentKind.List],
    ]);
    expect(parseQueryParamKey("foo[][bar][]")).toEqual([
      [SearchParamPathComponentKind.Map, "foo"],
      [SearchParamPathComponentKind.List],
      [SearchParamPathComponentKind.Map, "bar"],
      [SearchParamPathComponentKind.List],
    ]);
  });

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
