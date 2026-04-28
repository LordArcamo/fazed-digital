import type { Meta, StoryObj } from '@storybook/react-vite';
import AnimatedText from '../components/AnimatedText';

const meta: Meta<typeof AnimatedText> = {
  title: 'UI/AnimatedText',
  component: AnimatedText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'p', 'span'],
    },
    delay: { control: { type: 'number', min: 0, max: 2, step: 0.1 } },
    stagger: { control: { type: 'number', min: 0.02, max: 0.2, step: 0.01 } },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem 2rem', maxWidth: 800 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AnimatedText>;

export const DisplayXL: Story = {
  args: {
    text: 'We craft BOLD digital experiences.',
    as: 'h1',
    className: 'display-xl',
    delay: 0,
    stagger: 0.07,
  },
};

export const DisplayLg: Story = {
  args: {
    text: 'Services built for bold ambition.',
    as: 'h2',
    className: 'display-lg',
    delay: 0,
    stagger: 0.06,
  },
};

export const BodyText: Story = {
  args: {
    text: 'A Brisbane-based creative agency combining design excellence, digital strategy, and technical expertise.',
    as: 'p',
    className: 'body-lg',
    delay: 0,
    stagger: 0.03,
  },
};

export const WithDelay: Story = {
  args: {
    text: 'Animation starts after a delay.',
    as: 'h2',
    className: 'display-md',
    delay: 0.8,
    stagger: 0.06,
  },
};
