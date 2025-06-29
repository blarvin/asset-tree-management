import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './create-new-tree-node.js';

@customElement('root-view')
export class RootView extends LitElement {
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

  render() {
    return html`
      <div class="content">
        <slot></slot>
        <create-new-tree-node isRoot @create-node=${this._handleCreateNode}></create-new-tree-node>
      </div>
      <div class="root-label">root-component</div>
    `;
  }

  private _handleCreateNode(event: CustomEvent) {
    console.log('Create node event:', event.detail);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-view': RootView;
  }
}