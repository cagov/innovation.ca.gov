(()=>{function H(){let d=document.querySelector(".site-header .grid-mobile-icons");return d?getComputedStyle(d).display!=="none":!1}var L=class extends window.HTMLElement{connectedCallback(){document.querySelector(".cagov-nav.open-menu").addEventListener("click",this.toggleMainMenu.bind(this)),console.log("hi");let t=document.querySelector(".cagov-nav.mobile-search .search-btn");t&&(t.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),H()&&t.addEventListener("click",()=>{document.querySelector(".search-container--small").classList.toggle("hidden-search"),document.querySelector(".search-container--small").classList.contains("hidden-search")?(t.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true")):(t.setAttribute("aria-expanded","true"),document.querySelector(".search-container--small .site-search input").focus(),document.querySelector(".search-container--small .site-search input").removeAttribute("tabindex"),document.querySelector(".search-container--small .site-search button.search-submit").removeAttribute("tabindex"),document.querySelector(".search-container--small").setAttribute("aria-hidden","false"))})),window.addEventListener("resize",()=>{document.querySelector(".search-container--small").classList.add("hidden-search"),t&&document.querySelector(".cagov-nav.mobile-search .search-btn").setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),this.closeAllMenus(),this.closeMainMenu()}),this.expansionListeners(),document.addEventListener("keydown",this.escapeMainMenu.bind(this)),document.body.addEventListener("click",this.bodyClick.bind(this)),this.highlightCurrentPage()}toggleMainMenu(){document.querySelector(".cagov-nav.hamburger").classList.contains("is-active")?this.closeMainMenu():this.openMainMenu(),console.log("eh")}highlightCurrentPage(){this.querySelectorAll("a.expanded-menu-dropdown-link").forEach(t=>{t.href===window.location.href&&t.classList.add("current-page-highlight")})}openMainMenu(){console.log("oopen"),document.querySelector(".mobile-icons").classList.add("display-menu"),this.classList.add("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.add("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.add("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","true");let t=document.querySelector(".cagov-nav.menu-trigger-label");t.innerHTML=t.getAttribute("data-closelabel")}closeMainMenu(){document.querySelector(".mobile-icons").classList.remove("display-menu"),this.classList.remove("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.remove("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.remove("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","false");let t=document.querySelector(".cagov-nav.menu-trigger-label");t.innerHTML=t.getAttribute("data-openlabel")}escapeMainMenu(t){t.keyCode===27&&this.closeAllMenus()}bodyClick(t){t.target.closest("cagov-site-navigation")||this.closeAllMenus()}closeAllMenus(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(e=>{e.querySelector(".expanded-menu-section").classList.remove("expanded"),e.setAttribute("aria-expanded","false");let s=e.querySelector(".expanded-menu-dropdown");s&&(s.setAttribute("aria-hidden","true"),s.querySelectorAll("a").forEach(o=>{o.setAttribute("tabindex","-1")}))})}expansionListeners(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(e=>{let n=e.querySelector(".expanded-menu-section");if(n){let i=n.querySelector(".expanded-menu-dropdown");i&&(i.setAttribute("aria-hidden","true"),e.setAttribute("aria-expanded","false"))}let s=this;e.addEventListener("click",function(o){o.target.nodeName!=="A"&&o.preventDefault();let h=this.querySelector(".expanded-menu-section");if(h)if(h.classList.contains("expanded"))s.closeAllMenus();else{s.closeAllMenus(),h.classList.add("expanded"),e.setAttribute("aria-expanded","true");let m=this.querySelector(".expanded-menu-dropdown");m&&(m.setAttribute("aria-hidden","false"),m.querySelectorAll("a").forEach(p=>{p.removeAttribute("tabindex")}))}})})}};window.customElements.define("cagov-site-navigation",L);function O(d,t,e,n,s,i,o){return`
  <section aria-label="feedback">
  <div class="feedback-form cagov-stack">
    <div class="js-feedback-form feedback-form-question">
      <h2 class="feedback-form-label" id="feedback-rating">${d}</h2>
      <button class="feedback-form-button js-feedback-yes feedback-yes" id="feedback-yes">${t}</button>
      <button class="feedback-form-button js-feedback-no" id="feedback-no">${e}</button>
    </div>
          
    <div class="feedback-form-thanks js-feedback-thanks" role="alert">${s}</div>
          
    <div class="feedback-form-add">
      <label class="feedback-form-label js-feedback-field-label" for="add-feedback">${n}</label>
      <div class="feedback-form-add-grid">
        <textarea name="add-feedback" class="js-add-feedback feedback-form-textarea" id="add-feedback" rows="1"></textarea>
        <button class="feedback-form-button js-feedback-submit" type="submit" id="feedback-submit">${o}</button>
      </div>
    </div>

    <div class="feedback-form-thanks feedback-thanks-add" role="alert">${i}</div>
  </div>
  </section>`}var P=`cagov-page-feedback {
  width: 100%;
}
cagov-page-feedback .feedback-form {
  background: var(--primary-dark-color, #003484);
  padding: 1rem;
  border-radius: 0.3125rem;
  max-width: var(--w-lg, 1176px);
  margin: 0 auto;
}
cagov-page-feedback .feedback-form-question {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
cagov-page-feedback .feedback-form-label {
  color: #fff;
  background-color: var(--primary-dark-color, #003484);
  font-size: 1.125rem;
  display: block;
  margin-right: 1rem;
  transition: 0.3s color cubic-bezier(0.57, 0.2, 0.21, 0.89);
  line-height: 3rem;
  width: auto;
}
@media (max-width: 768px) {
  cagov-page-feedback .feedback-form-label {
    line-height: unset;
    margin-bottom: 1rem;
  }
}
cagov-page-feedback .feedback-form-button {
  padding: 1rem;
  color: var(--primary-dark-color, #003484);
  border: none;
  border-radius: 0.3rem;
  transition: 0.3s background cubic-bezier(0.57, 0.2, 0.21, 0.89);
  cursor: pointer;
  margin: 0 0.5rem 0 0;
  display: inline !important;
  /* defensive overrides */
  position: relative;
  text-transform: none;
  top: auto;
  right: auto;
  background: #fff;
}
cagov-page-feedback .feedback-form-button:hover {
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.2);
  text-decoration: underline;
}
cagov-page-feedback .feedback-form-button:focus {
  box-shadow: 0 0 0 2px #fff;
}
cagov-page-feedback .feedback-form-button .feedback-yes {
  margin-right: 1rem;
}
cagov-page-feedback .feedback-form-add {
  padding-top: 0;
  display: none;
}
@media (max-width: 768px) {
  cagov-page-feedback .feedback-form-add {
    text-align: left;
    padding-top: 0;
  }
}
cagov-page-feedback .feedback-form-add-grid {
  position: relative;
  margin-top: 1rem;
  display: inline-flex;
  flex-flow: column;
  align-items: flex-start;
}
@media (max-width: 768px) {
  cagov-page-feedback .feedback-form-add-grid {
    display: block;
  }
}
cagov-page-feedback .feedback-form-textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: "Roboto", sans-serif;
  color: var(--primary-dark-color, #003484);
  max-width: 90%;
  height: 127px;
  width: 600px;
}
cagov-page-feedback .feedback-form-thanks {
  display: none;
  color: #fff;
}
cagov-page-feedback .feedback-form-error {
  position: relative;
  top: 100%;
  left: 0;
  display: none;
  font-weight: 300;
  text-align: left;
}

/*# sourceMappingURL=index.css.map */
`,A=class extends window.HTMLElement{connectedCallback(){let t=this.dataset.question?this.dataset.question:"Did you find what you were looking for?",e=this.dataset.yes?this.dataset.yes:"Yes",n=this.dataset.no?this.dataset.no:"No",s=this.dataset.commentPrompt?this.dataset.commentPrompt:"What was the problem?";this.positiveCommentPrompt=this.dataset.positiveCommentPrompt?this.dataset.positiveCommentPrompt:"Great! What were you looking for today?";let i=this.dataset.thanksFeedback?this.dataset.thanksFeedback:"Thank you for your feedback!",o=this.dataset.thanksComments?this.dataset.thanksComments:"Thank you for your comments!",h=this.dataset.submit?this.dataset.submit:"Submit";this.dataset.characterLimit&&this.dataset.characterLimit,this.dataset.anythingToAdd&&this.dataset.anythingToAdd,this.dataset.anyOtherFeedback&&this.dataset.anyOtherFeedback,this.endpointUrl=this.dataset.endpointUrl;let m=O(t,e,n,s,i,o,h);this.innerHTML=m,this.applyListeners()}applyListeners(){this.wasHelpful="",this.querySelector(".js-add-feedback").addEventListener("focus",()=>{this.querySelector(".js-feedback-submit").style.display="block"});let t=this.querySelector(".js-add-feedback");t.addEventListener("keyup",()=>{t.value.length>15?t.setAttribute("rows","3"):t.setAttribute("rows","1")}),t.addEventListener("blur",()=>{t.value.length!==0&&(this.querySelector(".js-feedback-submit").style.display="block")}),this.querySelector(".js-feedback-yes").addEventListener("click",()=>{this.querySelector(".js-feedback-field-label").innerHTML=this.positiveCommentPrompt,this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="yes",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-no").addEventListener("click",()=>{this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="no",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-submit").addEventListener("click",()=>{this.querySelector(".feedback-form-add").style.display="none",this.querySelector(".feedback-thanks-add").style.display="block";let e={};e.url=window.location.href,e.helpful=this.wasHelpful,e.comments=t.value,e.userAgent=navigator.userAgent,fetch(this.endpointUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(n=>n.json()).then(n=>console.log(n))})}};window.customElements.define("cagov-page-feedback",A);var q=document.createElement("style");q.textContent=P;document.querySelector("head").appendChild(q);var B=`/* PAGE NAVIGATION */
sidebar cagov-page-navigation .label {
  font-weight: 700;
  font-size: 24px;
  line-height: 28.2px;
  padding: 0;
  margin: 0;
  padding-bottom: 16px;
}

sidebar cagov-page-navigation ul,
sidebar cagov-page-navigation ol:not([class*=menu]):not([class*=nav]):not([class*=footer-links]),
sidebar cagov-page-navigation ul:not([class*=menu]):not([class*=nav]):not([class*=footer-links]) {
  margin: 0;
  text-indent: 0;
  padding: 0;
}

sidebar cagov-page-navigation ul li {
  padding-top: 14px;
  padding-bottom: 18px;
  margin-left: 0;
  margin-top: 0px;
  margin-bottom: 0px;
  border-bottom: 1px solid var(--gray-300, #e1e0e3);
  line-height: 28.2px;
  list-style: none;
}
sidebar cagov-page-navigation ul li:first-child {
  border-top: 1px solid var(--gray-300, #e1e0e3);
}
sidebar cagov-page-navigation ul li a {
  text-decoration: none;
}
sidebar cagov-page-navigation ul li a:hover {
  text-decoration: underline;
}

@media only screen and (max-width: 992px) {
  cagov-page-navigation .label {
    display: none;
  }

  .sidebar-container {
    display: block;
    width: 100%;
    max-width: 100%;
  }

  cagov-page-navigation ul li a {
    font-size: 16px;
    line-height: 24px;
  }
}

/*# sourceMappingURL=index.css.map */
`,k=class extends window.HTMLElement{connectedCallback(){this.type="wordpress",function(){function t(){let e=window,n=document;if(!("scrollBehavior"in n.documentElement.style&&e.__forceSmoothScrollPolyfill__!==!0)){let a,r=e.HTMLElement||e.Element;var s=468,i={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,elementScroll:r.prototype.scroll||m,scrollIntoView:r.prototype.scrollIntoView},o=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now,h=(a=e.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(a)?1:0);e.scroll=e.scrollTo=function(){arguments[0]!==void 0&&(b(arguments[0])!==!0?v.call(e,n.body,arguments[0].left!==void 0?~~arguments[0].left:e.scrollX||e.pageXOffset,arguments[0].top!==void 0?~~arguments[0].top:e.scrollY||e.pageYOffset):i.scroll.call(e,arguments[0].left!==void 0?arguments[0].left:typeof arguments[0]!="object"?arguments[0]:e.scrollX||e.pageXOffset,arguments[0].top!==void 0?arguments[0].top:arguments[1]!==void 0?arguments[1]:e.scrollY||e.pageYOffset))},e.scrollBy=function(){arguments[0]!==void 0&&(b(arguments[0])?i.scrollBy.call(e,arguments[0].left!==void 0?arguments[0].left:typeof arguments[0]!="object"?arguments[0]:0,arguments[0].top!==void 0?arguments[0].top:arguments[1]!==void 0?arguments[1]:0):v.call(e,n.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset)))},r.prototype.scroll=r.prototype.scrollTo=function(){if(arguments[0]!==void 0)if(b(arguments[0])!==!0){let l=arguments[0].left,c=arguments[0].top;v.call(this,this,l===void 0?this.scrollLeft:~~l,c===void 0?this.scrollTop:~~c)}else{if(typeof arguments[0]=="number"&&arguments[1]===void 0)throw new SyntaxError("Value could not be converted");i.elementScroll.call(this,arguments[0].left!==void 0?~~arguments[0].left:typeof arguments[0]!="object"?~~arguments[0]:this.scrollLeft,arguments[0].top!==void 0?~~arguments[0].top:arguments[1]!==void 0?~~arguments[1]:this.scrollTop)}},r.prototype.scrollBy=function(){arguments[0]!==void 0&&(b(arguments[0])!==!0?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):i.elementScroll.call(this,arguments[0].left!==void 0?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,arguments[0].top!==void 0?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},r.prototype.scrollIntoView=function(){if(b(arguments[0])!==!0){let l=function(u){for(;u!==n.body&&(y=p(g=u,"Y")&&x(g,"Y"),S=p(g,"X")&&x(g,"X"),(y||S)===!1);)u=u.parentNode||u.host;let g,y,S;return u}(this),c=l.getBoundingClientRect(),f=this.getBoundingClientRect();l!==n.body?(v.call(this,l,l.scrollLeft+f.left-c.left,l.scrollTop+f.top-c.top),e.getComputedStyle(l).position!=="fixed"&&e.scrollBy({left:c.left,top:c.top,behavior:"smooth"})):e.scrollBy({left:f.left,top:f.top,behavior:"smooth"})}else i.scrollIntoView.call(this,arguments[0]===void 0||arguments[0])}}function m(a,r){this.scrollLeft=a,this.scrollTop=r}function b(a){if(a===null||typeof a!="object"||a.behavior===void 0||a.behavior==="auto"||a.behavior==="instant")return!0;if(typeof a=="object"&&a.behavior==="smooth")return!1;throw new TypeError(`behavior member of ScrollOptions ${a.behavior} is not a valid value for enumeration ScrollBehavior.`)}function p(a,r){return r==="Y"?a.clientHeight+h<a.scrollHeight:r==="X"?a.clientWidth+h<a.scrollWidth:void 0}function x(a,r){let l=e.getComputedStyle(a,null)[`overflow${r}`];return l==="auto"||l==="scroll"}function w(a){let r,l,c,f,u=(o()-a.startTime)/s;f=u=u>1?1:u,r=.5*(1-Math.cos(Math.PI*f)),l=a.startX+(a.x-a.startX)*r,c=a.startY+(a.y-a.startY)*r,a.method.call(a.scrollable,l,c),l===a.x&&c===a.y||e.requestAnimationFrame(w.bind(e,a))}function v(a,r,l){let c,f,u,g,y=o();a===n.body?(c=e,f=e.scrollX||e.pageXOffset,u=e.scrollY||e.pageYOffset,g=i.scroll):(c=a,f=a.scrollLeft,u=a.scrollTop,g=m),w({scrollable:c,method:g,startTime:y,startX:f,startY:u,x:r,y:l})}}typeof exports=="object"&&typeof module<"u"?module.exports={polyfill:t}:t()}(),this.type==="wordpress"&&document.addEventListener("DOMContentLoaded",()=>this.buildContentNavigation()),(document.readyState==="complete"||document.readyState==="loaded")&&this.buildContentNavigation()}buildContentNavigation(){let t=this.getHeaderTags(),e=null;t!==null&&(e=this.dataset.label||"On this page");let n=null;t!==null&&(n=`<nav aria-labelledby="page-navigation-label"> <div id="page-navigation-label" class="label">${e}</div> ${t}</nav>`),this.template({content:n},"wordpress")}template(t,e){return t!=null&&t.content!==null&&e==="wordpress"&&(this.innerHTML=`${t.content}`),document.querySelectorAll("a[data-page-navigation]").forEach(n=>{n.addEventListener("click",s=>{let i=decodeURI(n.getAttribute("href"));try{let o=document.querySelector(i);if(o!==null){let h=o.getBoundingClientRect();window.scrollTo({left:h.left,top:h.top-200}),window.history.pushState(null,null,i)}}catch(o){console.error(o)}s.preventDefault()})}),null}renderNoContent(){this.innerHTML=""}getHeaderTags(){let{selector:t}=this.dataset,e=["h2"];for(let n=0;n<e.length;n+=1)if(t!=null){let s=document.querySelector(t);if(s!==null)return k.outliner(s)}return null}static outliner(t){let e=t.querySelectorAll("h2"),n="";return e!=null&&e.length>0?(e.forEach(s=>{let i=s.getAttribute("id"),o=s.getAttribute("name"),h=s.innerHTML,m=null;i?m=i:o?m=o:m=s.innerHTML;let b=m.toLowerCase().trim().replace(/ /g,"-").replace(/\(|\)|!|"|#|\$|%|&|'|\*|\+|,|\.|\/|:|;|<|=|>|\?|@|\[|\]|\\|\^|`|\{|\||\|\}|~/g,"").replace(/a-zA-ZÃ€-Ã–Ã™-Ã¶Ã¹-Ã¿Ä€-Å¾á¸€-á»¿0-9\u00A0-\u017F/g,"");n+=`<li><a data-page-navigation href="#${encodeURI(b)}">${h}</a></li>`,s.setAttribute("id",b),s.setAttribute("name",b)}),`<ul>${n}</ul>`):null}};customElements.get("cagov-page-navigation")===void 0&&window.customElements.define("cagov-page-navigation",k);var M=document.createElement("style");M.textContent=B;document.querySelector("head").appendChild(M);function D(){let d=document.querySelector(".branding .grid-mobile-icons");return d?getComputedStyle(d).display!=="none":!1}function I(d,t){d.parentNode.insertBefore(t,d.nextSibling)}var E=document.querySelector(".sidebar-container"),T=document.querySelector("h1");D()&&E&&T&&I(T,E);var C=class extends HTMLElement{constructor(){super();this.tablist=this.querySelector('[role="tablist"]'),this.buttons=this.querySelectorAll('[role="tab"]'),this.panels=this.querySelectorAll('[role="tabpanel"]'),this.delay=this.determineDelay(),!(!this.tablist||!this.buttons.length||!this.panels.length)&&(this.initButtons(),this.initPanels())}get keys(){return{end:35,home:36,left:37,up:38,right:39,down:40}}get direction(){return{37:-1,38:-1,39:1,40:1}}initButtons(){let t=0;for(let e of this.buttons){let n=e.getAttribute("aria-selected")==="true";e.setAttribute("tabindex",n?"0":"-1"),e.addEventListener("click",this.clickEventListener.bind(this)),e.addEventListener("keydown",this.keydownEventListener.bind(this)),e.addEventListener("keyup",this.keyupEventListener.bind(this)),e.index=t++}}initPanels(){let t=this.querySelector('[role="tab"][aria-selected="true"]').getAttribute("aria-controls");for(let e of this.panels)e.getAttribute("id")!==t&&e.setAttribute("hidden",""),e.setAttribute("tabindex","0")}clickEventListener(t){let e=t.target;(e.tagName==="A"||e.tagName==="BUTTON"&&e.getAttribute("type")==="submit")&&t.preventDefault(),this.activateTab(e,!1)}keydownEventListener(t){var e=t.keyCode;switch(e){case this.keys.end:t.preventDefault(),this.activateTab(this.buttons[this.buttons.length-1]);break;case this.keys.home:t.preventDefault(),this.activateTab(this.buttons[0]);break;case this.keys.up:case this.keys.down:this.determineOrientation(t);break}}keyupEventListener(t){var e=t.keyCode;switch(e){case this.keys.left:case this.keys.right:this.determineOrientation(t);break}}determineOrientation(t){var e=t.keyCode,n=this.tablist.getAttribute("aria-orientation")=="vertical",s=!1;n?(e===this.keys.up||e===this.keys.down)&&(t.preventDefault(),s=!0):(e===this.keys.left||e===this.keys.right)&&(s=!0),s&&this.switchTabOnArrowPress(t)}switchTabOnArrowPress(t){var e=t.keyCode;for(let s of this.buttons)s.addEventListener("focus",this.focusEventHandler.bind(this));if(this.direction[e]){var n=t.target;n.index!==void 0&&(this.buttons[n.index+this.direction[e]]?this.buttons[n.index+this.direction[e]].focus():e===this.keys.left||e===this.keys.up?this.focusLastTab():(e===this.keys.right||e==this.keys.down)&&this.focusFirstTab())}}activateTab(t,e){t.getAttribute("role")!=="tab"&&(t=t.closest('[role="tab"]')),e=e||!0,this.deactivateTabs(),t.removeAttribute("tabindex"),t.setAttribute("aria-selected","true");var n=t.getAttribute("aria-controls");document.getElementById(n).removeAttribute("hidden"),e&&t.focus()}deactivateTabs(){for(let t of this.buttons)t.setAttribute("tabindex","-1"),t.setAttribute("aria-selected","false"),t.removeEventListener("focus",this.focusEventHandler.bind(this));for(let t of this.panels)t.setAttribute("hidden","hidden")}focusFirstTab(){this.buttons[0].focus()}focusLastTab(){this.buttons[this.buttons.length-1].focus()}determineDelay(){var t=this.tablist.hasAttribute("data-delay"),e=0;if(t){var n=this.tablist.getAttribute("data-delay");n?e=n:e=300}return e}focusEventHandler(t){var e=t.target;setTimeout(this.checkTabFocus.bind(this),this.delay,e)}checkTabFocus(t){let e=document.activeElement;t===e&&this.activateTab(t,!1)}};window.customElements.define("seven-minute-tabs",C);function j(){if(document.querySelector("seven-minute-tabs")&&(document.querySelectorAll('seven-minute-tabs a[role="tab"]').forEach(e=>{e.addEventListener("click",function(){history.replaceState({tab:this.id},"","?activeTab="+this.id)})}),window.location.search.indexOf("activeTab")>-1)){let n=new URLSearchParams(window.location.search).get("activeTab");n&&document.getElementById(n)&&(document.getElementById(n).click(),document.getElementById(n).blur())}}window.addEventListener("load",j);})();
