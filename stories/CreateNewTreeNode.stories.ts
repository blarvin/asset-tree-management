import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from 'storybook/actions';
import '../src/components/create-new-tree-node.js';

const meta: Meta = {
  title: 'Components/CreateNewTreeNode',
  component: 'create-new-tree-node',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    isRoot: {
      control: 'boolean',
      description: 'Whether this is a root-level asset creation button',
    },
  },
};

export default meta;
type Story = StoryObj;

export const AsRootButton: Story = {
  args: {
    isRoot: true,
  },
  render: ({ isRoot }) => html`
    <create-new-tree-node 
      ?isRoot=${isRoot} 
      @create-node=${action('create-node')}
    ></create-new-tree-node>
  `,
};

export const AsChildButton: Story = {
  args: {
    isRoot: false,
  },
  render: ({ isRoot }) => html`
    <create-new-tree-node 
      ?isRoot=${isRoot} 
      @create-node=${action('create-node')}
    ></create-new-tree-node>
  `,
};

export const BothStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Root State (isRoot=true)</h3>
        <create-new-tree-node 
          isRoot 
          @create-node=${action('create-root-node')}
        ></create-new-tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Child State (isRoot=false)</h3>
        <create-new-tree-node 
          @create-node=${action('create-child-node')}
        ></create-new-tree-node>
      </div>
    </div>
  `,
};

export const InRootView: Story = {
  render: () => html`
    <root-view>
      <div style="padding: 20px;">
        <h2>Asset Tree Management</h2>
        <p>This shows how the CreateNewTreeNode component appears within the RootView context.</p>
        <div style="margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <p>Placeholder for existing TreeNode components...</p>
        </div>
      </div>
    </root-view>
  `,
};