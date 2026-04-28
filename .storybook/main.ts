import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Inject <base> FIRST in manager head so modulepreload links resolve correctly
  // when Storybook is served at /storybook/ instead of root.
  managerHead: (head) => `<base href="/storybook/" />\n${head}`,

  // Set base path for the preview iframe (stories themselves)
  viteFinal(config) {
    return {
      ...config,
      base: '/storybook/',
    };
  },
};

export default config;
