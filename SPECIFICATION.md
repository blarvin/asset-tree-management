# Asset Tree Management Specification

## Overview
Asset maintenance management app for physical assets (vehicles, buildings, industrial machinery) using a recursive tree structure where nodes represent assets and sub-assets.

## Core Principles
- **Recursive Tree Structure**: Single TreeNode component handles all levels
- **Self-Construction**: Users create and edit assets, structure, and attributes
- **Modeless In-Situ Editing**: Edit without leaving tree view or entering edit modes
- **Mobile-First**: Vertical scrolling, single/double-tap interactions
- **Offline-First Data**: Local-first with sync capabilities
- **JAMStack Architecture**: Serverless deployment

## Technical Stack
- **Framework**: Lit 3.3.0 web components
- **Language**: TypeScript with strict mode
- **Build**: Vite 6.3.5 library mode
- **Documentation**: Storybook 9.0.11
- **Routing**: Dynamic routes using nodeName parameters
- **Data**: indexedDB persists the node TreeNode and DataField data.

## Component Architecture

### Views
- **ROOT View**: List of top-level TreeNodes + "Create New Asset" button
- **ASSET View**: Dynamic route showing parent TreeNode + child TreeNodes + "Create New Sub-Asset Here" button

### Core Components
- **TreeNode**: Main component with NodeTitle, NodeSubtitle, DataCard, CardExpandButton
- **NodeTitle**: Displays breadcrumb path "Ancestor1 / Ancestor2 / Parent / **CurrentNode**" (current node in bold). Parsed from ancestorNamePath string using
  "|" delimiter, with isRoot nodes showing only nodeName.
- **NodeSubtitle**: Simple description or location string
- **CardExpandButton**: Simple chevron to expand/collapse DataCard
- **DataCard**: Contains DataFields + "Add New Field" button + metadata section
- **DataField**: Label:value pairs with expandable Details section (history, metadata, delete)
- **DataFieldMetadata**: Value history, edit history, creation details, etc. and a delete feature for the DataField.
- **CreateNewTreeNode**: Button to create a new TreeNode. Has two states: isRoot: label "Create New Asset" and isChild: label "Create New Sub-Asset Here"
- **AddDataField**: Button at the bottom of the DataCard to create a new DataField.
- **"Up" Button**: On the left end of isParent nodes. Navigates up the tree using parentId to find the parent node. If parentId is "ROOT", navigates to home page.

## Tree Structure and component visual hierarchy
- **ROOT**: Home page showing top-level "Assets". Basically a listView of slim, full-width TreeNodes with a few pixels of vertical space between.
- **NODES**: Assets and sub-assets (identical structure at every level). The element has two rows of content; the NodeTitle and the NodeSubtitle. Next to the NodeSubtitle is a CardExpandButton (chevron). On the ROOT view instances are in isRoot state, appearing as full-width slim rows in a listView. The ASSET view is also a basic vertical listView of one isParent instance and any number of isChild instances. The parent is a bit chunkier and has an "Up" button at the left to navigate up the tree. Below an isParent instance (still in the ASSET view) are the child nodes, in isChild state. These are the sub-assets of the currently selected asset. IsChild instances are 85% width, indented on the left, and cannot display their own children. 
- **DATA CARDS**: Each node has one card containing a vertical listView of multiple data field rows. For all three TreeNode states, the DataCard is 85% of the width. It slides down / up to open and close with a CardExpandButton (chevron).
- **DATA FIELDS**: The basic DataField is a row item with a label and a value. To the right of the value is a chevron button, which expands a NodeMetadata section with metadata, a delete button, and a few more features for the associated DataField. This area expands downwards and is 95% of the width of the DataCard, and shaded for visual separation.
- **NODE METADATA**: History and metadata for the node, such as createdBy, createdAt, updatedBy, updatedAt, etc. 

## TreeNode States
- **isRoot**: Top-level nodes on home page. Full width, no children shown, no "Up" button, abbreviated DataCard (first 6 DataFields, or all if fewer than 6). CardExpandButton shows "..." to indicate more fields available.
- **isParent**: Current node being viewed with children. Full width, children shown, "Up" button, full DataCard.
- **isChild**: Child nodes under current parent. Narrower (indented) on the left, no children shown, no "Up" button, full DataCard.
- **isUnderConstruction**: New node requiring setup. Same width and appearance of isParent.

## DataCard States
- **isCardExpanded**: DataCard is open/closed. Persisted to local storage.

