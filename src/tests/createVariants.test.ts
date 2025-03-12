import { describe, it, expect } from 'vitest';
import { createNonSlotVariants } from '../index';
import { NonSlotConfig } from '../types';

// filepath: /workspaces/tailwind-composer/src/tests/createVariants.test.ts

describe('createNonSlotVariants', () => {
  it('should return base styles when no variants are provided', () => {
    const getClassName = createNonSlotVariants({
      base: 'base-style',
      variants: {},
    });
    expect(getClassName()).toBe('base-style');
  });

  it('should apply default variants', () => {
    const getClassName = createNonSlotVariants({
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
    });
    expect(getClassName()).toBe('base-style text-blue-50');
  });

  it('should apply provided variants', () => {
    const getClassName = createNonSlotVariants({
      base: 'base-style',
      variants: {
        color: {
          primary: 'text-blue-50',
          secondary: 'text-purple-50',
        },
      },
    });
    expect(getClassName({ color: 'secondary' })).toBe(
      'base-style text-purple-50'
    );
    expect(getClassName({ color: 'primary' })).toBe('base-style text-blue-50');
  });

  it('should apply compound variants', () => {
    const getClassName = createNonSlotVariants({
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
    });
    expect(getClassName({ color: 'primary', size: 'large' })).toBe(
      'base-style text-blue-50 text-lg compound-class'
    );
  });

  it('should handle conflicting classes', () => {
    const getClassName = createNonSlotVariants({
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
    });
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
    const getClassName = createNonSlotVariants({
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
    });
    expect(getClassName()).toBe('base-style text-blue-50 text-sm');
    expect(getClassName({ color: 'secondary' })).toBe(
      'base-style text-purple-50 text-sm'
    );
  });

  it('should handle extending variants', () => {
    const getClassName = createNonSlotVariants({
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
    });
    expect(getClassName()).toBe('base-style text-blue-50');

    const getExtendedClassName = getClassName.extend({
      variants: {
        color: {
          warning: 'text-yellow-50',
        },
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
    });
    expect(getExtendedClassName({ size: 'large' })).toBe(
      'base-style text-blue-50 text-lg'
    );
    expect(getExtendedClassName({ color: 'warning' })).toBe(
      'base-style text-yellow-50 text-sm'
    );
    expect(getExtendedClassName({ color: 'secondary', size: 'small' })).toBe(
      'base-style text-purple-50 text-sm'
    );
    expect(getExtendedClassName({ color: 'primary', size: 'large' })).toBe(
      'base-style text-blue-50 text-lg'
    );
    expect(getExtendedClassName()).toBe('base-style text-blue-50 text-sm');
  });

  it('should handle a test of real world examples', () => {
    const novaWaveIconStyles = createNonSlotVariants({
      base: '',
      variants: {
        color: {
          primary: 'text-primary',
          secondary: 'text-secondary',
          success: 'text-success',
          warning: 'text-warning',
          danger: 'text-danger',
          auto: 'text-auto',
        },
      },
      defaultVariants: {
        color: 'auto',
      },
    });

    expect(novaWaveIconStyles()).toBe('text-auto');
    expect(novaWaveIconStyles({ color: 'primary' })).toBe('text-primary');
    expect(novaWaveIconStyles({ color: 'secondary' })).toBe('text-secondary');
    expect(novaWaveIconStyles({ color: 'success' })).toBe('text-success');
    expect(novaWaveIconStyles({ color: 'warning' })).toBe('text-warning');
    expect(novaWaveIconStyles({ color: 'danger' })).toBe('text-danger');
    expect(novaWaveIconStyles({ color: 'auto' })).toBe('text-auto');

    const extendedNovaWaveIconStyles = novaWaveIconStyles.extend({
      variants: {
        color: {
          // You can add new values to existing variants!
          brand: 'text-brand',
          // You can override!
          primary: 'text-primary-test',
        },
        // You can even add new variants!
        size: {
          small: 'text-sm',
          large: 'text-lg',
        },
      },
    });

    expect(extendedNovaWaveIconStyles()).toBe('text-auto text-sm');
    expect(extendedNovaWaveIconStyles({ color: 'primary' })).toBe(
      'text-primary-test text-sm'
    );
    expect(extendedNovaWaveIconStyles({ size: 'large' })).toBe(
      'text-auto text-lg'
    );
  });
});
