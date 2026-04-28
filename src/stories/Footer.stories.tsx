import type { Meta, StoryObj } from '@storybook/react-vite';
import Footer from '../components/Footer';

const meta: Meta<typeof Footer> = {
  title: 'UI/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Site footer with brand column, service/company/legal link columns, and bottom bar. Columns fade-up on scroll via GSAP ScrollTrigger. Includes ghost watermark wordmark behind the grid.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  name: 'Default',
  render: () => (
    <div style={{ background: 'var(--black)' }}>
      {/* Page content before footer */}
      <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--gray-700)', letterSpacing: '0.1em' }}>
          ↓ SCROLL TO SEE FOOTER ANIMATE IN
        </span>
      </div>
      <Footer />
    </div>
  ),
};

export const IsolatedFooter: Story = {
  name: 'Isolated (no scroll trigger)',
  render: () => (
    <div style={{ background: 'var(--black)', paddingTop: '1px' }}>
      <Footer />
    </div>
  ),
};
