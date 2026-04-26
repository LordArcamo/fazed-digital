import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark',  value: '#070707' },
        { name: 'gray',  value: '#111111' },
        { name: 'light', value: '#F0EFEC' },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'Syne, Plus Jakarta Sans, sans-serif', minWidth: 320 }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <Story />
      </div>
    ),
  ],
};

export default preview;
