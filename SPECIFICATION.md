# Asset Tree Management Specification

## Overview
Asset maintenance management app for physical assets (vehicles, buildings, industrial machinery) using a recursive tree structure where nodes represent assets and sub-assets.

## Core Principles
- **Recursive Tree Structure**: Every node is much the same as any other and can have any number of child nodes.
- **Self Similarity**: Single TreeNode component handles all levels, with state variants for different contexts
- **Self-Construction**: Users create and edit assets, structure, and attributes
- **Modeless In-Situ Editing**: Edit without leaving tree view or entering edit modes
- **Mobile-First**: Vertical scrolling, single/double-tap interactions


- **Offline-First Data**: Local-first with sync capabilities
- **JAMStack Architecture**: Serverless deployment

## Technical Stack
- **Framework**: Lit 3.3.0 web components
- **Language**: TypeScript with strict mode
- **Build**: Vite 6.3.5 library mode
- **Data**: indexedDB persists the node TreeNode and DataField data.

## Component Architecture

### Views
- **ROOT View**: Listview of top-level Assets (TreeNodes in root state) + "Create New Asset" button at the bottom. Single flex container element for layout.
- **ASSET View**: A listview with one parent Asset (TreeNode in parent state) at the top, with first-child TreeNodes below. A flex container for the parent Asset at the top with 2px padding bottom. Second flex container below for any number of child Assets with 2px gap, and padding-left 20rm for visual indentaion of children. 

### Core Component visual hierarchy
- **TreeNode**: Main component with NodeTitle, NodeSubtitle, DataCard, CardExpandButton
- **NodeTitle**: Displays breadcrumb path "Ancestor1 / Ancestor2 / Parent / **CurrentNode**" (current node in bold). Parsed from ancestorNamePath string.
- **NodeSubtitle**: Simple description or location string
- **DataCard**: Every TreeNode has exactly one DataCard. Contains DataFields (user values) + "Add New Field" button + node metadata section. Slides down into view when expanded. Use a grid container with display: grid and grid-template-rows transition (0fr → 1fr), containing a middle div with overflow: hidden, wrapping a data-card div with translateY transition (-100% → 0). Both the grid and transform transitions must run simultaneously with matching durations. This should react to content (DataField) quantity without a ref.
- **CardExpandButton**: Simple chevron to expand/collapse DataCard, to the right of NodeSubtitle
- **DataField**: Row item with Label:Value pairs, which users add to an asset node. Most values can be edited afterwards with a simple double-tap interaction. 
- **DataFieldMetadata**: Expandable "details" section with Value history, edit history, creation details, etc. and a delete feature for the DataField.
- **ExpandDataField**: Button to expand the DataFieldMetadata section. Simple chevron on the right of each DataField.
- **AddDataField**: Button at the bottom of the DataCard to create a new DataField for the Asset node on its DataCard.
- **"Up" Button**: On the left end of parent nodes (Asset node at top of ASSET view). Navigates up the tree using parentId to find the parent node. If parentId is "ROOT", navigates to home page.
- **CreateNewTreeNode**: Button to create a new TreeNode. Has two states: isRoot: label "Create New Asset" and isChild: label "Create New Sub-Asset Here"

## TreeNode States
- **isRoot**: Top-level nodes on ROOT view. Full width, no children shown, no "Up" button, abbreviated DataCard (first 6 DataFields, or all if fewer than 6).
- **isParent**: Current node being viewed at top of ASSET view. Full width, children shown below, "Up" button, full DataCard.
- **isChild**: Child nodes under current parent. Narrower (indented) on the left, no children shown, no "Up" button, full DataCard.
- **isUnderConstruction**: New node requiring setup with empty in-situ Name and Subtitle fields to be filled. Replaces CreateNewTreeNode button in-place as either isRoot or isChild. The isUnderConstruction node's DataCard is set to isCardExpanded and isCardUnderConstruction 

