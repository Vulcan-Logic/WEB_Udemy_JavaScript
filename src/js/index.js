// Global app controller
import Search from './model/Search';
import * as searchView from './view/searchView';
import {elements, renderLoader, clearLoader} from './view/base';

/* global state object 
* - current state object
* - current shopping list object 
* - liked recipes 
*/
const state = {} 

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput(); //get this from the form
 
    if (query) {
            //2) new search object and add it to state
        state.search = new Search(query);

        
        //3) prepare UI for results and add spinner/progress bar etc
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4) search for recipes
        await state.search.getResults();

        //5) render results on UI
        //console.log(state.search.recipes);
        clearLoader();
        searchView.renderRes(state.search.recipes);
    }
}
    

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

