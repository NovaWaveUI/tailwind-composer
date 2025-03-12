import { twMerge } from 'tailwind-merge';
import {
  NonSlotConfig,
  VariantDefNoSlots,
  NonSlotVariantReturn,
  VariantValue,
} from './types';
import { mergeVariantsNoSlots } from './merge';

export function createNonSlotVariants<TVariants extends VariantDefNoSlots>(
  config: NonSlotConfig<TVariants>
): NonSlotVariantReturn<TVariants> {
  // Expand the config
  const {
    base: baseProp = '',
    extends: extendsProp = [],
    variants = {},
    compoundVariants = [],
    defaultVariants = {},
  } = config;

  // Declare the base style
  // If the base style exists and is a string, use it
  // If the base style exists and is an array, join it
  // If the base style does not exist, use an empty string
  const base = Array.isArray(baseProp) ? baseProp.join(' ') : baseProp ?? '';

  // Skipping extends for now

  // Now make a function in which the properties is an object that takes in the
  // variant name for the key and one of the valid variant values for the value
  const variantFunction = (props: VariantValue<TVariants> = {}) => {
    let resultingStyle = base;

    // Also keep track of the variant resolved values to use in compound variants
    const resolvedValues = {};

    // Go through each variant and take the value from the props
    // If the value is not defined, use the default value
    // If the value is defined, use that value
    // If the value is not defined in the default value and not defined here
    // use the first value in the variant
    for (const variant in variants) {
      // If props is undefined, try to use the default value off the bat
      const variantValue =
        props?.[variant] ??
        defaultVariants[variant] ??
        Object.keys(variants[variant])[0];

      // Merge the style with the base style
      resultingStyle = twMerge(resultingStyle, variants[variant][variantValue]);

      // Add the resolved value to the resolved values
      resolvedValues[variant] = variantValue;
    }

    // Now go through each compound variant and see if it matches
    for (const compoundVariant of compoundVariants) {
      // Check if the compound variant matches
      let matches = false;

      for (const key in compoundVariant) {
        if (key === 'className') continue;

        const value = compoundVariant[key];
        const resolvedValue = resolvedValues[key];

        // If the value is an array, check if the resolved value is in the array
        // If the value is not an array, check if the resolved value is equal to the value
        if (Array.isArray(value)) {
          matches = value.includes(resolvedValue);
        } else {
          matches = resolvedValue === value;
        }
        if (!matches) break;
      }

      // If it matches, add the className to the resulting style
      if (matches) {
        resultingStyle = twMerge(resultingStyle, compoundVariant.className);
      }
    }

    return resultingStyle;
  };

  /**
   *
   * @param newConfig The new additional configuration to add to the variant function
   * @returns
   */
  variantFunction.extend = <TNewVariants extends VariantDefNoSlots>(
    newConfig: Partial<NonSlotConfig<TNewVariants>>
  ): NonSlotVariantReturn<TVariants & TNewVariants> => {
    const extendedVariants = mergeVariantsNoSlots(
      variants,
      newConfig.variants ?? {}
    );
    const extendedDefaultVariants = {
      ...defaultVariants,
      ...(newConfig.defaultVariants ?? {}),
    };
    const extendedCompoundVariants = [
      ...compoundVariants,
      ...(newConfig.compoundVariants ?? []),
    ];
    const extendedBase = twMerge(base, newConfig.base ?? '');

    return createNonSlotVariants<TVariants & TNewVariants>({
      base: extendedBase,
      extends: [...extendsProp, ...(newConfig.extends ?? [])],
      variants: extendedVariants as TVariants & TNewVariants,
      compoundVariants: extendedCompoundVariants,
      defaultVariants: extendedDefaultVariants,
    });
  };

  // Now for now, we will return the variant function
  return variantFunction;
}
