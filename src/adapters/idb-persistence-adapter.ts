import { TreeNodeData, TreeNodePersistence } from '../components/tree-node.js';
import { treeNodeStore } from '../services/tree-node-store.js';

/**
 * IndexedDB persistence adapter for TreeNode components
 * This adapter bridges the generic TreeNodePersistence interface
 * with the specific tree-node-store implementation
 */
export class IDBPersistenceAdapter implements TreeNodePersistence {
  async loadNode(nodeId: string): Promise<TreeNodeData | null> {
    const nodeRecord = await treeNodeStore.loadNode(nodeId);
    if (!nodeRecord) return null;
    
    return {
      id: nodeRecord.id,
      nodeName: nodeRecord.nodeName,
      parentId: nodeRecord.parentId,
      ancestorNamePath: nodeRecord.ancestorNamePath
    };
  }

  async saveNode(nodeData: Partial<TreeNodeData> & { id: string }): Promise<void> {
    await treeNodeStore.saveNode({
      id: nodeData.id,
      nodeName: nodeData.nodeName || '',
      parentId: nodeData.parentId || 'ROOT',
      ancestorNamePath: nodeData.ancestorNamePath
    });
  }

  async loadChildNodes(parentId: string): Promise<TreeNodeData[]> {
    const childRecords = await treeNodeStore.getChildNodes(parentId);
    return childRecords.map(record => ({
      id: record.id,
      nodeName: record.nodeName,
      parentId: record.parentId,
      ancestorNamePath: record.ancestorNamePath
    }));
  }
}

// Export singleton instance for convenience
export const idbPersistenceAdapter = new IDBPersistenceAdapter();