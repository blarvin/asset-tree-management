// Core Web Components
export { TreeNode } from './components/tree-node.js';
export { CreateNewTreeNode } from './components/create-new-tree-node.js';
export { ChildContainer } from './components/child-container.js';

// Optional Orchestration Components (for prototyping)
export { RootView } from './components/root-view.js';
export { AssetView } from './components/asset-view.js';

// Interfaces and Types
export type { TreeNodeData, TreeNodePersistence } from './components/tree-node.js';

// Controllers and Adapters
export { TreeNodeController } from './controllers/tree-node-controller.js';
export { IDBPersistenceAdapter, idbPersistenceAdapter } from './adapters/idb-persistence-adapter.js';