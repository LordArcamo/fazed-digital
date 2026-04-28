import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageStrip from '../components/ImageStrip';

const meta: Meta<typeof ImageStrip> = {
  title: 'UI/ImageStrip',
  component: ImageStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '3-panel horizontal image strip — middle panel is wider (flex 1.35). Each panel has parallax-scale on hover with overlay lift, lime accent top bar, and label slide. Panels fade-up on scroll via GSAP.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageStrip>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      <ImageStrip />
    </div>
  ),
};
