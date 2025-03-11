import { describe, it, expect } from 'vitest';
import { createNonSlotVariants } from '../index';
import { NonSlotConfig } from '../types';

// filepath: /workspaces/tailwind-composer/src/tests/createVariants.test.ts

describe('createNonSlotVariants', () => {
  it('should return base styles when no variants are provided', () => {
    const config = {
      base: 'base-style',
      variants: {},
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName()).toBe('base-style');
  });

  it('should apply default variants', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
      },
      defaultVariants: {
        color: 'primary',
      },
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName()).toBe('base-style text-blue-50');
  });

  it('should apply provided variants', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
      },
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName({ color: 'secondary' })).toBe(
      'base-style text-purple-50'
    );
  });

  it('should apply compound variants', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          size: 'large',
          className: 'compound-class',
        },
      ],
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName({ color: 'primary', size: 'large' })).toBe(
      'base-style text-blue-50 text-lg compound-class'
    );
  });

  it('should handle conflicting classes', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style text-md',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          size: 'large',
          className: 'compound-class',
        },
      ],
      defaultVariants: {
        color: 'primary',
        size: 'large',
      },
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName()).toBe(
      'base-style text-blue-50 text-lg compound-class'
    );
    expect(getClassName({ color: 'secondary' })).toBe(
      'base-style text-purple-50 text-lg'
    );
    expect(getClassName({ size: 'small' })).toBe(
      'base-style text-blue-50 text-sm'
    );
  });

  it('should still handle resolving classes when no default variants are provided', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName()).toBe('base-style text-blue-50 text-sm');
    expect(getClassName({ color: 'secondary' })).toBe(
      'base-style text-purple-50 text-sm'
    );
  });

  it('should handle extending variants', () => {
    const config: NonSlotConfig<any> = {
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
      },
      defaultVariants: {
        color: 'primary',
      },
    };

    const getClassName = createNonSlotVariants(config);
    expect(getClassName()).toBe('base-style text-blue-50');

    const getExtendedClassName = getClassName.extend({
      variants: {
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
    });
    expect(getExtendedClassName({ size: 'large' })).toBe(
      'base-style text-blue-50 text-lg'
    );
  });
});
