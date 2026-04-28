import type { Meta, StoryObj } from '@storybook/react-vite';
import Nav from '../components/Nav';

const meta: Meta<typeof Nav> = {
  title: 'UI/Nav',
  component: Nav,
  tags: ['autodocs'],
  argTypes: {
    currentPath: {
      control: 'select',
      options: ['/', '/about', '/services', '/work', '/blog', '/contact'],
      description: 'Active route — highlights the matching nav link with accent dot',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-screen overlay navigation with GSAP clip-path wipe animation. Fixed header with logo + hamburger toggle. Uses `mixBlendMode: difference` so the bar is visible over any background.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const Default: Story = {
  name: 'Closed (Default)',
  args: { currentPath: '/' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
      <div style={{ padding: '8rem 3rem', fontFamily: 'var(--font-body)', color: 'var(--gray-600)', fontSize: '0.875rem' }}>
        Click the hamburger icon (top right) to open the menu overlay.
      </div>
    </div>
  ),
};

export const HomeActive: Story = {
  name: 'Active: Home',
  args: { currentPath: '/' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
    </div>
  ),
};

export const AboutActive: Story = {
  name: 'Active: About',
  args: { currentPath: '/about' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
    </div>
  ),
};

export const ServicesActive: Story = {
  name: 'Active: Services',
  args: { currentPath: '/services' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
    </div>
  ),
};

export const WorkActive: Story = {
  name: 'Active: Work',
  args: { currentPath: '/work' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
    </div>
  ),
};

export const ContactActive: Story = {
  name: 'Active: Contact',
  args: { currentPath: '/contact' },
  render: (args) => (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Nav {...args} />
    </div>
  ),
};
