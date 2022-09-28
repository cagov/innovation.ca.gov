import '@cagov/ds-site-navigation';
import '@cagov/ds-page-feedback';
import '@cagov/ds-page-navigation';
import './ga-tracking.js';

// import '@zachleat/seven-minute-tabs';
// import { augmentSevenMinuteTabs } from './seven-minute-tabs-augment.js';
// window.addEventListener('load',augmentSevenMinuteTabs);

// this is only used on the test thank-you-for-applying page
export class CaGovDateTime extends window.HTMLElement {
  connectedCallback() {
    let today = new Date();
    this.innerHTML = `${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;
  }
}
window.customElements.define('cagov-date-time', CaGovDateTime);
