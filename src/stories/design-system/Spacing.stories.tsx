import type { Meta, StoryObj } from '@storybook/react-vite';

// ─── Token row ─────────────────────────────────────────────────────────────────
function TokenRow({ name, value, description }: { name: string; value: string; description: string }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
        {name}
      </td>
      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--white)' }}>
        {value}
      </td>
      <td style={{ padding: '0.875rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
        {description}
      </td>
    </tr>
  );
}

// ─── Visual spacing row ───────────────────────────────────────────────────────
function SpacingBar({ label, value, widthPx }: { label: string; value: string; widthPx: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-600)', width: 80, textAlign: 'right', flexShrink: 0 }}>{label}</span>
      <div style={{
        height: 24,
        width: widthPx,
        background: 'var(--accent)',
        opacity: 0.6,
        borderRadius: 2,
        minWidth: 4,
      }} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)' }}>{value}</span>
    </div>
  );
}

function AllSpacing() {
  return (
    <div style={{ padding: '2rem', maxWidth: 800, fontFamily: 'var(--font-body)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--white)' }}>
        Spacing & Layout
      </h1>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '3rem' }}>
        Design tokens for spacing, typography sizing, and layout constraints.
      </p>

      {/* ── Layout tokens table ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
          Layout Tokens
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'var(--gray-900)' }}>
              {['Token', 'Value', 'Usage'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-600)', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TokenRow name="--container" value="1340px" description="Max content width, centered with auto margins" />
            <TokenRow name="--gutter" value="clamp(1.5rem, 5vw, 4rem)" description="Horizontal page padding, fluid 24–64px" />
            <TokenRow name="--radius" value="0.875rem" description="Default border-radius for cards and inputs" />
            <TokenRow name="section" value="clamp(5rem, 10vw, 10rem)" description=".section padding-top/bottom — 80–160px" />
            <TokenRow name="section-sm" value="clamp(3rem, 6vw, 6rem)" description=".section-sm padding — 48–96px" />
          </tbody>
        </table>
      </div>

      {/* ── Easing tokens ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
          Easing Tokens
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'var(--gray-900)' }}>
              {['Token', 'cubic-bezier', 'Character'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-600)', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TokenRow name="--ease-expo" value="cubic-bezier(0.19, 1, 0.22, 1)" description="Dramatic decelerate — nav overlays, page transitions" />
            <TokenRow name="--ease-bounce" value="cubic-bezier(0.34, 1.56, 0.64, 1)" description="Spring overshoot — button hover, scale effects" />
            <TokenRow name="--ease-in" value="cubic-bezier(0.76, 0, 0.24, 1)" description="Smooth accelerate-decelerate — most UI motion" />
          </tbody>
        </table>
      </div>

      {/* ── Visual spacing scale ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
          Visual Spacing Scale (px)
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--gray-900)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {[
            { label: '4px',  value: '0.25rem', widthPx: 4 },
            { label: '8px',  value: '0.5rem',  widthPx: 8 },
            { label: '12px', value: '0.75rem', widthPx: 12 },
            { label: '16px', value: '1rem',    widthPx: 16 },
            { label: '24px', value: '1.5rem',  widthPx: 24 },
            { label: '32px', value: '2rem',    widthPx: 32 },
            { label: '48px', value: '3rem',    widthPx: 48 },
            { label: '64px', value: '4rem',    widthPx: 64 },
            { label: '96px', value: '6rem',    widthPx: 96 },
            { label: '128px', value: '8rem',   widthPx: 128 },
            { label: '160px', value: '10rem',  widthPx: 160 },
          ].map(s => (
            <SpacingBar key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Grid helpers ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1rem' }}>
          Grid Helpers
        </div>
        {[2, 3, 4].map(cols => (
          <div key={cols} style={{ marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
              .grid-{cols}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1.5rem' }}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} style={{ height: 40, background: 'var(--gray-800)', borderRadius: 4, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--gray-600)' }}>col {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Spacing & Layout',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: { description: { component: 'Spacing scale, layout tokens, easing curves, and grid helpers.' } },
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  name: 'All Tokens',
  render: () => <AllSpacing />,
};

export const GridHelpers: Story = {
  name: 'Grid Helpers',
  render: () => (
    <div style={{ padding: '2rem', maxWidth: 900 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {[
          { cls: 'grid-2', label: '.grid-2 — 2 columns', cols: 2 },
          { cls: 'grid-3', label: '.grid-3 — 3 columns', cols: 3 },
          { cls: 'grid-4', label: '.grid-4 — 4 columns', cols: 4 },
        ].map(({ cls, label, cols }) => (
          <div key={cls}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>{label}</div>
            <div className={cls}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} style={{ height: 60, background: 'var(--gray-900)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)' }}>Column {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
