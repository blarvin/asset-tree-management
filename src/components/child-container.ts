import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('child-container')
export class ChildContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-left: 15%;
      width: 85%;
      margin-bottom: 4px;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'child-container': ChildContainer;
  }
}