import type { Meta, StoryObj } from '@storybook/react';
import Loader from '../components/Loader';

const meta: Meta<typeof Loader> = {
  title: 'UI/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-screen page loader with GSAP-animated percentage counter and progress bar. Runs once on mount and exits upward when complete.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--black)', position: 'relative' }}>
      <Loader />
    </div>
  ),
};
