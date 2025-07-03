import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import { TreeNodeController } from '../controllers/tree-node-controller.js';
import { TreeNodePersistence, TreeNodeData } from './tree-node.js';
import './tree-node.js';
import './create-new-tree-node.js';
import './child-container.js';

@customElement('asset-view')
export class AssetView extends LitElement {
  @property({ type: String })
  currentAssetId: string | null = null;

  @property({ type: Boolean })
  isNewAsset = false;

  @property({ type: Object })
  treeController?: TreeNodeController;

  @property({ type: Object })
  persistenceAdapter?: TreeNodePersistence;


  @state()
  private _childNodes: TreeNodeData[] = [];

  @state()
  private _isLoadingChildren = false;

  @state()
  private _newChildNodes: Map<string, TreeNodeData> = new Map();

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .content {
      width: 100%;
      height: 100%;
    }

    .asset-label {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 12px;
      color: rgb(46, 66, 252);
      font-family: monospace;
    }
  `;

  private async _handleTreeNodeAction(event: CustomEvent) {
    const { action, nodeId, nodeName } = event.detail;
    console.log(`🟡 AssetView handling: ${action} for nodeId: ${nodeId} (${nodeName})`);
    
    // Handle new child actions
    if (this._newChildNodes.has(nodeId)) {
      console.log(`🟡 AssetView: Handling NEW child action ${action}`);
      if (action === 'saved') {
        // Remove from new children and refresh child list
        this._newChildNodes.delete(nodeId);
        await this._loadChildNodes();
        this.requestUpdate();
        return; // Don't bubble up, handled locally
      } else if (action === 'cancelled') {
        // Just remove from new children
        this._newChildNodes.delete(nodeId);
        this.requestUpdate();
        return; // Don't bubble up, handled locally
      }
    }
    
    // Refresh child nodes when an existing child is saved
    if (action === 'saved') {
      await this._loadChildNodes();
    }
    
    console.log(`🟡 AssetView: Bubbling ${action} up to RootView`);
    // Bubble the event up to the parent (RootView)
    const bubbledEvent = new CustomEvent('tree-node-action', {
      detail: event.detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(bubbledEvent);
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.currentAssetId) {
      await this._loadChildNodes();
    }
  }

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('currentAssetId') && this.currentAssetId) {
      await this._loadChildNodes();
    }
  }

  private async _loadChildNodes() {
    if (!this.currentAssetId) return;
    
    this._isLoadingChildren = true;
    try {
      const adapter = this._getPersistenceAdapter();
      if (adapter?.loadChildNodes) {
        this._childNodes = await adapter.loadChildNodes(this.currentAssetId);
      }
    } catch (error) {
      console.error('❌ Failed to load child nodes:', error);
      this._childNodes = [];
    } finally {
      this._isLoadingChildren = false;
      this.requestUpdate();
    }
  }

  private async _handleCreateNode(event: CustomEvent) {
    const { isRoot } = event.detail;
    
    if (isRoot) {
      // Bubble root creation up to RootView
      const bubbledEvent = new CustomEvent('create-node', {
        detail: event.detail,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(bubbledEvent);
    } else {
      // Handle child creation in-place
      await this._createChildInPlace();
    }
  }

  private async _createChildInPlace() {
    if (!this.currentAssetId) return;
    
    // Get parent name for ancestorNamePath
    let parentName = '';
    try {
      const adapter = this._getPersistenceAdapter();
      if (adapter) {
        const parentData = await adapter.loadNode(this.currentAssetId);
        parentName = parentData?.nodeName || 'Unknown Parent';
      }
    } catch (error) {
      console.error('Failed to load parent data:', error);
      parentName = 'Unknown Parent';
    }
    
    // Create new child data
    const newChildId = uuidv4();
    const newChild: TreeNodeData = {
      id: newChildId,
      nodeName: '', // Empty for new input
      parentId: this.currentAssetId,
      ancestorNamePath: parentName
    };
    
    // Add to new children map
    this._newChildNodes.set(newChildId, newChild);
    this.requestUpdate();
  }


  render() {
    return html`
      <div class="content">
        <!-- Current asset being viewed -->
        ${this.currentAssetId ? html`
          <tree-node 
            isParent 
            ?isUnderConstruction=${this.isNewAsset}
            nodeId=${this.currentAssetId}
            .persistenceAdapter=${this._getPersistenceAdapter()}
            @tree-node-action=${this._handleTreeNodeAction}
          ></tree-node>
          
          <!-- Child nodes -->
          ${this._isLoadingChildren ? html`
            <div style="padding: 20px; color: rgb(242, 129, 129);">
              Loading children...
            </div>
          ` : ''}
          
          <!-- Child nodes -->
          ${this._childNodes.map(child => html`
            <child-container>
              <tree-node 
                isChild 
                nodeId=${child.id}
                .nodeData=${child}
                .persistenceAdapter=${this._getPersistenceAdapter()}
                @tree-node-action=${this._handleTreeNodeAction}
              ></tree-node>
            </child-container>
          `)}
          
          <!-- New children being created -->
          ${Array.from(this._newChildNodes.values()).map(child => html`
            <child-container>
              <tree-node 
                isChild 
                isUnderConstruction
                nodeId=${child.id}
                .nodeData=${child}
                .persistenceAdapter=${this._getPersistenceAdapter()}
                @tree-node-action=${this._handleTreeNodeAction}
              ></tree-node>
            </child-container>
          `)}
          
          <!-- Create sub-asset button -->
          <create-new-tree-node @create-node=${this._handleCreateNode}></create-new-tree-node>
        ` : ''}
      </div>
      <div class="asset-label">asset-view</div>
    `;
  }

  private _getPersistenceAdapter(): TreeNodePersistence | undefined {
    if (this.treeController) {
      return this.treeController.createNodeAdapter();
    }
    return this.persistenceAdapter;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'asset-view': AssetView;
  }
}