// Simple IndexedDB service for TreeNode persistence
// Designed to be easily replaceable with Firebase later

export interface TreeNodeRecord {
  id: string;
  nodeName: string;
  parentId: string | null; // "ROOT" for top-level nodes
  createdAt: number;
  updatedAt: number;
  // Extensible for future fields from full specification
}

class TreeNodeStore {
  private dbName = 'AssetTreeDB';
  private version = 1;
  private storeName = 'treeNodes';
  private db: IDBDatabase | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create tree nodes store
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('parentId', 'parentId', { unique: false });
          store.createIndex('nodeName', 'nodeName', { unique: false });
        }
      };
    });
  }

  async saveNode(nodeData: Partial<TreeNodeRecord> & { id: string }): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise(async (resolve, reject) => {
      try {
        // Get existing node within the same transaction
        const getRequest = store.get(nodeData.id);
        
        getRequest.onsuccess = () => {
          const existingNode = getRequest.result;
          const now = Date.now();

          const nodeRecord: TreeNodeRecord = {
            // Start with defaults
            nodeName: '',
            parentId: 'ROOT',
            createdAt: existingNode?.createdAt || now,
            // Override with provided data
            ...nodeData,
            // Ensure required fields are never undefined
            id: nodeData.id,
            updatedAt: now
          };

          const putRequest = store.put(nodeRecord);
          
          putRequest.onsuccess = () => {
            console.log('✅ Node saved:', nodeData.id);
          };
          
          putRequest.onerror = () => {
            console.error('❌ Error saving node to IDB:', putRequest.error);
            reject(putRequest.error);
          };
        };
        
        getRequest.onerror = () => {
          console.error('❌ Error getting existing node:', getRequest.error);
          reject(getRequest.error);
        };
        
        transaction.oncomplete = () => {
          resolve();
        };
        
        transaction.onerror = () => {
          console.error('❌ Transaction error:', transaction.error);
          reject(transaction.error);
        };
        
      } catch (error) {
        console.error('❌ Error in saveNode:', error);
        reject(error);
      }
    });
  }

  async loadNode(nodeId: string): Promise<TreeNodeRecord | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.get(nodeId);
        
        request.onsuccess = () => {
          const result = request.result || null;
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('Error loading node:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in loadNode:', error);
      return null;
    }
  }

  async getAllNodes(): Promise<TreeNodeRecord[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        
        request.onerror = () => {
          console.error('Error loading all nodes:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error in getAllNodes:', error);
      return [];
    }
  }

  async getRootNodes(): Promise<TreeNodeRecord[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('parentId');

      return new Promise((resolve, reject) => {
        const request = index.getAll('ROOT');
        
        request.onsuccess = () => {
          const result = request.result || [];
          resolve(result);
        };
        
        request.onerror = () => {
          console.error('❌ Error loading root nodes:', request.error);
          reject(request.error);
        };
        
        transaction.onerror = () => {
          console.error('❌ Transaction error in getRootNodes:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('❌ Error in getRootNodes:', error);
      throw error; // Re-throw instead of silently returning empty array
    }
  }

  async deleteNode(nodeId: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(nodeId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.error('Error deleting node:', request.error);
        reject(request.error);
      };
    });
  }

}

// Export singleton instance
export const treeNodeStore = new TreeNodeStore();