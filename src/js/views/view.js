import icons from 'url:../../img/icons.svg'; 

export default class view{
    _data;
        render(data)
        {
            if( (!data)  || ( (Array.isArray(data)) && (data. length === 0)) )
            {
                this.renderError();
            }

            this._data = data;
            this._clear();
            const markUp = this._generateMarkup();
            
            
             this._parentElement.insertAdjacentHTML('afterbegin',markUp );
    
            
            
        }
    
        _clear() {
             this._parentElement.innerHTML = '';
        }
    
        renderSpinner()
        {
          const markup = `<div class="spinner">
                     <svg>
                     <use href="src/img/icons.svg#icon-loader"></use>
                     </svg>
                 </div>`
      
          this._clear();
           this._parentElement.insertAdjacentHTML('afterbegin', markup)
        };
    
      renderError(message=this._errMessage) {
        const markUp1 = `<div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`
        
          this._clear();
          
           this._parentElement.insertAdjacentHTML('afterbegin', markUp1)
      }
    
       renderMessage(message=this._message) {
        const markUp = `<div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>`
        
           this._clear();
           this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }
    
    update(data)
    {
       

            this._data = data;
          
        const newmarkUp = this._generateMarkup();
        
        const newDOM = document.createRange().createContextualFragment(newmarkUp);

        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEl, i) =>
        {
            const curEl = curElements[i];
            if (!curEl) return;

            if ((!newEl.isEqualNode(curEl)) && (newEl.firstChild?.nodeValue?.trim() !==''))
            {
                curEl.textContent = newEl.textContent;    
            }

           if(!newEl.isEqualNode(curEl)) 
          {
            Array.from(newEl.attributes).forEach((att) => {
                   curEl.setAttribute(att.name,att.value)
                })    
          }
        
        })
    }
}
