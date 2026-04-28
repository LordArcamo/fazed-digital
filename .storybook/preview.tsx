import type { Preview } from '@storybook/react-vite';
import '../src/styles/global.css';

// Load all fonts used in the design system
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
document.head.appendChild(fontLink);

// Clash Display from Fontshare
const clashLink = document.createElement('link');
clashLink.rel = 'stylesheet';
clashLink.href = 'https://api.fontshare.com/v2/css?f[]=clash-display@300,400,500,600,700&display=swap';
document.head.appendChild(clashLink);

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark:  { name: 'dark',  value: '#090909' },
        gray:  { name: 'gray',  value: '#111111' },
        light: { name: 'light', value: '#F0EFEC' },
      },
      default: 'dark',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    docs: {
      theme: undefined,
    },
  },

  decorators: [
    (Story) => (
      <div style={{ fontFamily: 'var(--font-body, "Plus Jakarta Sans", system-ui, sans-serif)', minWidth: 320 }}>
        <Story />
      </div>
    ),
  ],

  initialGlobals: {
    backgrounds: { value: 'dark' },
  },
};

export default preview;
