export type MaybeArray<T> = T | Array<MaybeArray<T>>;

export type QueryParamKey = string;
export type QueryParamVal = MaybeArray<SearchParams | string>;
export type QueryParam = [QueryParamKey, QueryParamVal];
export type QueryParams = {
  [key: QueryParamKey]: SearchParamVal;
};

export enum QueryParamPathComponentKind {
  Map,
  List,
}
export type QueryParamPathComponent =
  | [QueryParamPathComponentKind.Map, string]
  | [QueryParamPathComponentKind.List];

// Backward compat, will be removed in a future release
export type SearchParamKey = QueryParamKey;
export type SearchParamVal = QueryParamVal;
export type SearchParam = QueryParam;
export type SearchParams = QueryParams;
export type SearchParamPathComponentKind = QueryParamPathComponentKind;
export type SearchParamPathComponent = QueryParamPathComponent;
