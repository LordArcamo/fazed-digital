import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Set base path so assets load correctly when served at /storybook/
  viteFinal(config) {
    return {
      ...config,
      base: '/storybook/',
    };
  },
};

export default config;
