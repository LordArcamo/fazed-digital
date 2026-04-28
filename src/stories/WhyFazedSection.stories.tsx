import type { Meta, StoryObj } from '@storybook/react-vite';
import WhyFazedSection from '../components/WhyFazedSection';

const meta: Meta<typeof WhyFazedSection> = {
  title: 'Sections/WhyFazedSection',
  component: WhyFazedSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Differentiators section with 3 animated SVG illustrations (Compass, Chart, Orbit) — each loops independently with GSAP. Cards reveal on scroll.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WhyFazedSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      <WhyFazedSection />
    </div>
  ),
};