## DataCard States
- **isCardExpanded**: DataCard is open/closed. Persisted to local storage.
- **isCardUnderConstrution**: Default DataField values are active for entry in-situ (though not required). "Save" and "Cancel" buttons at the bottom.

## DataField States
- **isMetadataExpanded**: Metadata / details area is expanded/collapsed. Persisted to local storage.
- **isEditing**: DataField is active for editing (active Valueinput field, drag handle to the left). Not persisted - component-local state only.

### State Transitions (use finite state machine pattern)
- isRoot → isParent (navigate to ASSET VIEW)
- isChild → isParent (navigate deeper)
- isParent → isRoot (navigate to home using "Up" button)
- isUnderConstruction → isRoot or isChild (new node created in-situ where button clicked)

## User Experience pathways

### Navigation Logic ... handled client-side without URL changes
- **Down-tree**: Move down the tree by tapping any child node. Takes user to Parent state for that node.
- **Up-tree**: The "Up" button navigates to current node's parent's Parent state, or to ROOT view if no parent.

### Node Creation
- **"Create New Asset" button**: Creates a new TreeNode in isUnderConstruction state, as a child of the current parent Asset.
- **New TreeNode Construction UI**: In isUnderConstruction state, user must enter "Name" (nodeName) and "Subtitle" (nodeSubtitle) in their respective places on the TreeNode, and fill in the default DataField values in the DataCard.
- **New TreeNode DataField Construction UI**: Dropdown menus for selecting DataFields, organized in categories. Multiple DataFields can be selected for inclusion  See Example DataFields below.  
- **Actions**: Create/Cancel buttons to finalize or abort the creation of the new TreeNode.

## DataField Management
- **Double-Tap to edit**: Double-tap on a DataField row (Label or Value) to edit the Value. The Value becomes an active input field. Save by double-tapping again. Cancel by tapping outside.  (Implementation: Set isEditing=true on double-tap to show input field and drag handle. Set isEditing=false on save/cancel.)
- **Add Data Field**: A "+" button at bottom of DataCard, expands an area with DataFields organized in categories, (similar to isCardUnderConstruction).
- **Delete Data Field**: Expand the DataFieldMetadata to see a Delete button at the bottom of the section.
- **Reorder on Data Card**: When a Data Field is active for editing, a small "drag handle" appears to the left of the row. The user can drag the row up or down to reorder the DataFields on the DataCard. (Implementation: Show drag handle when isEditing=true. Use HTML5 drag events for interaction. Only persist cardOrdering numbers to storage.)

### Default DataFields ... Added and active for Value entry at node creation time, but not required to be filled-in.
- **"Description"**: A short description of the asset.
- **"Type Of**": Such as "Vehicle", "Building", "Machine", "Equipment", "Tool", "Other" (abitrary string entered by user).
- **"Tags"**: A list of tags that can be used to search for the asset (arbitrary comma-seperated strings entered by user).
- **"Node Metadata"**: History and metadata for the node, such as createdBy, createdAt, updatedBy, updatedAt, etc. 


### Example DataFields (hardcoded for now)
- Location: 123 Main St, Anytown, USA
- Part Description: Soft Start Motor Controller, 3 phase
- Serial Number: 1234567890
- Part Number: 1234567890
- Manufacturer: Acme Inc.
- Model: Model ABC-123
- Weight: 36.2 kg
- Dimensions: 310 x 210 x 110 mm
- Mount: NEMA 12
- Shaft Diameter: 1.50 inches
- Shaft Key: woodruff, 3.5mm
- Color: Red
- Installed Date: 2025-01-01
- Status: In Service
- Current Rating: 10A
- Current Reading: 5.4 amps at 2025-01-01
- Power Rating: 1200W
- Phase: 3-Phase
- Poles: 4
- Notes: This is a nice little note about the asset.
- Image: <IMAGE>

### Empty State (ROOT view)
- Default welcome message "Create a new asset to get started"
- CreateNewTreeNode button (isRoot state)

