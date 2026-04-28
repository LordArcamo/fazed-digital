import type { Meta, StoryObj } from '@storybook/react-vite';
import MarqueeSection from '../components/MarqueeSection';

const meta: Meta<typeof MarqueeSection> = {
  title: 'UI/MarqueeSection',
  component: MarqueeSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Infinitely scrolling ticker strip. Used as a visual separator between sections on all pages. Driven by GSAP — the track animates at –x for exactly half its width, then repeats seamlessly.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarqueeSection>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)', padding: '6rem 0' }}>
      <MarqueeSection />
    </div>
  ),
};

export const BetweenSections: Story = {
  name: 'Between Sections',
  render: () => (
    <div style={{ background: 'var(--black)', fontFamily: 'var(--font-body)' }}>
      {/* Simulated section above */}
      <div style={{
        padding: '4rem var(--gutter)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        borderBottom: '1px solid var(--border)',
        maxWidth: 'var(--container)', margin: '0 auto',
      }}>
        <span className="label" style={{ color: 'var(--accent)' }}>01 · Hero</span>
        <div className="display-md" style={{ color: 'var(--white)' }}>Above Section</div>
      </div>
      <MarqueeSection />
      {/* Simulated section below */}
      <div style={{
        padding: '4rem var(--gutter)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        maxWidth: 'var(--container)', margin: '0 auto',
      }}>
        <span className="label" style={{ color: 'var(--accent)' }}>02 · Content</span>
        <div className="display-md" style={{ color: 'var(--white)' }}>Below Section</div>
      </div>
    </div>
  ),
};
