import type { Meta, StoryObj } from '@storybook/react-vite';
import HeroGraphic from '../components/HeroGraphic';
import AboutHeroAnim from '../components/AboutHeroAnim';
import ServicesHeroAnim from '../components/ServicesHeroAnim';
import WorkHeroAnim from '../components/WorkHeroAnim';
import ContactHeroAnim from '../components/ContactHeroAnim';
import NotFoundAnim from '../components/NotFoundAnim';

// ─── Wrapper to center anims in a dark viewport ───────────────────────────────
function AnimBox({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
      <div style={{
        position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--gray-600)',
        whiteSpace: 'nowrap',
      }}>{label}</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Hero Animations',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'Per-page hero SVG animations — each uses GSAP useGSAP with a scope ref on the SVG. All loop continuously.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Home: Story = {
  name: 'Home — Orbital Sphere',
  render: () => (
    <AnimBox label="HeroGraphic — 3-ellipse orbital + mouse parallax">
      <HeroGraphic />
    </AnimBox>
  ),
};

export const About: Story = {
  name: 'About — Orbit Rings',
  render: () => (
    <AnimBox label="AboutHeroAnim — 3 concentric rings + pulse + dot twinkle">
      <AboutHeroAnim />
    </AnimBox>
  ),
};

export const Services: Story = {
  name: 'Services — Service Pentagon',
  render: () => (
    <AnimBox label="ServicesHeroAnim — 5 nodes + stroke draw-in + float">
      <ServicesHeroAnim />
    </AnimBox>
  ),
};

export const Work: Story = {
  name: 'Work — Dot Grid',
  render: () => (
    <AnimBox label="WorkHeroAnim — 8×5 dot grid + scan line + twinkle">
      <WorkHeroAnim />
    </AnimBox>
  ),
};

export const Contact: Story = {
  name: 'Contact — Pin & Signal',
  render: () => (
    <AnimBox label="ContactHeroAnim — location pin + 3 signal rings + coordinates">
      <ContactHeroAnim />
    </AnimBox>
  ),
};

export const NotFound: Story = {
  name: '404 — Radar Sweep',
  render: () => (
    <AnimBox label="NotFoundAnim — radar arm + interference dots + searching sequence">
      <NotFoundAnim />
    </AnimBox>
  ),
};

export const AllAnims: Story = {
  name: 'All — Side by Side',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{
      padding: '2rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      background: 'var(--black)',
    }}>
      {[
        { label: 'Home — Orbital Sphere', component: <HeroGraphic /> },
        { label: 'About — Orbit Rings', component: <AboutHeroAnim /> },
        { label: 'Services — Pentagon', component: <ServicesHeroAnim /> },
        { label: 'Work — Dot Grid', component: <WorkHeroAnim /> },
        { label: 'Contact — Pin & Signal', component: <ContactHeroAnim /> },
        { label: '404 — Radar Sweep', component: <NotFoundAnim /> },
      ].map(({ label, component }) => (
        <div key={label} style={{
          background: 'var(--gray-900)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            {component}
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-600)',
            textAlign: 'center', lineHeight: 1.5,
          }}>{label}</span>
        </div>
      ))}
    </div>
  ),
};
