<p align="center">
  <img src="./logo.svg" width="120px"/>
</p>

<h2 align="center">Nested Query Params</h2>

<p align="center">
    A TypeScript implementation of Rack's query string parser.
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/github/commit-activity/m/jamesdphillips/nested-query-params.svg?style=flat" />
  </a>
  <a href="https://github.com/jamesdphillips/nested-query-params/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/jamesdphillips/nested-query-params.svg?style=flat" />
  </a>
  <a href="https://circleci.com/gh/jamesdphillips/nested-query-params/tree/main">
    <img src="https://circleci.com/gh/jamesdphillips/nested-query-params/tree/main.svg?style=svg" />
  </a>
</p>

## Overview

<p align="center">
  <img src="./example.svg" width="560px"/>
</p>

A TypeScript implementation of Rack's [query string parser]. Allows query strings to be expanded into "structural" types; objects, arrays, and string values are supported.

## Installation

```shell
npm i -D nested-query-params
```

## Usage

```typescript
import { parseQuery } from "nested-query-params";

// maps
const map = parseQuery("?foo[bar]=baz");
console.debug(map.foo.bar); // prints "baz"

// arrays
const list = parseQuery("?foo[]=bar&foo[]=baz");
console.debug(list.foo); // prints ["bar", "baz"]

// mixed
const mixed = parseQuery("?bar=baz&foo[bar][]=baz&foo[bar][]=42");
console.debug(mixed); // prints { bar: "baz", foo: { bar: ["baz", "42"] } }
```

[query string parser]: https://github.com/rack/rack/blob/bad8fe37c8867596855dcd0b3fe3030acc6b8621/lib/rack/query_parser.rb#L63