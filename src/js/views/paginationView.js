import icons from 'url:../../img/icons.svg';
import view from './view.js'
class PaginationView extends view {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup()
    {

        // <button class="btn--inline pagination__btn--prev">
        //     <svg class="search__icon">
        //       <use href="src/img/icons.svg#icon-arrow-left"></use>
        //     </svg>
        //     <span>Page 1</span>
        //   </button>
        //   <button class="btn--inline pagination__btn--next">
        //     <span>Page 3</span>
        //     <svg class="search__icon">
        //       <use href="src/img/icons.svg#icon-arrow-right"></use>
        //     </svg>
        //   </button>
        
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultPerPage);
        // Page 1 , there are other pages
        if (curPage === 1 && numPages > 1)
        {
             return `<button   class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
             <span> Page ${curPage + 1}</span>
               <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
           </button>`
        }

        
         

        // Last Page 
        if (curPage === numPages && numPages > 1)
        {
           return `<button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${curPage - 1} </span>
          </button>`    
        }
        
        // other page
        if (curPage < numPages)
        {
           return `<button class="btn--inline pagination__btn--prev" data-goto="${curPage - 1}">
             <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
             <span> Page ${curPage - 1}</span>
          </button>
                
          <button class="btn--inline pagination__btn--next" data-goto="${curPage + 1}">
            
            <span> Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
        }

        // page 1 , and there are No other pages

        return '';
    }
    addHandlerClick(handler)
    {
        this._parentElement.addEventListener('click', function (e) {
            e.preventDefault();
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = Number(btn.dataset.goto);
            
            handler(goToPage);
       })    
    }
}

export default new PaginationView();