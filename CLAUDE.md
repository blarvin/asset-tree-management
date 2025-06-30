# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a prototyping project for developing clean, simple web components using Lit with TypeScript and Storybook. The project prioritizes simplicity and minimal changes to achieve results. 

PROTOTYPING, PROTOTYPING, PROTOTYPING! We must always do the simplest possible thing to achieve any given goal. 

**Key Principle**: Always do the simplest thing, make minimal changes, keep simplicity and clean code first.

This is a web component-based tree management system built with Lit framework for creating hierarchical asset trees with persistence. The architecture follows a clean separation of concerns with:

1. UI Components (Lit Web Components)
2. Controllers (State Management & Caching)
3. Adapters (Persistence Abstraction)
4. Services (Data Storage)

### Key Components Explained

#### 1. TreeNodeStore Service (src/services/tree-node-store.ts)

- **Purpose**: Low-level IndexedDB persistence layer
- **Functionality**:
  - Manages direct IndexedDB operations for storing tree nodes
  - Creates database "AssetTreeDB" with "treeNodes" object store
  - Stores TreeNodeRecord objects with fields: id, nodeName, parentId, createdAt, updatedAt
  - Provides CRUD operations: saveNode, loadNode, getAllNodes, getRootNodes, deleteNode
  - Uses indexes for efficient querying by parentId and nodeName
- **Future Use**: Designed to be easily replaceable with Firebase or other backends

#### 2. IDBPersistenceAdapter (src/adapters/idb-persistence-adapter.ts)

- **Purpose**: Adapter pattern implementation bridging generic persistence interface with specific storage
- **Functionality**:
  - Implements TreeNodePersistence interface
  - Translates between TreeNodeData (UI model) and TreeNodeRecord (storage model)
  - Acts as a thin wrapper around treeNodeStore
  - Provides singleton instance for easy injection
- **Future Use**: Can be swapped with different adapters (Firebase, REST API, etc.) without changing components

#### 3. TreeNodeController (src/controllers/tree-node-controller.ts)

- **Purpose**: State management and performance optimization through caching
- **Functionality**:
  - Adds in-memory caching layer on top of persistence
  - Manages node data lifecycle with cache invalidation
  - Provides createNodeAdapter() method that returns persistence interface
  - Ensures consistency across multiple TreeNode instances
  - Cache operations: loadNode (with cache check), saveNode (with cache update), invalidateNode, clearCache
- **Future Use**: Can add features like batch operations, optimistic updates, conflict resolution

#### 4. TreeNode Component (src/components/tree-node.ts)

- **Purpose**: Core UI component for displaying and editing tree nodes
- **Functionality**:
  - Supports multiple states: root, parent, child, under-construction
  - Handles persistence through injected TreeNodePersistence interface
  - Emits custom events for navigation and state changes
  - Manages its own loading state and data fetching
  - Visual states with different styling and layout
- **Key Design**: Framework-agnostic through persistence interface injection

### Architecture Flow

1. **Component Creation**: RootView creates TreeNode components
2. **Persistence Injection**: Either controller adapter or direct IDB adapter is passed to components
3. **Data Loading**:
   - Component requests data through persistence interface
   - Controller checks cache first, then delegates to adapter
   - Adapter translates request to store
   - Store performs IndexedDB operations
4. **Data Saving**:
   - Component saves through persistence interface
   - Controller updates cache and delegates to adapter
   - Adapter translates to store format
   - Store persists to IndexedDB

### Design Patterns Used

1. **Adapter Pattern**: IDBPersistenceAdapter adapts generic interface to specific implementation
2. **Strategy Pattern**: TreeNodePersistence interface allows swapping persistence strategies
3. **Singleton Pattern**: Store and adapter instances are singletons
4. **Observer Pattern**: Components emit custom events for state changes
5. **Cache-Aside Pattern**: Controller implements read-through caching 

## Architecture

- **Framework**: Lit 3.3.0 for web components
- **Build Tool**: Vite 6.3.5 with library mode configuration
- **Documentation**: Storybook 9.0.11 with web-components-vite framework
- **Language**: TypeScript 5.8.3 with strict configuration
- **Styling**: Plain CSS scoped inside components (no external CSS frameworks)

## Commands

### Development
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Build
- `vite build` - Build the library (configured for ES modules, externalizes Lit)

## Configuration Details

### TypeScript
- Target ES2020 with strict mode enabled
- Experimental decorators enabled for Lit components
- `useDefineForClassFields: false` for proper Lit property behavior
- Includes both `src/` and `stories/` directories

### Vite
- Configured for library mode with `src/index.ts` as entry point
- Outputs ES modules only
- Externalizes Lit dependencies to avoid bundling

### Storybook
- Uses web-components-vite framework
- Stories located in `stories/` directory
- Includes docs addon for component documentation
- Configured to find stories in `*.stories.ts` files

## Development Guidelines

When creating new components:
1. Use Lit's `@customElement` decorator
2. Keep CSS scoped within the component using Lit's `css` template literal
3. Follow the existing story structure in `stories/` directory
4. Maintain the minimal, clean approach established in the project

## Storybook Notes
- `import {action} from 'storybook/actions'` is included, no need for `'addon-actions'`