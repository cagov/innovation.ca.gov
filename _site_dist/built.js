(()=>{function b(){let i=document.querySelector(".site-header .grid-mobile-icons");return i?getComputedStyle(i).display!=="none":!1}var d=class extends window.HTMLElement{connectedCallback(){document.querySelector(".cagov-nav.open-menu").addEventListener("click",this.toggleMainMenu.bind(this)),console.log("hi");let e=document.querySelector(".cagov-nav.mobile-search .search-btn");e&&(e.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),b()&&e.addEventListener("click",()=>{document.querySelector(".search-container--small").classList.toggle("hidden-search"),document.querySelector(".search-container--small").classList.contains("hidden-search")?(e.setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true")):(e.setAttribute("aria-expanded","true"),document.querySelector(".search-container--small .site-search input").focus(),document.querySelector(".search-container--small .site-search input").removeAttribute("tabindex"),document.querySelector(".search-container--small .site-search button.search-submit").removeAttribute("tabindex"),document.querySelector(".search-container--small").setAttribute("aria-hidden","false"))})),window.addEventListener("resize",()=>{document.querySelector(".search-container--small").classList.add("hidden-search"),e&&document.querySelector(".cagov-nav.mobile-search .search-btn").setAttribute("aria-expanded","false"),document.querySelector(".search-container--small .site-search input").setAttribute("tabindex","-1"),document.querySelector(".search-container--small .site-search button.search-submit").setAttribute("tabindex","-1"),document.querySelector(".search-container--small").setAttribute("aria-hidden","true"),this.closeAllMenus(),this.closeMainMenu()}),this.expansionListeners(),document.addEventListener("keydown",this.escapeMainMenu.bind(this)),document.body.addEventListener("click",this.bodyClick.bind(this)),this.highlightCurrentPage()}toggleMainMenu(){document.querySelector(".cagov-nav.hamburger").classList.contains("is-active")?this.closeMainMenu():this.openMainMenu(),console.log("eh")}highlightCurrentPage(){this.querySelectorAll("a.expanded-menu-dropdown-link").forEach(e=>{e.href===window.location.href&&e.classList.add("current-page-highlight")})}openMainMenu(){console.log("oopen"),document.querySelector(".mobile-icons").classList.add("display-menu"),this.classList.add("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.add("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.add("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","true");let e=document.querySelector(".cagov-nav.menu-trigger-label");e.innerHTML=e.getAttribute("data-closelabel")}closeMainMenu(){document.querySelector(".mobile-icons").classList.remove("display-menu"),this.classList.remove("display-menu"),document.querySelector(".cagov-nav.hamburger").classList.remove("is-active"),document.querySelector(".cagov-nav.menu-trigger").classList.remove("is-fixed"),document.querySelector(".cagov-nav.menu-trigger").setAttribute("aria-expanded","false");let e=document.querySelector(".cagov-nav.menu-trigger-label");e.innerHTML=e.getAttribute("data-openlabel")}escapeMainMenu(e){e.keyCode===27&&this.closeAllMenus()}bodyClick(e){e.target.closest("cagov-site-navigation")||this.closeAllMenus()}closeAllMenus(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(t=>{t.querySelector(".expanded-menu-section").classList.remove("expanded"),t.setAttribute("aria-expanded","false");let n=t.querySelector(".expanded-menu-dropdown");n&&(n.setAttribute("aria-hidden","true"),n.querySelectorAll("a").forEach(o=>{o.setAttribute("tabindex","-1")}))})}expansionListeners(){this.querySelectorAll(".js-cagov-navoverlay-expandable").forEach(t=>{let a=t.querySelector(".expanded-menu-section");if(a){let s=a.querySelector(".expanded-menu-dropdown");s&&(s.setAttribute("aria-hidden","true"),t.setAttribute("aria-expanded","false"))}let n=this;t.addEventListener("click",function(o){o.target.nodeName!=="A"&&o.preventDefault();let r=this.querySelector(".expanded-menu-section");if(r)if(r.classList.contains("expanded"))n.closeAllMenus();else{n.closeAllMenus(),r.classList.add("expanded"),t.setAttribute("aria-expanded","true");let c=this.querySelector(".expanded-menu-dropdown");c&&(c.setAttribute("aria-hidden","false"),c.querySelectorAll("a").forEach(m=>{m.removeAttribute("tabindex")}))}})})}};window.customElements.define("cagov-site-navigation",d);function h(i,e,t,a,n,s,o){return`
  <section aria-label="feedback">
  <div class="feedback-form cagov-stack">
    <div class="js-feedback-form feedback-form-question">
      <h2 class="feedback-form-label" id="feedback-rating">${i}</h2>
      <button class="feedback-form-button js-feedback-yes feedback-yes" id="feedback-yes">${e}</button>
      <button class="feedback-form-button js-feedback-no" id="feedback-no">${t}</button>
    </div>
          
    <div class="feedback-form-thanks js-feedback-thanks" role="alert">${n}</div>
          
    <div class="feedback-form-add">
      <label class="feedback-form-label js-feedback-field-label" for="add-feedback">${a}</label>
      <div class="feedback-form-add-grid">
        <textarea name="add-feedback" class="js-add-feedback feedback-form-textarea" id="add-feedback" rows="1"></textarea>
        <button class="feedback-form-button js-feedback-submit" type="submit" id="feedback-submit">${o}</button>
      </div>
    </div>

    <div class="feedback-form-thanks feedback-thanks-add" role="alert">${s}</div>
  </div>
  </section>`}var f=`cagov-page-feedback {
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
`,l=class extends window.HTMLElement{connectedCallback(){let e=this.dataset.question?this.dataset.question:"Did you find what you were looking for?",t=this.dataset.yes?this.dataset.yes:"Yes",a=this.dataset.no?this.dataset.no:"No",n=this.dataset.commentPrompt?this.dataset.commentPrompt:"What was the problem?";this.positiveCommentPrompt=this.dataset.positiveCommentPrompt?this.dataset.positiveCommentPrompt:"Great! What were you looking for today?";let s=this.dataset.thanksFeedback?this.dataset.thanksFeedback:"Thank you for your feedback!",o=this.dataset.thanksComments?this.dataset.thanksComments:"Thank you for your comments!",r=this.dataset.submit?this.dataset.submit:"Submit";this.dataset.characterLimit&&this.dataset.characterLimit,this.dataset.anythingToAdd&&this.dataset.anythingToAdd,this.dataset.anyOtherFeedback&&this.dataset.anyOtherFeedback,this.endpointUrl=this.dataset.endpointUrl;let c=h(e,t,a,n,s,o,r);this.innerHTML=c,this.applyListeners()}applyListeners(){this.wasHelpful="",this.querySelector(".js-add-feedback").addEventListener("focus",()=>{this.querySelector(".js-feedback-submit").style.display="block"});let e=this.querySelector(".js-add-feedback");e.addEventListener("keyup",()=>{e.value.length>15?e.setAttribute("rows","3"):e.setAttribute("rows","1")}),e.addEventListener("blur",()=>{e.value.length!==0&&(this.querySelector(".js-feedback-submit").style.display="block")}),this.querySelector(".js-feedback-yes").addEventListener("click",()=>{this.querySelector(".js-feedback-field-label").innerHTML=this.positiveCommentPrompt,this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="yes",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-no").addEventListener("click",()=>{this.querySelector(".js-feedback-form").style.display="none",this.querySelector(".feedback-form-add").style.display="block",this.wasHelpful="no",this.dispatchEvent(new CustomEvent("ratedPage",{detail:this.wasHelpful}))}),this.querySelector(".js-feedback-submit").addEventListener("click",()=>{this.querySelector(".feedback-form-add").style.display="none",this.querySelector(".feedback-thanks-add").style.display="block";let t={};t.url=window.location.href,t.helpful=this.wasHelpful,t.comments=e.value,t.userAgent=navigator.userAgent,fetch(this.endpointUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(a=>a.json()).then(a=>console.log(a))})}};window.customElements.define("cagov-page-feedback",l);var u=document.createElement("style");u.textContent=f;document.querySelector("head").appendChild(u);})();
