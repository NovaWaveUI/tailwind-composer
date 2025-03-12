/**
 * Non-slot types
 */

/**
 * The defintion for the variants for a non-slot configuration
 *
 * @example
 * ```
 * {
 *  color: {
 *      primary: 'text-blue-50'
 *      secondary: 'text-purple-50'
 *  },
 *  size: {
 *      xs: 'small'
 *  }
 * }
 */

export type VariantDefNoSlots = {
  [key: string]: { [value: string]: string };
};

export type VariantKeys<TVariants extends VariantDefNoSlots> = keyof TVariants;

export type VariantValues<
  TVariants extends VariantDefNoSlots,
  K extends keyof TVariants
> = keyof TVariants[K];

export type VariantValue<TVariants extends VariantDefNoSlots> = {
  [K in keyof TVariants]?: VariantValues<TVariants, K>;
};

export type VariantNoSlots<
  TVariants extends Record<string, Record<string, string>>
> = TVariants;

export interface NonSlotConfig<TVariants extends Record<string, any>> {
  /**
   * The base styles of the component
   */
  base?: string | string[];

  /**
   * A set of predefined styles
   */
  extends?: string[];

  /**
   * The variants for the component
   */
  variants: TVariants;

  /**
   * A combination of different variants and when they would apply
   */
  compoundVariants?: Array<
    {
      [K in keyof TVariants]?: keyof TVariants[K] | Array<keyof TVariants[K]>;
    } & { className: string }
  >;

  /**
   * The default values for the variants
   */
  defaultVariants?: {
    [K in keyof TVariants]?: keyof TVariants[K];
  };
}

export type NonSlotVariantReturn<TVariants extends VariantDefNoSlots> = {
  (variantValues?: VariantValue<TVariants>): string;
  extend: <TNewVariants extends VariantDefNoSlots>(
    config: Partial<NonSlotConfig<TNewVariants>>
  ) => NonSlotVariantReturn<TVariants & TNewVariants>;
};
