import axios from 'axios';
export default class Search{
    constructor(query) {
        this.query=query;
    }
    async getResults() {
        try {
            const results = 
            await 
            axios(
                `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
            );
            this.recipes = results.data.recipes;
        }
        catch(error){
            // do something with error - log it.
            alert(error); 
        }
    }
}
