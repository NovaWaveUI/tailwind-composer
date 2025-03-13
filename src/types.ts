/**
 * Extracts the variants and their values
 */
export type ExtractVariantProps<T> = T extends (props: infer P) => string
  ? P
  : never;

export type IsBooleanVariant<T> = keyof T extends 'true' | 'false'
  ? boolean
  : keyof T;

export type ClassName = string | string[] | undefined;
