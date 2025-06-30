import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from 'storybook/actions';
import '../src/components/asset-view.js';
import '../src/components/tree-node.js';
import '../src/components/create-new-tree-node.js';
import { TreeNodeController } from '../src/controllers/tree-node-controller.js';
import { TreeNodePersistence, TreeNodeData } from '../src/components/tree-node.js';

// Mock persistence adapter for stories
const mockPersistenceAdapter: TreeNodePersistence = {
  async loadNode(nodeId: string): Promise<TreeNodeData | null> {
    const mockData: Record<string, TreeNodeData> = {
      'building-main': { id: 'building-main', nodeName: 'Corporate Headquarters', parentId: 'ROOT' },
      'hvac-system': { id: 'hvac-system', nodeName: 'HVAC System', parentId: 'building-main' },
      'electrical-panel': { id: 'electrical-panel', nodeName: 'Electrical Panel A', parentId: 'building-main' },
      'fire-safety': { id: 'fire-safety', nodeName: 'Fire Safety Systems', parentId: 'building-main' },
      'new-asset': { id: 'new-asset', nodeName: '', parentId: 'ROOT' },
    };
    console.log('Mock loadNode called:', nodeId);
    return mockData[nodeId] || null;
  },
  
  async saveNode(nodeData: Partial<TreeNodeData> & { id: string }): Promise<void> {
    console.log('Mock saveNode called:', nodeData);
    action('persistence-save')(nodeData);
  }
};

const meta: Meta = {
  title: 'Views/AssetView',
  component: 'asset-view',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    currentAssetId: 'building-main',
    isNewAsset: false,
  },
  render: ({ currentAssetId, isNewAsset }) => html`
    <asset-view 
      currentAssetId=${currentAssetId}
      ?isNewAsset=${isNewAsset}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
      @create-node=${action('create-node')}
    ></asset-view>
  `,
};

export const NewAsset: Story = {
  args: {
    currentAssetId: 'new-asset',
    isNewAsset: true,
  },
  render: ({ currentAssetId, isNewAsset }) => html`
    <asset-view 
      currentAssetId=${currentAssetId}
      ?isNewAsset=${isNewAsset}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
      @create-node=${action('create-node')}
    ></asset-view>
  `,
};

export const WithController: Story = {
  render: () => {
    const controller = new TreeNodeController(mockPersistenceAdapter);
    
    return html`
      <asset-view 
        currentAssetId="building-main"
        .treeController=${controller}
        @tree-node-action=${action('tree-node-action')}
        @create-node=${action('create-node')}
      ></asset-view>
    `;
  },
};

export const NavigationDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; height: 100vh;">
      <div style="padding: 20px; background: #f0f0f0;">
        <h2 style="margin: 0 0 8px 0;">Asset View Navigation</h2>
        <p style="margin: 0;">
          Shows the asset view with a parent node. Click the up button to navigate back.
        </p>
      </div>
      <asset-view 
        currentAssetId="building-main"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${action('tree-node-action')}
        @create-node=${action('create-node')}
      ></asset-view>
    </div>
  `,
};

export const AssetHierarchy: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; height: 100vh;">
      <div style="padding: 20px; background: #f0f0f0;">
        <h2 style="margin: 0 0 8px 0;">Asset with Children</h2>
        <p style="margin: 0 0 8px 0;">
          This shows a typical asset view with a parent node and its child nodes.
        </p>
        <p style="margin: 0; font-size: 14px; color: #666;">
          Parent: Corporate Headquarters<br>
          Children: HVAC System, Electrical Panel A, Fire Safety Systems
        </p>
      </div>
      <asset-view 
        currentAssetId="building-main"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${(e: CustomEvent) => {
          console.log('Action:', e.detail);
          action('tree-node-action')(e.detail);
        }}
        @create-node=${action('create-node')}
      ></asset-view>
    </div>
  `,
};