import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface TreeNodeData {
  id: string;
  nodeName: string;
  parentId?: string | null;
}

export interface TreeNodePersistence {
  loadNode(nodeId: string): Promise<TreeNodeData | null>;
  saveNode(nodeData: Partial<TreeNodeData> & { id: string }): Promise<void>;
}

@customElement('tree-node')
export class TreeNode extends LitElement {
  @property({ type: Boolean })
  isRoot = false;

  @property({ type: Boolean })
  isParent = false;

  @property({ type: Boolean })
  isChild = false;

  @property({ type: Boolean })
  isUnderConstruction = false;

  @property({ type: String })
  nodeId = '';

  @property({ type: Object })
  persistenceAdapter?: TreeNodePersistence;
  
  @property({ type: Object })
  nodeData?: TreeNodeData;

  @state()
  private _nodeName = '';

  @state()
  private _isLoading = false;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 8px;
    }

    .tree-node {
      border: none;
      border-radius: 4px;
      background: rgb(30, 87, 134);
      color: rgb(242, 129, 129);
      font-family: inherit;
      font-size: 16px;
      padding: 12px;
      box-sizing: border-box;
      min-height: 60px;
      outline: none;
      box-shadow: none;
    }

    .tree-node.is-root {
      width: 100%;
    }

    .tree-node.is-parent {
      width: 100%;
      padding-left: 40px;
      position: relative;
    }

    .tree-node.is-child {
      width: 85%;
      margin-left: 15%;
    }

    .tree-node.is-under-construction {
      width: 100%;
      border: 2px dashed rgb(242, 129, 129);
    }

    .up-button {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgb(242, 129, 129);
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }

    .up-button:hover {
      color: rgb(255, 200, 200);
    }

    .node-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .node-title {
      font-weight: bold;
      font-size: 18px;
    }


    .construction-input {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgb(242, 129, 129);
      border-radius: 4px;
      color: rgb(242, 129, 129);
      padding: 8px;
      font-size: 16px;
      width: 100%;
      margin-bottom: 8px;
    }

    .construction-input:focus {
      outline: none;
      border-color: rgb(255, 200, 200);
      background: rgba(255, 255, 255, 0.2);
    }

    .construction-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .action-button {
      background: rgb(242, 129, 129);
      color: rgb(30, 87, 134);
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
    }

    .action-button:hover {
      background: rgb(255, 200, 200);
    }

    .action-button.cancel {
      background: transparent;
      color: rgb(242, 129, 129);
      border: 1px solid rgb(242, 129, 129);
    }

    .action-button.cancel:hover {
      background: rgba(242, 129, 129, 0.1);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    if (this.nodeData) {
      this._nodeName = this.nodeData.nodeName || '';
    } else if (this.persistenceAdapter && this.nodeId) {
      await this._loadFromStorage();
    }
  }

  private async _loadFromStorage() {
    if (!this.persistenceAdapter) return;
    
    this._isLoading = true;
    try {
      const nodeData = await this.persistenceAdapter.loadNode(this.nodeId);
      if (nodeData) {
        this._nodeName = nodeData.nodeName || '';
      }
    } catch (error) {
      console.error('Failed to load node data:', error);
    } finally {
      this._isLoading = false;
      this.requestUpdate();
    }
  }


  private async _saveToStorage() {
    if (!this.persistenceAdapter) {
      throw new Error('No persistence adapter provided');
    }
    
    try {
      await this.persistenceAdapter.saveNode({
        id: this.nodeId,
        nodeName: this._nodeName,
        parentId: this.nodeData?.parentId || 'ROOT'
      });
    } catch (error) {
      console.error('❌ Failed to save node:', error);
      throw error;
    }
  }

  private _handleNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._nodeName = input.value;
  }


  private async _handleSave() {
    if (this._nodeName.trim()) {
      try {
        if (this.persistenceAdapter) {
          await this._saveToStorage();
        }
        this.isUnderConstruction = false;
        this.isParent = true;
        this._dispatchStateChange('saved');
      } catch (error) {
        console.error('❌ Failed to save node:', error);
        this._dispatchStateChange('save-failed', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  private _handleCancel() {
    this._nodeName = '';
    this._dispatchStateChange('cancelled');
  }

  private _handleUpClick() {
    this._dispatchStateChange('navigate-up');
  }

  private _handleNodeClick() {
    if (!this.isUnderConstruction && !this.isParent) {
      this._dispatchStateChange('navigate-to');
    }
  }

  private _dispatchStateChange(action: string, error?: string) {
    const event = new CustomEvent('tree-node-action', {
      detail: { 
        action, 
        nodeId: this.nodeId,
        nodeName: this._nodeName,
        error
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  private _getNodeClasses() {
    const classes = ['tree-node'];
    if (this.isRoot) classes.push('is-root');
    if (this.isParent) classes.push('is-parent');
    if (this.isChild) classes.push('is-child');
    if (this.isUnderConstruction) classes.push('is-under-construction');
    return classes.join(' ');
  }

  private _renderConstructionMode() {
    return html`
      <div class="node-content">
        <input
          type="text"
          class="construction-input"
          placeholder="Enter asset name..."
          .value=${this._nodeName}
          @input=${this._handleNameInput}
        />
        <div class="construction-actions">
          <button class="action-button cancel" @click=${this._handleCancel}>
            Cancel
          </button>
          <button class="action-button" @click=${this._handleSave}>
            Save
          </button>
        </div>
      </div>
    `;
  }

  private _renderNormalMode() {
    if (this._isLoading) {
      return html`
        <div class="node-content">
          <div class="node-title">Loading...</div>
        </div>
      `;
    }

    const displayName = this._nodeName || 'New Asset';

    return html`
      ${this.isParent ? html`
        <button class="up-button" @click=${this._handleUpClick}>
          ↑
        </button>
      ` : ''}
      <div class="node-content" @click=${this._handleNodeClick}>
        <div class="node-title">${displayName}</div>
      </div>
    `;
  }

  render() {
    return html`
      <div class=${this._getNodeClasses()}>
        ${this.isUnderConstruction ? this._renderConstructionMode() : this._renderNormalMode()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tree-node': TreeNode;
  }
}