import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from 'storybook/actions';
import '../src/components/root-view.js';
import '../src/components/tree-node.js';
import '../src/components/create-new-tree-node.js';
import '../src/components/asset-view.js';
import { TreeNodeController } from '../src/controllers/tree-node-controller.js';
import { idbPersistenceAdapter } from '../src/adapters/idb-persistence-adapter.js';

const meta: Meta = {
  title: 'Views/RootView',
  component: 'root-view',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <root-view></root-view>
  `,
};

export const WithController: Story = {
  render: () => {
    const controller = new TreeNodeController(idbPersistenceAdapter);
    
    return html`
      <root-view 
        .treeController=${controller}
        @tree-node-action=${action('tree-node-action')}
        @create-node=${action('create-node')}
      ></root-view>
    `;
  },
};

export const StateTransitionDemo: Story = {
  render: () => html`
    <div style="padding: 20px; background: #f0f0f0;">
      <h2 style="margin: 0 0 16px 0;">Root View State Transitions</h2>
      <p style="margin: 0 0 20px 0;">
        This demo shows how RootView handles navigation between ROOT and ASSET views.
        Click on assets to navigate, use the up button to return to root.
      </p>
      <root-view></root-view>
    </div>
  `,
};