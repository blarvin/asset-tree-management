import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { action } from 'storybook/actions';
import '../src/components/tree-node.js';

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
          nodeId="demo-root"
          @tree-node-action=${action('root-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Parent State (isParent=true)</h3>
        <tree-node 
          isParent
          nodeId="demo-parent"
          @tree-node-action=${action('parent-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Child State (isChild=true)</h3>
        <tree-node 
          isChild
          nodeId="demo-child"
          @tree-node-action=${action('child-action')}
        ></tree-node>
      </div>
      
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Under Construction State (isUnderConstruction=true)</h3>
        <tree-node 
          isUnderConstruction
          nodeId="demo-construction"
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
          @tree-node-action=${action('interactive-construction-action')}
        ></tree-node>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Clickable Root Node</h4>
        <tree-node 
          isRoot
          nodeId="interactive-root"
          @tree-node-action=${action('interactive-root-action')}
        ></tree-node>
      </div>
      
      <div>
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #666;">Parent with Up Button</h4>
        <tree-node 
          isParent
          nodeId="interactive-parent"
          @tree-node-action=${action('interactive-parent-action')}
        ></tree-node>
      </div>
    </div>
  `,
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
        @tree-node-action=${action('building-action')}
      ></tree-node>
      
      <!-- Child Nodes -->
      <tree-node 
        isChild
        nodeId="hvac-system"
        @tree-node-action=${action('hvac-action')}
      ></tree-node>
      
      <tree-node 
        isChild
        nodeId="electrical-panel"
        @tree-node-action=${action('electrical-action')}
      ></tree-node>
      
      <tree-node 
        isChild
        nodeId="fire-safety"
        @tree-node-action=${action('fire-safety-action')}
      ></tree-node>
    </div>
  `,
};