import icons from 'url:../../img/icons.svg';
import view from './view.js'
class BookmarksView extends view
{
    _parentElement = document.querySelector('.bookmarks__list');
    _errMessage = 'No Bookmarks Yet ! ';
    _message = '';

    _generateMarkup() {
        return this._data.map(this._generateMarkupPreview).join('');
    }

    _generateMarkupPreview(result)
    {

      const id = window.location.hash.slice(1);

        return ` <li class="preview">
            <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}"/>
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
               
              </div>
            </a>
          </li>`;
    }

    addBookmarksHandle(handle)
    {
        window.addEventListener('load', handle);    
    }
    
    
  


    // renderError(message = this._errMessage) {
    //   const markup = `<li class="error">
    //             <div>
    //               <svg>
    //                 <use href="${icons}#icon-alert-triangle"></use>
    //               </svg>
    //             </div>
    //             <p>${message}</p>
    //           </li>`;

    //   this._clear();
    //   this._parentElement.insertAdjacentHTML('afterbegin', markup);
    // }
}

export default new BookmarksView();