## Data Fetching and Management Strategy
- **Offline-First Architecture**: All data operations work against local IndexedDB first, with automatic synchronization to cloud/server when connected.
- **Progressive Chunk Loading**: Fetch one TreeNodeRecord with all its DataFieldRecords per request, continuing automatically until the full tree is loaded (connection permitting)
- **Breadth-first data fetching**: Fetch top-level TreeNodeRecords first, then their children, then their children's children, etc.
- **Bidirectional Auto-Sync**: All local changes immediately persist to IndexedDB and queue for cloud/server sync when connected
- **Conflict Resolution**: Last-write-wins with version tracking for merge conflicts between local and cloud data 

## Data Schema

```typescript
// TreeNode DB Schema
interface TreeNodeRecord {
  id: string;                    // Primary key (UUID), generated by client (metadata)
  nodeName: string;              // Name of the node, DISPLAYED in NodeTitle, user editable
  nodeSubtitle: string;          // Subtitle, DISPLAYED in NodeSubtitle, user editable
  parentId: string | null;       // Reference to parent ("ROOT" for top level node) (metadata)
  ancestorNamePath: string;      // Single string of all ancestor names, separated by "|" (metadata)
  virtualParents: string[];      // Virtual parent references. For the other end of a hose, wire, pipe, etc. Procedurally generated via UI. (metadata)
  createdBy: string;             // Creator ID, type: userID, generated by client (metadata)
  createdAt: EpochTimeStamp;     // Creation timestamp, generated by client (metadata)
  updatedBy: string;             // Last updater ID, type: userID, generated by client (metadata)
  updatedAt: EpochTimeStamp;     // Last update timestamp, generated by client (metadata)
  componentType: string;         // Component type, for special cases of a TreeNode such as isSettingsNode rather than a physical asset. (metadata)
  componentVersion: string;      // For feedback and debugging (metadata)
  customProperties: string[];	   // Such as API source, API key, etc. (metadata)
  nodeOrdering: number;          // Display order among siblings, probably won't be used for normal nodes, maybe for isSettingsNode. (metadata)
  dataFields: { [fieldId: string]: string }; // Store field IDs only, not the entire record (metadata)
  subAssets: { [nodeId: string]: boolean }; // Just references, not full objects (metadata)
}
```

```typescript
// DataField DB Schema
interface DataFieldRecord {
  id: string;                    // Primary key (UUID), generated by client (metadata)
  fieldName: string;             // Field name, usuallly DISPLAYED as label, user entered, user editable
  parentNodeId: string;          // Foreign key to TreeNode, (UUID), entered by client (metadata)
  dataValue: string;             // The actual value, user entered, user editable. May be of other types, but stored as string. DISPLAYED as DataValue.
  createdBy: string;             // Creator ID, type: userID, generated by client (metadata)
  createdAt: EpochTimeStamp;     // Creation timestamp, generated by client (metadata)
  updatedBy: string;             // Last updater ID, type: userID, generated by client (metadata)
  updatedAt: EpochTimeStamp;     // Last update timestamp, generated by client (metadata)
  cardOrdering: number;          // Position on DataCard, user editable via UI
  componentType: string;         // Component type, user selected at creation e.g. "graphComponent", "imageCarouselComponent". (metadata)
  componentVersion: string;      // For feedback and debugging (metadata)
  customProperties: string[];	  // Such as API source, API key, etc. (metadata)
  isRequired: boolean;           // Whether the field is required (metadata)
  isLocked: boolean;             // Whether the field is locked, set by user (metadata)
  isEditable: boolean;           // Whether the field is editable (metadata)
}
```

## Phase 1 Prototyping Simplifications
- **Skip virtualParents**: Focus on basic parent-child relationships only
- **Skip componentType and componentVersion**: Use hardcoded list of available DataFields 
- **Skip customProperties**: Focus on basic node and datafield types only
- **Skip isRequired**: No "required data field" features for now
- **Skip isEditable and isLocked**: All data fields are editable for now, no "locking" features for now
