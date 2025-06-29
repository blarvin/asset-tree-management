import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import './create-new-tree-node.js';
import './tree-node.js';

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

  private _renderRootView() {
    return html`
      <div class="content">
        <!-- List of root assets -->
        ${this._assets.map(asset => html`
          <tree-node 
            isRoot 
            nodeId=${asset.id}
            @tree-node-action=${this._handleTreeNodeAction}
          ></tree-node>
        `)}
        
        <!-- Create new asset button -->
        <create-new-tree-node isRoot @create-node=${this._handleCreateNode}></create-new-tree-node>
      </div>
      <div class="root-label">root-view</div>
    `;
  }

  private _renderAssetView() {
    const isNewAsset = this._newAssetIds.has(this._currentAssetId || '');
    
    return html`
      <div class="content">
        <!-- Current asset being viewed -->
        ${this._currentAssetId ? html`
          <tree-node 
            isParent 
            ?isUnderConstruction=${isNewAsset}
            nodeId=${this._currentAssetId}
            @tree-node-action=${this._handleTreeNodeAction}
          ></tree-node>
          
          <!-- Create sub-asset button -->
          <create-new-tree-node @create-node=${this._handleCreateNode}></create-new-tree-node>
        ` : ''}
      </div>
      <div class="root-label">asset-view</div>
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
    } else {
      // Handle creating sub-asset (child node)
      console.log('Creating sub-asset for:', this._currentAssetId);
    }
  }

  private _handleTreeNodeAction(event: CustomEvent) {
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
        // Asset was saved, add to assets list if it's new
        if (nodeName && !this._assets.find(a => a.id === nodeId)) {
          this._assets = [...this._assets, { id: nodeId, name: nodeName }];
        }
        // Remove from new assets set (no longer under construction)
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
}

declare global {
  interface HTMLElementTagNameMap {
    'root-view': RootView;
  }
}