// <cagov-connector-lines left-selector=".widget-screenshot" right-selector=".widget-attribute-list li" color="#3F73A4"></cagov-connector-lines>
class CAGovConnectorLines extends HTMLElement {
  connectedCallback() {
    // is the attribute gettable here already?
    this.leftItemSelector = this.getAttribute("left-selector");
    this.rightItemSelector = this.getAttribute("right-selector");
    this.strokeColor = this.getAttribute('color');

    if(!this.leftItemSelector) {
      return;
    }
    this.leftItem = document.querySelector(this.leftItemSelector);

    window.addEventListener("resize", this.resetLines.bind(this));
    // this should run at the onload event, in the case of the ODI site the script is loaded with a delay so it usually runs at interactive but before onload, if onload had already fired want to use the minimal setTimeout delay puts this step outside of the immediate execution
    if(document.readyState === 'complete') {
      setTimeout(() => {
        this.drawConnector();
      }, 10)  
    } else {
      window.addEventListener("load", this.drawConnector.bind(this));
    }
  
  }

  drawConnector() {
    if(window.innerWidth > 720) {
      document
        .querySelectorAll(this.rightItemSelector)
        .forEach((rightItem, counter) => {
          document
            .querySelector('.drawing-area')
            .insertAdjacentHTML('afterbegin', `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <path id="cagov-line-connector${counter}" fill="none" stroke="${this.strokeColor}" stroke-width="2"/>
        </svg>`);
          let connector = document.querySelector(`#cagov-line-connector${counter}`);

          calculateCurvyLine(connector, this.leftItem, rightItem);
        })
    }
  };


  resetLines() {
    document.querySelectorAll('.drawing-area svg').forEach(el => {
      el.remove();
    });
    this.drawConnector();
  }

}
window.customElements.define("cagov-connector-lines", CAGovConnectorLines);

function calculateCurvyLine(connector, leftItem, rightItem) {
  var posnA = {
    x: leftItem.offsetLeft + leftItem.offsetWidth,
    y: leftItem.offsetTop + leftItem.offsetHeight / 2
  };
  var posnB = {
    x: rightItem.offsetLeft - 10,
    y: rightItem.offsetTop + rightItem.offsetHeight / 2
  };

  let dStr = "M" + (
    posnA.x) + "," + (
    posnA.y) + " " + "C" + (
    posnA.x + 100) + "," + (
    posnA.y) + " " + (
    posnB.x - 100) + "," + (
    posnB.y) + " " + (
    posnB.x) + "," + (
    posnB.y);
  connector.setAttribute("d", dStr);
}