import type { Meta, StoryObj } from '@storybook/react-vite';
import ProcessSection from '../components/ProcessSection';

const meta: Meta<typeof ProcessSection> = {
  title: 'Sections/ProcessSection',
  component: ProcessSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '4-step process section: Discover → Strategy → Design → Launch. Cards reveal on scroll, animated dashed connector line with travelling accent pulse. Card icons bounce on hover.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProcessSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      <div style={{ height: 100 }} />
      <ProcessSection />
      <div style={{ height: 100 }} />
    </div>
  ),
};
