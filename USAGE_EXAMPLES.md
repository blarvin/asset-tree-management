# Framework-Agnostic Web Component Usage Examples

## Pure Web Component Usage (Framework-agnostic)

### Basic TreeNode with External Persistence

```typescript
import { TreeNode, TreeNodeController, idbPersistenceAdapter } from './dist/index.js';

// Create controller with persistence
const controller = new TreeNodeController(idbPersistenceAdapter);

// Use in HTML
const treeNode = document.createElement('tree-node');
treeNode.nodeId = 'my-node-id';
treeNode.persistenceAdapter = controller.createNodeAdapter('my-node-id');
treeNode.addEventListener('tree-node-action', (event) => {
  console.log('Node action:', event.detail);
});

document.body.appendChild(treeNode);
```

### Pure Presentation Mode (No Persistence)

```typescript
import { TreeNode } from './dist/index.js';

const treeNode = document.createElement('tree-node');
treeNode.nodeId = 'static-node';
treeNode.nodeData = {
  id: 'static-node',
  nodeName: 'My Static Node',
  parentId: null
};

// Handle all events externally
treeNode.addEventListener('tree-node-action', (event) => {
  const { action, nodeId, nodeName } = event.detail;
  // Handle navigation, saving, etc. in your app
});
```

## React Integration Example

```tsx
import React, { useCallback, useMemo } from 'react';
import { TreeNode, TreeNodeController, idbPersistenceAdapter } from 'asset-tree-components';

function MyReactApp() {
  const controller = useMemo(() => 
    new TreeNodeController(idbPersistenceAdapter), []);

  const handleTreeNodeAction = useCallback((event: CustomEvent) => {
    const { action, nodeId } = event.detail;
    
    switch (action) {
      case 'navigate-to':
        // Use React Router
        navigate(`/assets/${nodeId}`);
        break;
      case 'saved':
        // Update your React state
        refetchData();
        break;
    }
  }, []);

  return (
    <div>
      <tree-node
        nodeId="my-node"
        ref={(el) => {
          if (el) {
            el.persistenceAdapter = controller.createNodeAdapter('my-node');
            el.addEventListener('tree-node-action', handleTreeNodeAction);
          }
        }}
      />
    </div>
  );
}
```

## Vue Integration Example

```vue
<template>
  <tree-node
    :nodeId="nodeId"
    :persistenceAdapter="persistenceAdapter"
    @tree-node-action="handleAction"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { TreeNodeController, idbPersistenceAdapter } from 'asset-tree-components';
import { useRouter } from 'vue-router';

const router = useRouter();
const nodeId = ref('my-node');
const controller = new TreeNodeController(idbPersistenceAdapter);

const persistenceAdapter = computed(() => 
  controller.createNodeAdapter(nodeId.value)
);

function handleAction(event) {
  const { action, nodeId } = event.detail;
  
  switch (action) {
    case 'navigate-to':
      router.push(`/assets/${nodeId}`);
      break;
    case 'saved':
      // Trigger reactivity
      emit('node-saved', nodeId);
      break;
  }
}
</script>
```

## Custom Persistence Adapter

```typescript
import { TreeNodePersistence, TreeNodeData } from 'asset-tree-components';

class FirebasePersistenceAdapter implements TreeNodePersistence {
  async loadNode(nodeId: string): Promise<TreeNodeData | null> {
    const doc = await firebase.firestore()
      .collection('nodes')
      .doc(nodeId)
      .get();
    
    return doc.exists ? doc.data() as TreeNodeData : null;
  }

  async saveNode(nodeData: Partial<TreeNodeData> & { id: string }): Promise<void> {
    await firebase.firestore()
      .collection('nodes')
      .doc(nodeData.id)
      .set(nodeData, { merge: true });
  }
}

// Use with controller
const controller = new TreeNodeController(new FirebasePersistenceAdapter());
```

## Key Benefits

1. **Framework Agnostic**: Components work in any framework or vanilla JS
2. **Separation of Concerns**: Persistence, navigation, and presentation are decoupled
3. **Testable**: Components can be tested in isolation with mock adapters
4. **Flexible**: Can use different persistence backends without changing components
5. **Reusable**: Same components work across different app architectures