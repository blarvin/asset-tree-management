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

export const Interactive: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 600px; padding: 20px;">
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">Interactive Demo</h3>
        <p style="margin: 0; font-size: 14px; color: #666;">
          Click the button to see the create-node event in the Actions panel.
          In a real application, this would trigger the creation of a new tree node.
        </p>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Create Root Asset</h4>
        <create-new-tree-node 
          isRoot 
          @create-node=${(e: CustomEvent) => {
            console.log('Create node event:', e.detail);
            action('create-node')(e.detail);
          }}
        ></create-new-tree-node>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Create Child Asset</h4>
        <create-new-tree-node 
          @create-node=${(e: CustomEvent) => {
            console.log('Create node event:', e.detail);
            action('create-node')(e.detail);
          }}
        ></create-new-tree-node>
      </div>
    </div>
  `,
};