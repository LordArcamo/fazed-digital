import type { Meta, StoryObj } from '@storybook/react-vite';

// ─── Color swatch component ───────────────────────────────────────────────────
function Swatch({ name, value, textDark = false }: { name: string; value: string; textDark?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 120 }}>
      <div style={{
        width: '100%', height: 80, borderRadius: 8,
        background: value,
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--white)', letterSpacing: '0.05em' }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)', letterSpacing: '0.05em' }}>{value}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.25rem' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function AllColors() {
  return (
    <div style={{ padding: '2rem', maxWidth: 900, fontFamily: 'var(--font-body)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--white)' }}>
        Color System
      </h1>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '3rem' }}>
        All design tokens from <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>src/styles/global.css</code>
      </p>

      <Section title="Core">
        <Swatch name="--black" value="#090909" />
        <Swatch name="--white" value="#F5F4F0" textDark />
      </Section>

      <Section title="Grayscale Ladder">
        <Swatch name="--gray-900" value="#111111" />
        <Swatch name="--gray-800" value="#1C1C1C" />
        <Swatch name="--gray-700" value="#2A2A2A" />
        <Swatch name="--gray-600" value="#404040" />
        <Swatch name="--gray-500" value="#676767" />
        <Swatch name="--gray-400" value="#939393" />
        <Swatch name="--gray-300" value="#BCBCBC" />
        <Swatch name="--gray-200" value="#DCDCDC" />
        <Swatch name="--gray-100" value="#EFEFEB" />
      </Section>

      <Section title="Accent — Electric Lime">
        <Swatch name="--accent" value="#C9FF57" textDark />
        <Swatch name="--accent-dark" value="#9FCC2E" textDark />
        <Swatch name="--accent-muted" value="rgba(201,255,87,0.10)" />
        <Swatch name="--accent-border" value="rgba(201,255,87,0.25)" />
      </Section>

      <Section title="Semantic Aliases">
        <Swatch name="--bg" value="#090909" />
        <Swatch name="--surface" value="#111111" />
        <Swatch name="--border" value="#2A2A2A" />
        <Swatch name="--text" value="#F5F4F0" textDark />
        <Swatch name="--muted" value="#676767" />
      </Section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: { description: { component: 'All color design tokens used across Fazed Digital.' } },
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  name: 'All Colors',
  render: () => <AllColors />,
};

export const CorePalette: Story = {
  name: 'Core Palette',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <Swatch name="--black" value="#090909" />
      <Swatch name="--white" value="#F5F4F0" textDark />
      <Swatch name="--accent" value="#C9FF57" textDark />
      <Swatch name="--accent-dark" value="#9FCC2E" textDark />
    </div>
  ),
};

export const GrayscaleLadder: Story = {
  name: 'Grayscale Ladder',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {[
        { name: '--gray-900', value: '#111111', height: 120 },
        { name: '--gray-800', value: '#1C1C1C', height: 110 },
        { name: '--gray-700', value: '#2A2A2A', height: 100 },
        { name: '--gray-600', value: '#404040', height: 90 },
        { name: '--gray-500', value: '#676767', height: 80 },
        { name: '--gray-400', value: '#939393', height: 70 },
        { name: '--gray-300', value: '#BCBCBC', height: 60 },
        { name: '--gray-200', value: '#DCDCDC', height: 50 },
        { name: '--gray-100', value: '#EFEFEB', height: 40 },
      ].map(({ name, value, height }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', minWidth: 80 }}>
          <div style={{
            width: 80, height,
            background: value,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.06)',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-400)', letterSpacing: '0.05em', textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
