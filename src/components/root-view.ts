import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import { treeNodeStore } from '../services/tree-node-store.js';
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
    console.log('📂 Loading assets from IDB...');
    this._isLoadingAssets = true;
    try {
      const rootNodes = await treeNodeStore.getRootNodes();
      console.log(`✅ Loaded ${rootNodes.length} root nodes:`, rootNodes);
      this._assets = rootNodes.map(node => ({
        id: node.id,
        name: node.nodeName
      }));
      console.log('📋 Mapped assets:', this._assets);
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
          console.log(`🌳 Rendering tree-node ${asset.id} with adapter:`, !!adapter);
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
    
    console.log('🏗️ Rendering asset-view with treeController:', !!this.treeController);
    
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
    console.log(`🎯 TreeNode action: ${action}`, { nodeId, nodeName });
    
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
    console.log('🔍 _getPersistenceAdapter called');
    console.log('  treeController:', !!this.treeController);
    console.log('  persistenceAdapter:', !!this.persistenceAdapter);
    
    if (this.treeController) {
      const adapter = this.treeController.createNodeAdapter('');
      console.log('  returning controller adapter:', !!adapter);
      return adapter;
    }
    console.log('  returning direct adapter:', !!this.persistenceAdapter);
    return this.persistenceAdapter;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-view': RootView;
  }
}