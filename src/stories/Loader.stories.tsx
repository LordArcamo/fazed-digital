import type { Meta, StoryObj } from '@storybook/react-vite';
import Loader from '../components/Loader';

// ─── Static preview of loader UI (no animation — for docs) ────────────────────
function LoaderPreview({ progress = 0 }: { progress?: number }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '3rem',
      overflow: 'hidden',
      minHeight: 400,
    }}>
      <div style={{ overflow: 'hidden', lineHeight: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 9vw, 7rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--white)',
          lineHeight: 1,
        }}>
          Fazed<span style={{ fontStyle: 'normal', fontWeight: 300, color: 'var(--gray-500)' }}> Digital</span>
        </div>
      </div>

      <div style={{ width: 'min(420px, 80vw)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-500)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Loading
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--white)', fontWeight: 700 }}>
            {String(progress).padStart(3, '0')}
          </span>
        </div>
        <div style={{ width: '100%', height: '1px', background: 'var(--gray-800)' }}>
          <div style={{
            height: '100%',
            background: 'var(--white)',
            transformOrigin: 'left',
            transform: `scaleX(${progress / 100})`,
          }} />
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Loader> = {
  title: 'UI/Loader',
  component: Loader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'Page load sequence — covers the viewport, counts 0→100, then wipes up. Total ~1.4s. The counter uses GSAP `onUpdate` (shared rAF loop, not `setInterval`). Hides via `display:none` on complete.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  name: 'Live (runs on mount)',
  render: () => (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--black)', position: 'relative' }}>
      <Loader key={Date.now()} />
    </div>
  ),
};

export const StaticEmpty: Story = {
  name: 'Static — 0%',
  render: () => <LoaderPreview progress={0} />,
};

export const StaticHalf: Story = {
  name: 'Static — 50%',
  render: () => <LoaderPreview progress={50} />,
};

export const StaticFull: Story = {
  name: 'Static — 100%',
  render: () => <LoaderPreview progress={100} />,
};
