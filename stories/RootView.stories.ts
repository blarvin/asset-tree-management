import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../src/components/root-view.js';

const meta: Meta = {
  title: 'Components/RootView',
  component: 'root-view',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <root-view>
      <p>This is the ROOT view container for development and layout purposes.</p>
      <p>TreeNode components will be placed here during development.</p>
    </root-view>
  `,
};

export const WithContent: Story = {
  render: () => html`
    <root-view>
      <div style="padding: 20px;">
        <h2>Asset Tree Management</h2>
        <p>Development layout container with blue border</p>
        <div style="margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          Future TreeNode components will be rendered here
        </div>
      </div>
    </root-view>
  `,
};