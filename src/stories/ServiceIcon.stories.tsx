import type { Meta, StoryObj } from '@storybook/react-vite';
import ServiceIcon from '../components/ServiceIcon';

type ServiceId = 'web' | 'brand' | 'seo' | 'product' | 'systems';

const SERVICE_LABELS: Record<ServiceId, string> = {
  web:     'Web Design',
  brand:   'Brand Identity',
  seo:     'SEO Marketing',
  product: 'Product Design',
  systems: 'Custom Systems',
};

const SERVICE_DESC: Record<ServiceId, string> = {
  web:     'Animated loading bar, tab highlight, dot accents',
  brand:   'Diamond facet draw-in, glint sweep',
  seo:     'Trend line reveal, magnifier scan',
  product: 'Wireframe draw-in, cursor click interaction',
  systems: 'Node connection, data packet travel',
};

// ─── Single icon card ─────────────────────────────────────────────────────────
function IconCard({ serviceId }: { serviceId: ServiceId }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      padding: '2.5rem 2rem',
      background: 'var(--gray-900)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      minWidth: 200,
    }}>
      {/* Icon wrapper with accent ring */}
      <div style={{
        width: 80, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--gray-800)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        position: 'relative',
      }}>
        <ServiceIcon serviceId={serviceId} />
      </div>
      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: '0.95rem', color: 'var(--white)',
          marginBottom: '0.35rem',
        }}>
          {SERVICE_LABELS[serviceId]}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          color: 'var(--gray-600)', letterSpacing: '0.06em',
          maxWidth: '18ch', lineHeight: 1.5,
        }}>
          {SERVICE_DESC[serviceId]}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ServiceIcon> = {
  title: 'UI/ServiceIcon',
  component: ServiceIcon,
  tags: ['autodocs'],
  argTypes: {
    serviceId: {
      control: 'select',
      options: ['web', 'brand', 'seo', 'product', 'systems'],
      description: 'Which animated service icon to render',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated SVG icons for each service. Each loops continuously with a GSAP timeline — draw-in effects, interactive highlights, and data-driven animations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceIcon>;

export const WebDesign: Story = {
  args: { serviceId: 'web' },
  name: 'Web Design',
};

export const BrandIdentity: Story = {
  args: { serviceId: 'brand' },
  name: 'Brand Identity',
};

export const SeoMarketing: Story = {
  args: { serviceId: 'seo' },
  name: 'SEO Marketing',
};

export const ProductDesign: Story = {
  args: { serviceId: 'product' },
  name: 'Product Design',
};

export const CustomSystems: Story = {
  args: { serviceId: 'systems' },
  name: 'Custom Systems',
};

export const AllIcons: Story = {
  name: 'All Icons',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', padding: '2rem' }}>
      {(['web', 'brand', 'seo', 'product', 'systems'] as ServiceId[]).map(id => (
        <IconCard key={id} serviceId={id} />
      ))}
    </div>
  ),
};

export const InContext: Story = {
  name: 'In Card Context',
  render: () => (
    <div style={{ maxWidth: 700, padding: '2rem', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {(['web', 'brand', 'seo', 'product', 'systems'] as ServiceId[]).map((id, i) => (
          <div key={id} style={{
            display: 'flex', alignItems: 'center', gap: '1.5rem',
            padding: '1.25rem 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              width: 56, height: 56,
              background: 'var(--gray-900)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ServiceIcon serviceId={id} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--white)', marginBottom: '0.2rem' }}>
                {SERVICE_LABELS[id]}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)' }}>
                {SERVICE_DESC[id]}
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-700)' }}>
              0{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
