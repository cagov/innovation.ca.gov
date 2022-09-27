// src/template.html
var template_default = '<section aria-label="benefits recommendations">\n  <h2 part="header2">Claim more benefits</h2>\n  <p class="tagline">You could qualify to get:</p>\n  <ul class="benefits">\n  </ul>\n</section>';

// src/css/index.css
var css_default = "/* these style rules are used inside the component shadow root so can reference generic elements without influencing the containing page */\nsection {\n  background: #F2F9F7;\n  border-left: 3px solid #077E62;\n  margin: 1rem 0 0 0;\n  padding: 0 2rem 2rem 2rem;\n  display: inline-block;\n  width: 100%;\n  box-sizing: border-box;\n}\n\nh2 {\n  color: #077E62;\n}\n\nul.benefits {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\nul.benefits li {\n  list-style: none;\n  background: #fff;\n  flex-grow: 1;\n  max-width: 100%;\n}\nul.benefits li a {\n  display: flex;\n  justify-content: space-between;\n  padding: 0.5rem;\n  text-decoration: none;\n  align-items: center;\n  color: #000;\n}\nul.benefits li a:hover {\n  background-color: #ccc;\n}\nul.benefits li .details {\n  display: flex;\n}\nul.benefits li .details .offer {\n  display: flex;\n  flex-flow: column;\n  margin-left: 1rem;\n}\nul.benefits li .details .linktext {\n  font-weight: bold;\n}\nul.benefits li .program {\n  font-weight: bold;\n  align-self: end;\n  text-align: right;\n}\n\n/*# sourceMappingURL=index.css.map */\n";

// src/index.js
var CaGovBenefitsRecs = class extends window.HTMLElement {
  constructor() {
    super(template_default, css_default);
    this.html = template_default;
    this.css = css_default;
    this.benefitsAPI = "http://localhost:3333/";
  }
  connectedCallback() {
    this.language = navigator.language;
    this.income = "";
    if (this.hasAttribute("language")) {
      this.language = this.getAttribute("language");
    }
    if (this.hasAttribute("income")) {
      this.income = this.getAttribute("income");
    }
    this.widgetEnvData = {};
    this.widgetEnvData.event = "render";
    this.widgetEnvData.displayURL = window.location.toString();
    this.widgetEnvData.userAgent = navigator.userAgent;
    this.widgetEnvData.language = this.language;
    this.widgetEnvData.income = this.income;
    fetch(`${this.benefitsAPI}benefits/`, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((data) => {
      let json = JSON.parse(data);
      let template = document.createElement("template");
      template.innerHTML = this.html;
      let style = document.createElement("style");
      template.content.prepend(style);
      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(template.content.cloneNode(true));
      this.shadowRoot.querySelector("style").append(this.css);
      this.shadowRoot.querySelector("h2").innerHTML = json.header;
      this.shadowRoot.querySelector("p.tagline").innerHTML = json.tagline;
      let listContainer = this.shadowRoot.querySelector("ul.benefits");
      json.links.forEach((link) => {
        listContainer.innerHTML += `
          <li>
            <a href="${link.url}">
              <span class="details">
                <span class="svg">${link.graphic}</span>
                <span class="offer">
                  <span class="linktext">${link.linktext}</span>
                  <span class="description">${link.description}</span>
                </span>
              </span>
              <span class="program">
                ${link.program} &nbsp; 
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.34999 11.147C0.64299 11.44 1.11799 11.44 1.40999 11.147L6.27399 6.28198C6.42099 6.13498 6.49499 5.94098 6.49299 5.74898C6.49299 5.55498 6.42099 5.36298 6.27399 5.21598L1.40999 0.350976C1.11699 0.0579756 0.64199 0.0579756 0.34999 0.350976C0.0579904 0.643976 0.0569904 1.11898 0.34999 1.41198L4.68699 5.74898L0.35099 10.086C0.0579898 10.379 0.0579898 10.854 0.35099 11.147H0.34999Z" fill="black"/>
                </svg>
              </span>
            </a>
          </li>
        `;
      });
      this.recordEvent("render");
      this.applyListeners();
    }).catch((error) => {
      console.error("Error:", error);
    });
  }
  recordEvent(event, linkClicked, linkClickedText) {
    this.widgetEnvData.event = event;
    if (event === "click") {
      this.widgetEnvData.link = linkClicked;
      this.widgetEnvData.linkText = linkClickedText;
    } else {
      delete this.widgetEnvData.link;
      delete this.widgetEnvData.linktext;
    }
    fetch(`${this.benefitsAPI}event/`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.widgetEnvData)
    }).then((response) => response.json()).then((data) => {
    });
  }
  applyListeners() {
    let benefitsLinks = this.shadowRoot.querySelectorAll("ul.benefits a");
    benefitsLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.recordEvent("click", event.target.closest("a").href, event.target.innerText.trim());
      });
    });
  }
};
window.customElements.define("cagov-benefits-recs", CaGovBenefitsRecs);
export {
  CaGovBenefitsRecs
};
