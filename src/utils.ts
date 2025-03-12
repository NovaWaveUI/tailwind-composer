/**
 * Utility functions for type checking and validation.
 */

/**
 * Checks if the given value is a boolean (whether it is a boolean type or a string that can be converted to a boolean).
 * @param value - The value to check.
 * @return True if the value is a boolean or a string that can be converted to a boolean, false otherwise.
 */
export const isBoolean = (value: unknown): boolean => {
  // Check if the value is a boolean
  if (typeof value === 'boolean') {
    return true;
  }

  // Check if the value is a string and can be converted to a boolean
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    return lowerValue === 'true' || lowerValue === 'false';
  }
  return false;
};
