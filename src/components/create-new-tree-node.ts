import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('create-new-tree-node')
export class CreateNewTreeNode extends LitElement {
  @property({ type: Boolean })
  isRoot = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    button.create-button {
      width: 100%;
      border: none;
      padding: 6px;
      border-radius: 4px;
      background: rgb(30, 87, 134);
      cursor: pointer;
      font-family: inherit;
      font-size: 16px;
      color: rgb(242, 129, 129);
      min-height: 20px;
      box-sizing: border-box;
      outline: none;
      box-shadow: none;
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