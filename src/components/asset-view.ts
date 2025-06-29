import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TreeNodeController } from '../controllers/tree-node-controller.js';
import { TreeNodePersistence } from './tree-node.js';
import './tree-node.js';
import './create-new-tree-node.js';

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

  private _handleTreeNodeAction(event: CustomEvent) {
    // Bubble the event up to the parent (RootView)
    const bubbledEvent = new CustomEvent('tree-node-action', {
      detail: event.detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(bubbledEvent);
  }

  private _handleCreateNode(event: CustomEvent) {
    // Bubble the event up to the parent (RootView)
    const bubbledEvent = new CustomEvent('create-node', {
      detail: event.detail,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(bubbledEvent);
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
          
          <!-- Create sub-asset button -->
          <create-new-tree-node @create-node=${this._handleCreateNode}></create-new-tree-node>
        ` : ''}
      </div>
      <div class="asset-label">asset-view</div>
    `;
  }

  private _getPersistenceAdapter(): TreeNodePersistence | undefined {
    console.log('🔍 AssetView _getPersistenceAdapter called');
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
    'asset-view': AssetView;
  }
}