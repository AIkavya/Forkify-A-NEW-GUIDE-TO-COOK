import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';





// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try
  {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading reacipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
   // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    }
    catch (err) {
     console.log(`${err.message}`);
    recipeView.renderError();
    }    
  }

const controlSearchResults = async function ()
{
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) return resultsView.renderError('Please enter a search term!');

    await model.loadSearchResults(query);

    if (model.state.search.results.length === 0) {
      return resultsView.renderError();
    }

   
    resultsView.render(model.getSearchResultsPage());

    // Render intial pagination buttons

    paginationView.render(model.state.search);
  }
  catch (err) {
     console.log(`${err.message}`);
     resultsView.renderError();
  }
}

const controlPagination = function (goToPage)
{
    resultsView.render(model.getSearchResultsPage(goToPage));

    // Render intial pagination buttons

    paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  //  update the recipe servings 
  model.upadteServings(newServings)


  // update the recipe view
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function ()
{
  if (!model.state.recipe.bookmarked) {
     model.addBookmark(model.state.recipe);
  }
 else{
    model.removeBookmark(model.state.recipe.id);
 }
 
  recipeView.update(model.state.recipe);
  // console.log(model.state.recipe);
  // console.log(model.state.bookmarks);

  bookmarksView.render(model.state.bookmarks);
}
const loadBookmarks = function () {
   bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe)
{

  try
  {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

   

    recipeView.render(model.state.recipe);

    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    

    window.history.pushState(null, '', `#${model.state.recipe.id}`)
   

  }
  catch (err) {
    addRecipeView.renderError(err.message);
  }

}
const inii = function() {
  console.log(`hello user! Welcome..`)
};

const init = function () {
  recipeView.addHandleRender(showRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarksView.addBookmarksHandle(loadBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  inii();
}

init();


