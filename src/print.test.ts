import { printQuery } from "./print";

describe("printQuery", () => {
  it("prints nested keys properly", () => {
    expect(printQuery({})).toEqual("?");
    expect(printQuery({ abc: "123" })).toEqual("?abc=123");
    expect(printQuery({ abc: "123", def: "456" })).toEqual("?abc=123&def=456");
    expect(printQuery({ abc: { def: "123" } })).toEqual("?abc%5Bdef%5D=123");
    expect(printQuery({ abc: ["123"] })).toEqual("?abc%5B%5D=123");
    expect(printQuery({ abc: ["123", "456"] })).toEqual(
      "?abc%5B%5D=123&abc%5B%5D=456",
    );
    expect(printQuery({ abc: [] })).toEqual("?abc%5B%5D=");
  });

  it("may optionally include a namespace", () => {
    expect(printQuery({ abc: "123" }, "ns")).toEqual("?ns%5Babc%5D=123");
    expect(printQuery({ abc: "123", def: "456" }, "ns")).toEqual(
      "?ns%5Babc%5D=123&ns%5Bdef%5D=456",
    );
  });
});
