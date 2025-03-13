/**
 * Functions that are used to help merge two configurations
 */

import { VariantDefNoSlots } from './types/non-slots';

export const mergeVariantsNoSlots = <
  OldVariants extends VariantDefNoSlots,
  NewVariants extends VariantDefNoSlots
>(
  oldVariants: OldVariants,
  newVariants: NewVariants
): OldVariants & NewVariants => {
  const mergedVariants: Partial<OldVariants & NewVariants> = {};

  // Go through each variant in the old variants
  for (const variant in oldVariants) {
    // Start off the new merged value as the old value
    const mergedValue = { ...oldVariants[variant] };

    // If the variant is also in the new variants, merge the values
    if (newVariants.hasOwnProperty(variant)) {
      for (const value in newVariants[variant]) {
        // Add or overwrite the value from newVariants
        (mergedValue as any)[value] = newVariants[variant][value];
      }
    }

    // Add the merged value to the merged variants
    (mergedVariants as any)[variant] = mergedValue;
  }

  // Add any remaining new variants that were not in old variants
  for (const variant in newVariants) {
    if (!oldVariants.hasOwnProperty(variant)) {
      (mergedVariants as any)[variant] = newVariants[variant];
    }
  }

  return mergedVariants as OldVariants & NewVariants;
};
