import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from 'storybook/actions';
import '../src/components/tree-node.js';
import { TreeNodePersistence, TreeNodeData } from '../src/components/tree-node.js';

// Mock persistence adapter for stories
const mockPersistenceAdapter: TreeNodePersistence = {
  async loadNode(nodeId: string): Promise<TreeNodeData | null> {
    // Simulate loading data
    const mockData: Record<string, TreeNodeData> = {
      'sample-root-node': { id: 'sample-root-node', nodeName: 'Main Building', parentId: 'ROOT' },
      'sample-parent-node': { id: 'sample-parent-node', nodeName: 'HVAC System', parentId: 'building-1' },
      'sample-child-node': { id: 'sample-child-node', nodeName: 'Air Handler Unit 1', parentId: 'hvac-system' },
      'building-main': { id: 'building-main', nodeName: 'Corporate Headquarters', parentId: 'ROOT' },
      'hvac-system': { id: 'hvac-system', nodeName: 'HVAC System', parentId: 'building-main' },
      'electrical-panel': { id: 'electrical-panel', nodeName: 'Electrical Panel A', parentId: 'building-main' },
      'fire-safety': { id: 'fire-safety', nodeName: 'Fire Safety Systems', parentId: 'building-main' },
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
  title: 'Components/TreeNode',
  component: 'tree-node',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    isRoot: {
      control: 'boolean',
      description: 'Root node on home page (full width)',
    },
    isParent: {
      control: 'boolean',
      description: 'Current node being viewed with children (has up button)',
    },
    isChild: {
      control: 'boolean',
      description: 'Child node under current parent (indented, narrower)',
    },
    isUnderConstruction: {
      control: 'boolean',
      description: 'New node requiring setup (shows input fields)',
    },
    nodeId: {
      control: 'text',
      description: 'Unique identifier for the node',
    },
  },
};

export default meta;
type Story = StoryObj;

export const RootState: Story = {
  args: {
    isRoot: true,
    isParent: false,
    isChild: false,
    isUnderConstruction: false,
    nodeId: 'sample-root-node',
  },
  render: ({ isRoot, isParent, isChild, isUnderConstruction, nodeId }) => html`
    <tree-node 
      ?isRoot=${isRoot}
      ?isParent=${isParent}
      ?isChild=${isChild}
      ?isUnderConstruction=${isUnderConstruction}
      nodeId=${nodeId}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
    ></tree-node>
  `,
};

export const ParentState: Story = {
  args: {
    isRoot: false,
    isParent: true,
    isChild: false,
    isUnderConstruction: false,
    nodeId: 'sample-parent-node',
  },
  render: ({ isRoot, isParent, isChild, isUnderConstruction, nodeId }) => html`
    <tree-node 
      ?isRoot=${isRoot}
      ?isParent=${isParent}
      ?isChild=${isChild}
      ?isUnderConstruction=${isUnderConstruction}
      nodeId=${nodeId}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
    ></tree-node>
  `,
};

export const ChildState: Story = {
  args: {
    isRoot: false,
    isParent: false,
    isChild: true,
    isUnderConstruction: false,
    nodeId: 'sample-child-node',
  },
  render: ({ isRoot, isParent, isChild, isUnderConstruction, nodeId }) => html`
    <tree-node 
      ?isRoot=${isRoot}
      ?isParent=${isParent}
      ?isChild=${isChild}
      ?isUnderConstruction=${isUnderConstruction}
      nodeId=${nodeId}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
    ></tree-node>
  `,
};

export const UnderConstructionState: Story = {
  args: {
    isRoot: false,
    isParent: false,
    isChild: false,
    isUnderConstruction: true,
    nodeId: 'sample-construction-node',
  },
  render: ({ isRoot, isParent, isChild, isUnderConstruction, nodeId }) => html`
    <tree-node 
      ?isRoot=${isRoot}
      ?isParent=${isParent}
      ?isChild=${isChild}
      ?isUnderConstruction=${isUnderConstruction}
      nodeId=${nodeId}
      .persistenceAdapter=${mockPersistenceAdapter}
      @tree-node-action=${action('tree-node-action')}
    ></tree-node>
  `,
};

export const AllStates: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 800px;">
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Root State (isRoot=true)</h3>
        <tree-node 
          isRoot 
          nodeId="sample-root-node"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('root-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Parent State (isParent=true)</h3>
        <tree-node 
          isParent
          nodeId="sample-parent-node"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('parent-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Child State (isChild=true)</h3>
        <tree-node 
          isChild
          nodeId="sample-child-node"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('child-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Under Construction State (isUnderConstruction=true)</h3>
        <tree-node 
          isUnderConstruction
          nodeId="demo-construction"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('construction-action')}
        ></tree-node>
      </div>
    </div>
  `,
};

export const InteractiveTransitions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">State Transitions Demo</h3>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">
          Try interacting with these components to see state transitions:
        </p>
        <ul style="margin: 0; font-size: 14px; color: #666;">
          <li><strong>Under Construction:</strong> Fill in fields and click Save to transition to Parent state</li>
          <li><strong>Root/Child nodes:</strong> Click to navigate (would transition to Parent state)</li>
          <li><strong>Parent node:</strong> Click Up button to navigate up the tree</li>
        </ul>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">New Node (Under Construction)</h4>
        <tree-node 
          isUnderConstruction
          nodeId="interactive-construction"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('interactive-construction-action')}
        ></tree-node>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Clickable Root Node</h4>
        <tree-node 
          isRoot
          nodeId="sample-root-node"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('interactive-root-action')}
        ></tree-node>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Parent with Up Button</h4>
        <tree-node 
          isParent
          nodeId="sample-parent-node"
          .persistenceAdapter=${mockPersistenceAdapter}
          @tree-node-action=${action('interactive-parent-action')}
        ></tree-node>
      </div>
    </div>
  `,
};

export const WithNodeData: Story = {
  render: () => {
    const nodeData: TreeNodeData = {
      id: 'custom-node',
      nodeName: 'Emergency Generator',
      parentId: 'power-systems'
    };
    
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px;">
        <div style="padding: 16px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">Using nodeData Property</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
            This demonstrates passing node data directly without persistence adapter.
          </p>
          <pre style="margin: 0; font-size: 12px; background: #fff; padding: 8px; border-radius: 4px;">
nodeData = ${JSON.stringify(nodeData, null, 2)}</pre>
        </div>
        
        <tree-node 
          isParent
          nodeId=${nodeData.id}
          .nodeData=${nodeData}
          @tree-node-action=${action('node-data-action')}
        ></tree-node>
      </div>
    `;
  },
};

export const HierarchyExample: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 600px;">
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">Asset Tree Hierarchy Example</h3>
        <p style="margin: 0; font-size: 14px; color: #666;">
          This shows how nodes would appear in a real asset tree structure.
        </p>
      </div>
      
      <!-- Parent Node -->
      <tree-node 
        isParent
        nodeId="building-main"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${action('building-action')}
      ></tree-node>
      
      <!-- Child Nodes -->
      <tree-node 
        isChild
        nodeId="hvac-system"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${action('hvac-action')}
      ></tree-node>
      
      <tree-node 
        isChild
        nodeId="electrical-panel"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${action('electrical-action')}
      ></tree-node>
      
      <tree-node 
        isChild
        nodeId="fire-safety"
        .persistenceAdapter=${mockPersistenceAdapter}
        @tree-node-action=${action('fire-safety-action')}
      ></tree-node>
    </div>
  `,
};