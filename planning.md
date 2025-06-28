│ │ Plan: Create ROOT View Component                                                                                                                               │ │
│ │                                                                                                                                                                │ │
│ │ Project Structure Setup:                                                                                                                                       │ │
│ │ 1. Create src/ directory and src/components/ subdirectory                                                                                                      │ │
│ │ 2. Create src/index.ts entry point file                                                                                                                        │ │
│ │                                                                                                                                                                │ │
│ │ ROOT View Component Creation:                                                                                                                                  │ │
│ │ 3. Create src/components/root-view.ts - A Lit component for the ROOT view                                                                                      │ │
│ │ - Blue border styling for development visibility                                                                                                               │ │
│ │ - "root-component" label positioned in bottom right corner                                                                                                     │ │
│ │ - Container structure for future TreeNode components                                                                                                           │ │
│ │ - Following project's minimal approach and existing Lit patterns                                                                                               │ │
│ │                                                                                                                                                                │ │
│ │ Story Creation:                                                                                                                                                │ │
│ │ 4. Create stories/RootView.stories.ts for Storybook documentation                                                                                              │ │
│ │                                                                                                                                                                │ │
│ │ Key Features of ROOT Component:                                                                                                                                │ │
│ │ - Uses Lit 3.3.0 with @customElement decorator                                                                                                                 │ │
│ │ - Scoped CSS with blue border for development layout visibility                                                                                                │ │
│ │ - Bottom-right positioned label "root-component"                                                                                                               │ │
│ │ - Flexible container for hosting TreeNode components during development                                                                                        │ │
│ │ - Follows the specification's mobile-first, vertical scrolling design                                                                                          │ │
│ │ - Maintains project's simplicity principle 




    Component Requirements (from spec + clarifications):

    - Two states: isRoot (label: "Create New Asset") and isChild (label: "Create New 
    Sub-Asset Here")
    - Purpose: Button to create new TreeNode instances by emitting events
    - Styling: Wide and thin row, 99% width of container, styled to look like TreeNode
    - Behavior: Emits custom event for parent to handle - navigates to ASSET view with 
    isUnderConstruction TreeNode

    Implementation Plan:

    1. Create Component (src/components/create-new-tree-node.ts):
      - Use Lit 3.3.0 with @customElement decorator (following existing pattern)
      - Add isRoot boolean property with @property() decorator
      - Emit custom create-node event on click (no internal creation logic)
      - Style as wide, thin row (99% width) to match TreeNode appearance
      - Conditional text rendering based on isRoot state
      - No loading states needed
    2. Styling:
      - Wide and thin row design (99% container width)
      - Visual styling to mimic TreeNode appearance
      - Clear button-like interaction states (hover, active)
      - Consistent with existing component patterns
    3. Integration with RootView:
      - Add CreateNewTreeNode component to root-view for testing/development
      - Include in the root-view template for immediate visual verification
    4. Create Storybook Story (stories/CreateNewTreeNode.stories.ts):
      - Follow existing story pattern from RootView.stories.ts
      - Create stories: "AsRootButton" and "AsChildButton"
      - Include interactive controls for isRoot property
      - Demonstrate event emission with action logging
      - Show integration within root-view context
    5. Event Handling:
      - Emit create-node custom event with relevant data
      - Parent components handle navigation to ASSET view
      - TreeNode handles its own isUnderConstruction state

    This maintains the project's simplicity-first approach while providing a TreeNode-like 
    appearance for seamless UI integration.