## DataField States
- **isDetailsExpanded**: DataFieldDetails is expanded/collapsed. Persisted to local storage.

### State Transitions
- isRoot → isParent (navigate to ASSET VIEW)
- isChild → isParent (navigate deeper)
- isParent → isRoot (navigate to home using "Up" button)
- isUnderConstruction → isParent (complete setup)

## User Experience pathways

### Node Creation
- **"Create New Asset" button**: Creates a new TreeNode in isUnderConstruction state, at the current location in the tree.
- **New TreeNode Construction UI**: In isUnderConstruction state, user must enter nodeName and nodeSubtitle in their respective places on the main TreeNode, and fill in the default DataField values in the DataCard.
- **New TreeNode DataField Construction UI**: Dropdown menus for selecting DataFields organized in categories: "Identification" (part numbers, serial numbers), "Physical" (dimensions, weight, color), "Operational" (voltage, status, readings), "Documentation" (notes, images, manuals), and templates (pre defined sets of DataFields)
- **Actions**: Create/Cancel buttons to finalize or abort the creation of the new TreeNode.

### DataField Management
- **Double-Tap to edit**: Double-tap on a DataField value to replace it with an input field. Save with Enter key or by clicking outside. Cancel with Escape key.
- **Add Data Field**: A "+" button at bottom of DataCard, expands an area with DataFields organized in categories: "Identification", "Physical", "Operational", "Documentation".
- **Data Field Details**: To the right of each DataField there is a chevron button, which expands a section with metadata, a delete button, and a few more features for the associated DataField.

### Default DataFields
- "Description": A short description of the asset.
- "Type Of": Such as "Vehicle", "Building", "Machine", "Equipment", "Tool", "Other".
- "Tags": A list of tags that can be used to search for the asset.

### Empty State (ROOT view)
- Default welcome message "Create a new asset to get started"
- CreateNewTreeNode button (isRoot state)

#### Navigation Logic:

- URLs: Only for top-level assets (vehicles, buildings, machines)
- Sub-navigation: All handled client-side within the asset view
- Up button: Just navigates within the current asset's tree structure
- **URL persistence**: Only the current top-level asset appears in the URL (/asset/[name]); all sub-navigation within that asset's tree is handled client-side without URL changes, with the "Up" button providing the primary navigation mechanism back through the hierarchy.

### DataField Library
- **It's a node!**: Just like the other nodes, using the same TreeNode component.
- **Crowd-Sourced**: When a user creates a new DataField, it is added to the DataField Library.
- **Reusability**: Available across all users and nodes
- **Initial library**: Default DataFields plus examples from below.

## Phase 1 Prototyping Simplifications
- **Skip virtualParents**: Focus on basic parent-child relationships only
- **Skip DataField Library as separate node**: Use hardcoded list of available DataFields  
- **Skip complex state persistence**: Use basic localStorage for expanded states
- **Skip templates**: Focus on individual DataField selection only

## Example DataFields
- Location: 123 Main St, Anytown, USA
- Part Description: Soft Start Motor Controller, 3 phase
- Serial Number: 1234567890
- Part Number: 1234567890
- Manufacturer: Acme Inc.
- Model: Model 123
- Weight: 100lbs
- Dimensions: 10x10x10
- Mount: NEMA 12
- Shaft Diameter: 1.50 inches
- Shaft Key: woodruff, 3.5mm
- Color: Red
- Installed Date: 2025-01-01
- Status: In Service
- Voltage Rating: 120V
- Current Rating: 10A
- Current Reading: 5.4 amps, on 2025-01-01
- Power Rating: 1200W
- Frequency: 60Hz
- Phase: 3-Phase
- Poles: 4
- Insulation Class: B
- Insulation Resistance: 100MΩ
- Notes: This is a note about the asset.
- Image: https://example.com/image.jpg

## Pages and URL Structure
- / for ROOT view
- /asset/[Top_Level_Asset_Name] for ASSET view (drill down within that asset)

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
  cardOrdering: number;          // Position on DataCard, user editable via UI (metadata)
  componentType: string;         // Component type, user selected at creation e.g. "graphComponent", "imageCarouselComponent". (metadata)
  componentVersion: string;      // For feedback and debugging (metadata)
  customProperties: string[];	   // Such as API source, API key, etc. (metadata)
  isRequired: boolean;           // Whether the field is required (metadata)
  isLocked: boolean;             // Whether the field is locked, set by user (metadata)
  isEditable: boolean;           // Whether the field is editable (metadata)
}
```