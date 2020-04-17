import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value="";

export const clearResults = () => elements.searchResultList.innerHTML="";

const limitTitleLength = (title,limit=17) => {
    const newTitle=[];
    if (title.length>limit) {
        title.split(' ').reduce((acc,cur) => {
            if (acc+cur.length<=limit) {
                newTitle.push(cur);
            }
            return(acc+cur.length);
        },0);
        return(`${newTitle.join(' ')} ...`);
    }
    return(title);
};

const renderRecepie = element => {
    const newTitle = limitTitleLength(element.title);
    const markup = 
        `<li>
            <a class="results__link results__link--active" href="#${element.recipe_id}">
                <figure class="results__fig">
                    <img src="${element.image_url}" alt="${newTitle}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${newTitle}</h4>
                    <p class="results__author">${element.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend',markup);
};

export const renderResults = recipes => {
    recipes.forEach(element => {
        renderRecepie(element);
    });
};

//the entire function above can be written as 
export const renderRes = recipes => recipes.forEach(renderRecepie);