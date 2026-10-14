import type { Meta, StoryObj } from '@storybook/react-vite';
import TestimonialsSection from '../components/TestimonialsSection';

const meta: Meta<typeof TestimonialsSection> = {
  title: 'Sections/TestimonialsSection',
  component: TestimonialsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '3-card client results grid. Each card shows a real outcome from a case study and links to it. Hover accent top bar; cards fade up on scroll via GSAP ScrollTrigger.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialsSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      <TestimonialsSection />
    </div>
  ),
};
