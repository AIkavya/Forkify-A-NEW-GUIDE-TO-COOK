import { async } from 'regenerator-runtime';
import { API_URL,RES_PER_PAGE,KEY } from './config.js';
import { get_JSON,send_JSON } from './helpers.js';
import bookmarksView from './views/bookmarksView.js';
export const state =
{
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultPerPage: RES_PER_PAGE,
    },
    bookmarks: []
}

export const loadRecipe = async function (id)
{
      
    try {
       
        const data = await get_JSON(`${API_URL}${id}?key=${KEY}`);
        console.log(data);
        const { recipe } = data.data;
        console.log('----------------')
        console.log(recipe);
        console.log('----------------')
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
  
        };

        if (state.bookmarks.some(b => b.id === id)) {
            state.recipe.bookmarked = true;
        }
        else {
            state.recipe.bookmarked = false;
        }


        console.log(state.recipe); //Refactor
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
      
}

export const loadSearchResults = async function (query)
{
    try {
        state.search.query = query;
        const data = await get_JSON(`${API_URL}?search=${query}&key=${KEY}`);
  
        state.search.results =data.data.recipes.map(recipe => {
            return {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            ...(recipe.key && {key : recipe.key}) 
            }
        })
        state.search.page = 1;
    }
    catch (err) {
        console.log(err.message);
        throw err;
    }
}

export const getSearchResultsPage = function (page=state.search.page)
{
    state.search.page = page;
    const start = (page - 1) * state.search.resultPerPage;
    const end = page * state.search.resultPerPage;

    return state.search.results.slice(start, end);
   
}

export const upadteServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = newServings * ing.quantity / state.recipe.servings;
    })


    state.recipe.servings = newServings;
}
const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
}



export const removeBookmark = function (id) {

    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

     if (id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }

    persistBookmarks();
}



const init = function ()
{
    const storage = localStorage.getItem('bookmarks');
    if (storage)
    {
        state.bookmarks = JSON.parse(storage);
    }
    
}

init();

// export const clearBookmarks = function () {
//     localStorage.clear('bookmarks');
// }

export const uploadRecipe = async function (newRecipe)
{
    try {
        
    
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] != '').map(ing => {
            const ingArr = ing[1].replaceAll(' ', '').split(',');

            if (ingArr.length != 3) {
                throw new Error("Wrong Ingredient Format PLease USE AS : 'QUANTITY , UNIT , DESCRIPTION ' ")
            }
            const [quantity, unit, description] = ingArr;

            return { quantity: quantity ? +quantity : null, unit, description };
        })

         const recipe1 =
        {
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
        }

        const data = await send_JSON(`${API_URL}?key=${KEY}`, recipe1);
        console.log(data);
        const { recipe } = data.data;
        console.log('----------------')
        console.log(recipe);
        console.log('----------------')
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key) && {key : recipe.key},
  
        };
        
        addBookmark(state.recipe)
        
    }
    catch (err) {
        throw err;
    }

   
}

 
        