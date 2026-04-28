import type { Meta, StoryObj } from '@storybook/react-vite';
import StatsSection from '../components/StatsSection';

const meta: Meta<typeof StatsSection> = {
  title: 'Sections/StatsSection',
  component: StatsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Animated counter stats: 120+ Projects, 98% Satisfaction, 6 yrs in business, 4x ROI. Numbers count up on scroll via GSAP. Uses 4-column grid, collapses to 2 cols at 900px, 1 col at 480px.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      {/* Spacer to trigger scroll animation */}
      <div style={{ height: 100 }} />
      <StatsSection />
      <div style={{ height: 100 }} />
    </div>
  ),
};
