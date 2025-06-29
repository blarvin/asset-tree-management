import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';

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

  @state()
  private _nodeName = '';

  @state()
  private _isEditing = false;

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

  connectedCallback() {
    super.connectedCallback();
    if (!this.nodeId) {
      this.nodeId = uuidv4();
    }
    this._loadFromStorage();
  }

  private _loadFromStorage() {
    const stored = localStorage.getItem(`tree-node-${this.nodeId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this._nodeName = data.nodeName || '';
      } catch (e) {
        console.warn('Failed to load node data from storage:', e);
      }
    }
  }

  private _saveToStorage() {
    const data = {
      nodeName: this._nodeName,
      nodeId: this.nodeId
    };
    localStorage.setItem(`tree-node-${this.nodeId}`, JSON.stringify(data));
  }

  private _handleNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._nodeName = input.value;
  }


  private _handleSave() {
    if (this._nodeName.trim()) {
      this._saveToStorage();
      this.isUnderConstruction = false;
      this.isParent = true;
      this._dispatchStateChange('saved');
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

  private _dispatchStateChange(action: string) {
    const event = new CustomEvent('tree-node-action', {
      detail: { 
        action, 
        nodeId: this.nodeId,
        nodeName: this._nodeName
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