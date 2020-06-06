// Global app controller
import Search from './model/Search';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import {elements, renderLoader, clearLoader} from './view/base';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import Recipe from './model/recipe';
import List from './model/List'
import Likes from './model/Likes';

/* global state object 
* - current state object
* - current shopping list object 
* - liked recipes 
*/
const state = {};

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput(); //get this from the form
 
    if (query) {
        //2) new search object and add it to state
        state.search = new Search(query);
        recipeView.clearRecipe();
        
        //3) prepare UI for results and add spinner/progress bar etc
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //4) search for recipes
            await state.search.getResults();

            //5) render results on UI
            //console.log(state.search.recipes);
            clearLoader();
            searchView.renderResults(state.search.recipes);
        }
        catch(err){
            console.log(err);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        
        searchView.renderResults(state.search.recipes,gotoPage);
    }
});

/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async() => {
    const id = window.location.hash.replace('#','');
    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);      
        
        //highlight selected receipe 
        if (state.search) searchView.highlightSelected(id);

        //creat new recipe object
        state.recipe = new Recipe(id);
        try{
             //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        catch(err) {
            alert(err);
        }
    }
}

/* LIST CONTROLLER */

const controlList = () => {
    //initialise
    if (!state.list) {
        state.list = new List();
        // add ingrediet
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count,el.unit,el.ingredient);
            listView.renderItem(item);
        });
    }
}

/*LIKES CONTROLLER */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID=state.recipe.id;
    if (!state.likes.isLiked(currentID)){
        // add a liked recipe
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );
        // turn on heart icon 
        likesView.toggleLikes(true);
        likesView.renderLikes(newLike);
    } else{
        //remove a liked recipe
        state.likes.deleteLike(currentID);
        likesView.toggleLikes(false);
        likesView.deleteLikes(currentID);
    } 
    likesView.toggledLikedView(state.likes.getNumLikes());
}

/* window functions */

window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes 
    state.likes.readStorage();
    //toggle like button 
    likesView.toggledLikedView(state.likes.getNumLikes());
    // render existing likes
    state.likes.likes.forEach(like => likes.likesView.renderLikes(like));
})

/*
 window.addEventListener('hashchange',controlRecipe);
 window.addEventListener('load', controlRecipe);
 // replaced lines above with the following line 
 */
 ['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));

 // handle recipe button clicks

 elements.recipe.addEventListener('click', e=> {
     if (e.target.matches('.btn-decrease, .btn-decrease *')){
         //decrease button
         //console.log('decrease button');
         if (state.recipe.servings > 1) { 
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
         }
     }
     else if (e.target.matches('.btn-increase, .btn-increase *')) {
         //increase button 
         //console.log('increase button');
         state.recipe.updateServings('inc');
         recipeView.updateServingsIngredients(state.recipe);
     }
     else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
         // add to ingredient list
         controlList();
     }
     else if (e.target.matches('.recipe__love, .recipe__love *')){
        // add to ingredient list
        controlLike();
    }  
  });

 //handle delete and update list item button events

 elements.shopping.addEventListener('click', e=> {
     const id = e.target.closest('.shopping__item').dataset.itemid;
     
     //handle delete
     if (e.target.closest('.shopping__delete, .shopping__delete *')){
        //delete from state 
        state.list.deleteItem(id);
        //delete from view
        listView.deleteItem(id);
     } else if (e.target.matches('.shopping__count-value')){
         const val = parseFloat(e.target.value,10);
         state.list.updateCount(id, val);
     }
 });
 