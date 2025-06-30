import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import { treeNodeStore } from '../services/tree-node-store.js';
import { TreeNodePersistence } from './tree-node.js';
import { TreeNodeController } from '../controllers/tree-node-controller.js';
import './create-new-tree-node.js';
import './tree-node.js';
import './asset-view.js';

@customElement('root-view')
export class RootView extends LitElement {
  @state()
  private _currentView: 'ROOT' | 'ASSET' = 'ROOT';

  @state()
  private _currentAssetId: string | null = null;

  @state()
  private _assets: Array<{id: string, name: string}> = [];

  @state()
  private _newAssetIds: Set<string> = new Set();

  @state()
  private _isLoadingAssets = false;

  @property({ type: Object })
  treeController?: TreeNodeController;

  @property({ type: Object })
  persistenceAdapter?: TreeNodePersistence;
  static styles = css`
    :host {
      display: block;
      position: relative;
      min-height: 98vh;
      border: 2px solid blue;
      margin: 1px;
      box-sizing: border-box;
      background: rgba(11, 6, 6, 0.91);
    }

    .root-label {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 12px;
      color: rgb(46, 66, 252);
      font-family: monospace;
    }

    .content {
      width: 100%;
      height: 100%;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadAssetsFromIDB();
  }

  private async _loadAssetsFromIDB() {
    this._isLoadingAssets = true;
    try {
      const rootNodes = await treeNodeStore.getRootNodes();
      this._assets = rootNodes.map(node => ({
        id: node.id,
        name: node.nodeName
      }));
    } catch (error) {
      console.error('❌ Failed to load assets:', error);
      this._assets = [];
    } finally {
      this._isLoadingAssets = false;
      this.requestUpdate();
    }
  }

  private _renderRootView() {
    return html`
      <div class="content">
        ${this._isLoadingAssets ? html`
          <div style="padding: 20px; color: rgb(242, 129, 129);">
            Loading assets...
          </div>
        ` : ''}
        
        <!-- List of root assets -->
        ${this._assets.map(asset => {
          const adapter = this._getPersistenceAdapter();
          return html`
            <tree-node 
              isRoot 
              nodeId=${asset.id}
              .persistenceAdapter=${adapter}
              @tree-node-action=${this._handleTreeNodeAction}
            ></tree-node>
          `;
        })}
        
        <!-- Create new asset button -->
        <create-new-tree-node isRoot @create-node=${this._handleCreateNode}></create-new-tree-node>
      </div>
      <div class="root-label">root-view</div>
    `;
  }

  private _renderAssetView() {
    const isNewAsset = this._newAssetIds.has(this._currentAssetId || '');
    
    return html`
      <asset-view 
        currentAssetId=${this._currentAssetId}
        ?isNewAsset=${isNewAsset}
        .treeController=${this.treeController}
        .persistenceAdapter=${this.persistenceAdapter}
        @tree-node-action=${this._handleTreeNodeAction}
        @create-node=${this._handleCreateNode}
      ></asset-view>
    `;
  }

  render() {
    return this._currentView === 'ROOT' ? this._renderRootView() : this._renderAssetView();
  }

  private _handleCreateNode(event: CustomEvent) {
    const { isRoot } = event.detail;
    
    if (isRoot) {
      // Create new asset and navigate to ASSET view
      const newAssetId = uuidv4();
      this._currentAssetId = newAssetId;
      this._currentView = 'ASSET';
      this._newAssetIds.add(newAssetId);
    }
  }

  private async _handleTreeNodeAction(event: CustomEvent) {
    const { action, nodeId, nodeName } = event.detail;
    
    switch (action) {
      case 'navigate-up':
        this._currentView = 'ROOT';
        this._currentAssetId = null;
        break;
      case 'navigate-to':
        this._currentAssetId = nodeId;
        this._currentView = 'ASSET';
        break;
      case 'saved':
        if (nodeName) {
          await this._loadAssetsFromIDB();
        }
        this._newAssetIds.delete(nodeId);
        break;
      case 'cancelled':
        // If cancelling a new asset creation, go back to ROOT
        if (this._currentView === 'ASSET' && this._currentAssetId === nodeId) {
          this._currentView = 'ROOT';
          this._currentAssetId = null;
        }
        // Remove from new assets set
        this._newAssetIds.delete(nodeId);
        break;
    }
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
    'root-view': RootView;
  }
}