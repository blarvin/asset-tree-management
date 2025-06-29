import { TreeNodeData, TreeNodePersistence } from '../components/tree-node.js';

/**
 * External controller for managing TreeNode state and orchestrating persistence
 * This allows framework-agnostic usage of TreeNode components
 */
export class TreeNodeController {
  private persistenceAdapter: TreeNodePersistence;
  private nodeCache = new Map<string, TreeNodeData>();

  constructor(persistenceAdapter: TreeNodePersistence) {
    this.persistenceAdapter = persistenceAdapter;
  }

  /**
   * Load node data, with caching
   */
  async loadNode(nodeId: string): Promise<TreeNodeData | null> {
    // Check cache first
    if (this.nodeCache.has(nodeId)) {
      return this.nodeCache.get(nodeId)!;
    }

    // Load from persistence
    const nodeData = await this.persistenceAdapter.loadNode(nodeId);
    if (nodeData) {
      this.nodeCache.set(nodeId, nodeData);
    }
    return nodeData;
  }

  /**
   * Save node data and update cache
   */
  async saveNode(nodeData: Partial<TreeNodeData> & { id: string }): Promise<void> {
    await this.persistenceAdapter.saveNode(nodeData);
    
    // Update cache
    const existingData = this.nodeCache.get(nodeData.id);
    const updatedData: TreeNodeData = {
      id: nodeData.id,
      nodeName: nodeData.nodeName || existingData?.nodeName || '',
      parentId: nodeData.parentId ?? existingData?.parentId
    };
    this.nodeCache.set(nodeData.id, updatedData);
  }

  /**
   * Invalidate cache for a specific node
   */
  invalidateNode(nodeId: string): void {
    this.nodeCache.delete(nodeId);
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.nodeCache.clear();
  }

  /**
   * Get cached node data without loading
   */
  getCachedNode(nodeId: string): TreeNodeData | undefined {
    return this.nodeCache.get(nodeId);
  }

  /**
   * Create a persistence adapter that can be passed directly to TreeNode components
   * All TreeNode instances share the same controller for consistency
   */
  createNodeAdapter(): TreeNodePersistence {
    return {
      loadNode: (id: string) => this.loadNode(id),
      saveNode: (nodeData: Partial<TreeNodeData> & { id: string }) => this.saveNode(nodeData)
    };
  }
}