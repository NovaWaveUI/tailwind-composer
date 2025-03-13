import { describe, expect, it } from 'vitest';
import { createSlottedVariants } from '../index';

describe('createSlottedVariants', () => {
  it('should create a slotted variant function', () => {
    const testStyles = createSlottedVariants({
      slots: {
        root: 'flex flex-col',
        header: 'p-4 bg-gray-100',
        title: 'text-lg font-bold',
      },
      variants: {
        color: {
          primary: { root: 'bg-blue-500', title: 'text-white' },
          secondary: {
            root: 'bg-gray-500',
            title: 'text-white',
            header: 'text-gray-700',
          },
        },
        size: {
          sm: { root: 'text-sm', title: 'text-sm' },
          md: { root: 'text-base', title: 'text-base' },
        },
      },
    });

    const { header, root, title } = testStyles({
      color: 'primary',
      size: 'sm',
    });
    expect(root()).toBe('flex flex-col bg-blue-500 text-sm');
    expect(header()).toBe('p-4 bg-gray-100 text-gray-700');
    expect(title()).toBe('text-lg font-bold text-white text-sm');
  });
});
