import type { Meta, StoryObj } from '@storybook/react';
import MagneticButton from '../components/MagneticButton';

const meta: Meta<typeof MagneticButton> = {
  title: 'UI/MagneticButton',
  component: MagneticButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    children: { control: 'text' },
    href: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof MagneticButton>;

export const Primary: Story = {
  args: {
    children: 'View Our Work',
    variant: 'primary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: "Let's Talk",
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Learn More →',
    variant: 'ghost',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Start a Project →',
    variant: 'primary',
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    children: 'View Details',
    variant: 'outline',
    size: 'sm',
  },
};

export const AsLink: Story = {
  args: {
    children: 'Go to Services →',
    variant: 'ghost',
    size: 'md',
    href: '/services',
  },
};
