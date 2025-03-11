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
export type VariantDefNoSlots = Record<string, Record<string, string>>;

export type VariantNoSlots<
  TVariants extends Record<string, Record<string, string>>
> = TVariants;

export interface NonSlotConfig<TVariants extends VariantDefNoSlots> {
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
  variants: VariantNoSlots<TVariants>;

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

export type VariantValue<TVariants extends VariantDefNoSlots> = Partial<{
  [K in keyof TVariants]: keyof TVariants[K];
}>;

export type NonSlotVariantReturn<TVariants extends VariantDefNoSlots> = {
  (
    variantValues?: Partial<{ [K in keyof TVariants]: keyof TVariants[K] }>
  ): string;
  extend: (
    config: Partial<NonSlotConfig<TVariants>>
  ) => NonSlotVariantReturn<TVariants>;
};
