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
        component: '3-card testimonials grid with star ratings, drawn quote-mark SVG, hover accent top bar, and a trust-stats row below. Cards fade-up on scroll via GSAP ScrollTrigger.',
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
