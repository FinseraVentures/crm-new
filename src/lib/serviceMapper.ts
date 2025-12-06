// utils/serviceMappers.ts
export interface ApiService {
  _id: string;
  label: string;
  value?: string;
  status: boolean;
  [k: string]: any;
}

export interface Service {
  _id: string;
  label: string;
  value: string;
  status: boolean;
}

/** slugify "Y Combinator" -> "y-combinator" */
export const slugify = (s: string) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Guarantee a Service object (ensures .value exists) */
export const mapApiToService = (a: ApiService): Service => {
  const value =
    a.value && a.value.trim() !== "" ? a.value : slugify(a.label || a._id);
  return {
    _id: a._id,
    label: a.label,
    value,
    status: Boolean(a.status),
  };
};

export const mapApiArrayToServiceArray = (arr: ApiService[] = []): Service[] =>
  arr.map(mapApiToService);
// config/env.ts