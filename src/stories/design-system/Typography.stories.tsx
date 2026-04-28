import type { Meta, StoryObj } from '@storybook/react-vite';

// ─── Type specimen row ────────────────────────────────────────────────────────
function Specimen({
  className,
  label,
  text,
  meta,
  element: El = 'div',
}: {
  className?: string;
  label: string;
  text: string;
  meta: string;
  element?: keyof JSX.IntrinsicElements;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      gap: '1.5rem',
      alignItems: 'start',
      padding: '1.75rem 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-600)', letterSpacing: '0.06em' }}>
          {meta}
        </div>
      </div>
      {/* @ts-expect-error dynamic element */}
      <El className={className} style={{ color: 'var(--white)', margin: 0 }}>
        {text}
      {/* @ts-expect-error closing dynamic */}
      </El>
    </div>
  );
}

function FontSwatch({ family, label, weights }: { family: string; label: string; weights: number[] }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {weights.map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-600)', minWidth: 40 }}>{w}</span>
            <span style={{ fontFamily: family, fontWeight: w, fontSize: '1.5rem', color: 'var(--white)' }}>
              Fazed Digital — AaBbCcDdEe 0123
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllTypography() {
  return (
    <div style={{ padding: '2rem', maxWidth: 960, fontFamily: 'var(--font-body)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--white)' }}>
        Typography System
      </h1>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '3rem' }}>
        All type scale classes — <strong style={{ color: 'var(--white)' }}>Clash Display</strong> for headings, <strong style={{ color: 'var(--white)' }}>Plus Jakarta Sans</strong> for body, <strong style={{ color: 'var(--white)' }}>Space Mono</strong> for labels.
      </p>

      {/* Type scale specimens */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
          Display Scale
        </div>
        <Specimen className="display-xl" label="display-xl" text="Bold Digital" meta="Clash Display · 700 · clamp(4.5rem→13rem) · lh 0.88" element="h1" />
        <Specimen className="display-lg" label="display-lg" text="We Build Things" meta="Clash Display · 700 · clamp(3rem→8.5rem) · lh 0.91" element="h2" />
        <Specimen className="display-md" label="display-md" text="Services for Ambition" meta="Clash Display · 700 · clamp(2.25rem→5rem) · lh 0.95" element="h2" />
        <Specimen className="display-sm" label="display-sm" text="Creative Direction" meta="Clash Display · 600 · clamp(1.75rem→3rem) · lh 1.05" element="h3" />
        <Specimen className="heading" label=".heading" text="Section Heading" meta="Clash Display · 600 · clamp(1.25rem→1.75rem) · lh 1.15" element="h4" />
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
          Body & Utility
        </div>
        <Specimen className="label" label=".label" text="SECTION 01 · OVERVIEW" meta="Space Mono · 400 · 0.72rem · ls 0.18em · uppercase" />
        <Specimen className="body-lg" label=".body-lg" text="A Brisbane-based creative agency combining design excellence, digital strategy, and technical expertise to build brands that matter." meta="Plus Jakarta Sans · clamp(1rem→1.2rem) · lh 1.75" />
        <Specimen className="body" label=".body" text="Our team brings together seasoned designers, developers, and strategists to create cohesive digital experiences." meta="Plus Jakarta Sans · 0.975rem · lh 1.7" />
        <Specimen className="small" label=".small" text="All rights reserved. Iligan City, Philippines · Mon–Fri 8:30am–5:00pm" meta="Plus Jakarta Sans · 0.825rem · lh 1.6" />
      </div>

      {/* Font families */}
      <div style={{ marginBottom: '3rem' }}>
        <FontSwatch family="var(--font-display)" label="--font-display: Clash Display" weights={[300, 400, 500, 600, 700]} />
        <FontSwatch family="var(--font-body)" label="--font-body: Plus Jakarta Sans" weights={[400, 500, 600, 700]} />
        <FontSwatch family="var(--font-mono)" label="--font-mono: Space Mono" weights={[400, 700]} />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: { description: { component: 'All type scale classes and font families used across Fazed Digital.' } },
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  name: 'Type Scale',
  render: () => <AllTypography />,
};

export const DisplayFonts: Story = {
  name: 'Display Scale Only',
  render: () => (
    <div style={{ padding: '2rem 3rem', fontFamily: 'var(--font-body)' }}>
      {[
        { cls: 'display-xl', text: 'Bold' },
        { cls: 'display-lg', text: 'We Build' },
        { cls: 'display-md', text: 'Experiences' },
        { cls: 'display-sm', text: 'That Matter' },
        { cls: 'heading',    text: 'Section Heading' },
      ].map(({ cls, text }) => (
        <div key={cls} className={cls} style={{ color: 'var(--white)', marginBottom: '1rem' }}>
          {text}
        </div>
      ))}
    </div>
  ),
};

export const MonoLabels: Story = {
  name: 'Mono Labels',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {[
        { text: '01 · Overview', color: 'var(--gray-500)' },
        { text: 'Section 02 · Services', color: 'var(--accent)' },
        { text: 'Made in Iligan City · PH', color: 'var(--gray-600)' },
        { text: 'Loading 100%', color: 'var(--white)' },
      ].map(({ text, color }) => (
        <span key={text} className="label" style={{ color }}>{text}</span>
      ))}
    </div>
  ),
};

export const AccentText: Story = {
  name: 'Accent Highlights',
  render: () => (
    <div style={{ padding: '2rem 3rem', maxWidth: 700 }}>
      <p className="body-lg" style={{ color: 'var(--white)' }}>
        We build{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>bold digital experiences</span>{' '}
        that connect brands with their audience in ways that are memorable, meaningful, and measurable.
      </p>
    </div>
  ),
};
