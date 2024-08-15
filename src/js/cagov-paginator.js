import '@cagov/ds-pagination';

// cagov-paginator
class CAGovPaginator extends HTMLElement {
    connectedCallback() {
        // initial set up -- pull data and determine # of pages
        //
        this.pagedContainerSelector = this.getAttribute('data-paged-container');
        this.pagedBlockSelector = this.getAttribute('data-paged-block');
        this.perPage = parseInt(this.getAttribute('data-per-page'));
        console.log("pagedContainer",this.pagedContainerSelector);
        console.log("pagedBlock",this.pagedBlockSelector);
        this.pagedContainer = document.querySelector(this.pagedContainerSelector);
        this.pagedBlocks = this.pagedContainer.querySelectorAll(this.pagedBlockSelector);
        console.log("number blocks",this.pagedBlocks.length);
        this.nbrPages = Math.ceil(this.pagedBlocks.length / this.perPage);
        this.currentPage = 1; // !!! pull from URL
        this.boundPaginationHandler = this.paginationHandler.bind(this);
        console.log("nbrPages",this.nbrPages);

        if(document.readyState === 'complete') {
            setTimeout(() => {
              this.drawPaginator();
            }, 10)  
          } else {
            window.addEventListener("load", this.drawPaginator.bind(this));
          }
      
    }

    drawPaginator() {
        // this.pagedContainer = document.querySelector(this.pagedContainerSelector);
        // this.pagedBlocks = this.pagedContainer.querySelectorAll(this.pagedBlockSelector);
        // console.log("number blocks",this.pagedBlocks.length);
        console.log("drawPaginator");


        var markup = `<cagov-pagination data-current-page="${this.currentPage}" data-total-pages="${this.nbrPages}"></cagov-pagination>`;
        this.innerHTML = markup;
        if (this.querySelector("cagov-pagination")) {
            var paginator = this.querySelector("cagov-pagination");
            console.log("binding cagov-pagination listener");
            paginator.removeEventListener(
              "paginationClick",
              this.boundPaginationHandler,
              true
            );
            paginator.addEventListener(
                "paginationClick",
                this.boundPaginationHandler,
                true
              );
            this.drawCurrentPage();
        }
        else {
            console.log("cagov-pagination not found");
        }
      

    }

    drawCurrentPage() {
        console.log("drawCurrentPage",this.currentPage);
        this.pagedContainer.innerHTML = "";
        this.pagedBlocks.forEach((block,index) => {
            if (index >= (this.currentPage - 1) * this.perPage && index < this.currentPage * this.perPage) {
                this.pagedContainer.appendChild(block);
            }
        });
    }

    paginationHandler(e) {
        console.log("paginationHandler called", e);
        this.currentPage = parseInt(e.detail);
        this.drawCurrentPage();
    }
}

window.customElements.define("cagov-paginator", CAGovPaginator);


