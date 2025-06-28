import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('root-view')
export class RootView extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      min-height: 100vh;
      border: 2px solid blue;
      padding: 16px;
      box-sizing: border-box;
    }

    .root-label {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 12px;
      color: blue;
      font-family: monospace;
      background: rgba(255, 255, 255, 0.8);
      padding: 2px 4px;
      border-radius: 2px;
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
      </div>
      <div class="root-label">root-component</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-view': RootView;
  }
}