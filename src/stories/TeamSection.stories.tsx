import type { Meta, StoryObj } from '@storybook/react-vite';
import TeamSection from '../components/TeamSection';

const meta: Meta<typeof TeamSection> = {
  title: 'Sections/TeamSection',
  component: TeamSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '4-member team section with photo cards. Photos scale on hover with accent border highlight. Falls back to unique SVG portrait illustrations (radial grids, compass rose, code brackets, bullseye) when photos fail to load.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TeamSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      <TeamSection />
    </div>
  ),
};
