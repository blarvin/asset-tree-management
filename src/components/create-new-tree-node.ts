import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('create-new-tree-node')
export class CreateNewTreeNode extends LitElement {
  @property({ type: Boolean })
  isRoot = false;

  static styles = css`
    :host {
      display: block;
      width: 99%;
      margin: 4px auto;
    }

    .create-button {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #f9f9f9;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      color: #666;
      text-align: left;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      min-height: 44px;
      box-sizing: border-box;
    }

    .create-button:hover {
      background: #f0f0f0;
      border-color: #ccc;
      color: #333;
    }

    .create-button:active {
      background: #e8e8e8;
      transform: translateY(1px);
    }

    .create-button:focus {
      outline: 2px solid #007acc;
      outline-offset: 2px;
    }

    .plus-icon {
      margin-right: 8px;
      font-weight: bold;
      color: #007acc;
    }
  `;

  private _handleClick() {
    const event = new CustomEvent('create-node', {
      detail: { isRoot: this.isRoot },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    const label = this.isRoot ? 'Create New Asset' : 'Create New Sub-Asset Here';
    
    return html`
      <button class="create-button" @click=${this._handleClick}>
        <span class="plus-icon">+</span>
        ${label}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-new-tree-node': CreateNewTreeNode;
  }
}