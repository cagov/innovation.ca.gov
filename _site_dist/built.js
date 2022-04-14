(()=>{function C(){let f=document.querySelector(".site-header .grid-mobile-icons");return f?getComputedStyle(f).display!=="none":!1}var q=class extends window.HTMLElement{connectedCallback(){document.querySelector(".cagov-nav.open-menu").addEventListener("click",this.toggleMainMenu.bind(this)),console.log("hi");let t=document.querySelector(".cagov-nav.mobile-search .search-btn");t&&(t.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),C()&&t.addEventListener("click",()=>{document.querySelector(".search-container--small").classList.toggle("hidden-search"),document.querySelector(".search-container--small").classList.contains("hidden-search")?(t.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true")):(t.setAttribute("aria-expanded","true"),document.querySelector(".search-container--small .site-search input").focus(),document.querySelector(".search-container--small .site-search input").removeAttribute("tabindex"),document.querySelector(".search-container--small .site-search button.search-submit").removeAttribute("tabindex"),document.querySelector(".search-container--small").setAttribute("aria-hidden","false"))})),window.addEventListener("resize",()=>{document.querySelector(".search-container--small").classList.add("hidden-search"),t&&document.querySelector(".cagov-nav.mobile-search .search-btn").setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),this.closeAllMenus(),this.closeMainMenu()}),this.expansionListeners(),document.addEventListener("keydown",this.escapeMainMenu.bind(this)),document.body.addEventListener("click",this.bodyClick.bind(this)),this.highlightCurrentPage()}toggleMainMenu(){document.querySelector(".cagov-nav.hamburger").classList.contains("is-active")?this.closeMainMenu():this.openMainMenu(),console.log("eh")}highlightCurrentPage(){this.querySelectorAll("a.expanded-menu-dropdown-link").forEach(t=>{t.href===window.location.href&&t.classList.add("current-page-highlight")})}openMainMenu(){console.log("oopen"),document.querySelector(".mobile-icons").classList.add("display-menu"),this.classList.add("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.add("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.add("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","true");let t=document.querySelector(".cagov-nav.menu-trigger-label");t.innerHTML=t.getAttribute("data-closelabel")}closeMainMenu(){document.querySelector(".mobile-icons").classList.remove("display-menu"),this.classList.remove("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.remove("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.remove("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","false");let t=document.querySelector(".cagov-nav.menu-trigger-label");t.innerHTML=t.getAttribute("data-openlabel")}escapeMainMenu(t){t.keyCode===27&&this.closeAllMenus()}bodyClick(t){t.target.closest("cagov-site-navigation")||this.closeAllMenus()}closeAllMenus(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(e=>{e.querySelector(".expanded-menu-section").classList.remove("expanded"),e.setAttribute("aria-expanded","false");let o=e.querySelector(".expanded-menu-dropdown");o&&(o.setAttribute("aria-hidden","true"),o.querySelectorAll("a").forEach(r=>{r.setAttribute("tabindex","-1")}))})}expansionListeners(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(e=>{let a=e.querySelector(".expanded-menu-section");if(a){let s=a.querySelector(".expanded-menu-dropdown");s&&(s.setAttribute("aria-hidden","true"),e.setAttribute("aria-expanded","false"))}let o=this;e.addEventListener("click",function(r){r.target.nodeName!=="A"&&r.preventDefault();let u=this.querySelector(".expanded-menu-section");if(u)if(u.classList.contains("expanded"))o.closeAllMenus();else{o.closeAllMenus(),u.classList.add("expanded"),e.setAttribute("aria-expanded","true");let m=this.querySelector(".expanded-menu-dropdown");m&&(m.setAttribute("aria-hidden","false"),m.querySelectorAll("a").forEach(b=>{b.removeAttribute("tabindex")}))}})})}};window.customElements.define("cagov-site-navigation",q);function j(f,t,e,a,o,s,r){return`
  <section aria-label="feedback">
  <div class="feedback-form cagov-stack">
    <div class="js-feedback-form feedback-form-question">
      <h2 class="feedback-form-label" id="feedback-rating">${f}</h2>
      <button class="feedback-form-button js-feedback-yes feedback-yes" id="feedback-yes">${t}</button>
      <button class="feedback-form-button js-feedback-no" id="feedback-no">${e}</button>
    </div>
          
    <div class="feedback-form-thanks js-feedback-thanks" role="alert">${o}</div>
          
    <div class="feedback-form-add">
      <label class="feedback-form-label js-feedback-field-label" for="add-feedback">${a}</label>
      <div class="feedback-form-add-grid">
        <textarea name="add-feedback" class="js-add-feedback feedback-form-textarea" id="add-feedback" rows="1"></textarea>
        <button class="feedback-form-button js-feedback-submit" type="submit" id="feedback-submit">${r}</button>
      </div>
    </div>

    <div class="feedback-form-thanks feedback-thanks-add" role="alert">${s}</div>
  </div>
  </section>`}var H=`cagov-page-feedback {
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
`,L=class extends window.HTMLElement{connectedCallback(){let t=this.dataset.question?this.dataset.question:"Did you find what you were looking for?",e=this.dataset.yes?this.dataset.yes:"Yes",a=this.dataset.no?this.dataset.no:"No",o=this.dataset.commentPrompt?this.dataset.commentPrompt:"What was the problem?";this.positiveCommentPrompt=this.dataset.positiveCommentPrompt?this.dataset.positiveCommentPrompt:"Great! What were you looking for today?";let s=this.dataset.thanksFeedback?this.dataset.thanksFeedback:"Thank you for your feedback!",r=this.dataset.thanksComments?this.dataset.thanksComments:"Thank you for your comments!",u=this.dataset.submit?this.dataset.submit:"Submit";this.dataset.characterLimit&&this.dataset.characterLimit,this.dataset.anythingToAdd&&this.dataset.anythingToAdd,this.dataset.anyOtherFeedback&&this.dataset.anyOtherFeedback,this.endpointUrl=this.dataset.endpointUrl;let m=j(t,e,a,o,s,r,u);this.innerHTML=m,this.applyListeners()}applyListeners(){this.wasHelpful="",this.querySelector(".js-add-feedback").addEventListener("focus",()=>{this.querySelector(".js-feedback-submit").style.display="block"});let t=this.querySelector(".js-add-feedback");t.addEventListener("keyup",()=>{t.value.length>15?t.setAttribute("rows","3"):t.setAttribute("rows","1")}),t.addEventListener("blur",()=>{t.value.length!==0&&(this.querySelector(".js-feedback-submit").style.display="block")}),this.querySelector(".js-feedback-yes").addEventListener("click",()=>{this.querySelector(".js-feedback-field-label").innerHTML=this.positiveCommentPrompt,this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="yes",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-no").addEventListener("click",()=>{this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="no",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-submit").addEventListener("click",()=>{this.querySelector(".feedback-form-add").style.display="none",this.querySelector(".feedback-thanks-add").style.display="block";let e={};e.url=window.location.href,e.helpful=this.wasHelpful,e.comments=t.value,e.userAgent=navigator.userAgent,fetch(this.endpointUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(a=>a.json()).then(a=>console.log(a))})}};window.customElements.define("cagov-page-feedback",L);var A=document.createElement("style");A.textContent=H;document.querySelector("head").appendChild(A);var O=`/* PAGE NAVIGATION */
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
`,k=class extends window.HTMLElement{connectedCallback(){this.type="wordpress",function(){function t(){let e=window,a=document;if(!("scrollBehavior"in a.documentElement.style&&e.__forceSmoothScrollPolyfill__!==!0)){let n,i=e.HTMLElement||e.Element;var o=468,s={scroll:e.scroll||e.scrollTo,scrollBy:e.scrollBy,elementScroll:i.prototype.scroll||m,scrollIntoView:i.prototype.scrollIntoView},r=e.performance&&e.performance.now?e.performance.now.bind(e.performance):Date.now,u=(n=e.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(n)?1:0);e.scroll=e.scrollTo=function(){arguments[0]!==void 0&&(p(arguments[0])!==!0?v.call(e,a.body,arguments[0].left!==void 0?~~arguments[0].left:e.scrollX||e.pageXOffset,arguments[0].top!==void 0?~~arguments[0].top:e.scrollY||e.pageYOffset):s.scroll.call(e,arguments[0].left!==void 0?arguments[0].left:typeof arguments[0]!="object"?arguments[0]:e.scrollX||e.pageXOffset,arguments[0].top!==void 0?arguments[0].top:arguments[1]!==void 0?arguments[1]:e.scrollY||e.pageYOffset))},e.scrollBy=function(){arguments[0]!==void 0&&(p(arguments[0])?s.scrollBy.call(e,arguments[0].left!==void 0?arguments[0].left:typeof arguments[0]!="object"?arguments[0]:0,arguments[0].top!==void 0?arguments[0].top:arguments[1]!==void 0?arguments[1]:0):v.call(e,a.body,~~arguments[0].left+(e.scrollX||e.pageXOffset),~~arguments[0].top+(e.scrollY||e.pageYOffset)))},i.prototype.scroll=i.prototype.scrollTo=function(){if(arguments[0]!==void 0)if(p(arguments[0])!==!0){let l=arguments[0].left,c=arguments[0].top;v.call(this,this,l===void 0?this.scrollLeft:~~l,c===void 0?this.scrollTop:~~c)}else{if(typeof arguments[0]=="number"&&arguments[1]===void 0)throw new SyntaxError("Value could not be converted");s.elementScroll.call(this,arguments[0].left!==void 0?~~arguments[0].left:typeof arguments[0]!="object"?~~arguments[0]:this.scrollLeft,arguments[0].top!==void 0?~~arguments[0].top:arguments[1]!==void 0?~~arguments[1]:this.scrollTop)}},i.prototype.scrollBy=function(){arguments[0]!==void 0&&(p(arguments[0])!==!0?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):s.elementScroll.call(this,arguments[0].left!==void 0?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,arguments[0].top!==void 0?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},i.prototype.scrollIntoView=function(){if(p(arguments[0])!==!0){let l=function(d){for(;d!==a.body&&(y=b(g=d,"Y")&&x(g,"Y"),S=b(g,"X")&&x(g,"X"),(y||S)===!1);)d=d.parentNode||d.host;let g,y,S;return d}(this),c=l.getBoundingClientRect(),h=this.getBoundingClientRect();l!==a.body?(v.call(this,l,l.scrollLeft+h.left-c.left,l.scrollTop+h.top-c.top),e.getComputedStyle(l).position!=="fixed"&&e.scrollBy({left:c.left,top:c.top,behavior:"smooth"})):e.scrollBy({left:h.left,top:h.top,behavior:"smooth"})}else s.scrollIntoView.call(this,arguments[0]===void 0||arguments[0])}}function m(n,i){this.scrollLeft=n,this.scrollTop=i}function p(n){if(n===null||typeof n!="object"||n.behavior===void 0||n.behavior==="auto"||n.behavior==="instant")return!0;if(typeof n=="object"&&n.behavior==="smooth")return!1;throw new TypeError(`behavior member of ScrollOptions ${n.behavior} is not a valid value for enumeration ScrollBehavior.`)}function b(n,i){return i==="Y"?n.clientHeight+u<n.scrollHeight:i==="X"?n.clientWidth+u<n.scrollWidth:void 0}function x(n,i){let l=e.getComputedStyle(n,null)[`overflow${i}`];return l==="auto"||l==="scroll"}function w(n){let i,l,c,h,d=(r()-n.startTime)/o;h=d=d>1?1:d,i=.5*(1-Math.cos(Math.PI*h)),l=n.startX+(n.x-n.startX)*i,c=n.startY+(n.y-n.startY)*i,n.method.call(n.scrollable,l,c),l===n.x&&c===n.y||e.requestAnimationFrame(w.bind(e,n))}function v(n,i,l){let c,h,d,g,y=r();n===a.body?(c=e,h=e.scrollX||e.pageXOffset,d=e.scrollY||e.pageYOffset,g=s.scroll):(c=n,h=n.scrollLeft,d=n.scrollTop,g=m),w({scrollable:c,method:g,startTime:y,startX:h,startY:d,x:i,y:l})}}typeof exports=="object"&&typeof module<"u"?module.exports={polyfill:t}:t()}(),this.type==="wordpress"&&document.addEventListener("DOMContentLoaded",()=>this.buildContentNavigation()),(document.readyState==="complete"||document.readyState==="loaded")&&this.buildContentNavigation()}buildContentNavigation(){let t=this.getHeaderTags(),e=null;t!==null&&(e=this.dataset.label||"On this page");let a=null;t!==null&&(a=`<nav aria-labelledby="page-navigation-label"> <div id="page-navigation-label" class="label">${e}</div> ${t}</nav>`),this.template({content:a},"wordpress")}template(t,e){return t!=null&&t.content!==null&&e==="wordpress"&&(this.innerHTML=`${t.content}`),document.querySelectorAll("a[data-page-navigation]").forEach(a=>{a.addEventListener("click",o=>{let s=decodeURI(a.getAttribute("href"));try{let r=document.querySelector(s);if(r!==null){let u=r.getBoundingClientRect();window.scrollTo({left:u.left,top:u.top-200}),window.history.pushState(null,null,s)}}catch(r){console.error(r)}o.preventDefault()})}),null}renderNoContent(){this.innerHTML=""}getHeaderTags(){let{selector:t}=this.dataset,e=["h2"];for(let a=0;a<e.length;a+=1)if(t!=null){let o=document.querySelector(t);if(o!==null)return k.outliner(o)}return null}static outliner(t){let e=t.querySelectorAll("h2"),a="";return e!=null&&e.length>0?(e.forEach(o=>{let s=o.getAttribute("id"),r=o.getAttribute("name"),u=o.innerHTML,m=null;s?m=s:r?m=r:m=o.innerHTML;let p=m.toLowerCase().trim().replace(/ /g,"-").replace(/\(|\)|!|"|#|\$|%|&|'|\*|\+|,|\.|\/|:|;|<|=|>|\?|@|\[|\]|\\|\^|`|\{|\||\|\}|~/g,"").replace(/a-zA-ZÃ€-Ã–Ã™-Ã¶Ã¹-Ã¿Ä€-Å¾á¸€-á»¿0-9\u00A0-\u017F/g,"");a+=`<li><a data-page-navigation href="#${encodeURI(p)}">${u}</a></li>`,o.setAttribute("id",p),o.setAttribute("name",p)}),`<ul>${a}</ul>`):null}};customElements.get("cagov-page-navigation")===void 0&&window.customElements.define("cagov-page-navigation",k);var T=document.createElement("style");T.textContent=O;document.querySelector("head").appendChild(T);function Y(){let f=document.querySelector(".branding .grid-mobile-icons");return f?getComputedStyle(f).display!=="none":!1}function $(f,t){f.parentNode.insertBefore(t,f.nextSibling)}var E=document.querySelector(".sidebar-container"),M=document.querySelector("h1");Y()&&E&&M&&$(M,E);})();
