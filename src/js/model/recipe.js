import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await 
            axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;
        }
        catch(err) {
            alert(err);
        }
    }

    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time=periods*15;
    }

    calcServings() {
        this.servings = 4;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;
        //ingredients
        this.ingredients.forEach(ing => ing.count 
            *= (newServings/this.servings));
        this.servings = newServings;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon','ounces', 'ounce', 
                            'teaspoons', 'teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort,'kg','g'];
        let objIng;
        const newIngredients = this.ingredients.map(el => {
            //uniform ingredients
            let count;
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i)=> {
                ingredient = ingredient.replace(unit,unitsShort[i]);
            });
            //remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');
            //count, unit, ingredient
            //split ingedient string into individual elements array
            const arrIng = ingredient.split(' ');
            //check if the array contains any predefined units
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            //console.log(arrIng);
            //console.log(unitIndex);
            if (unitIndex > -1){
                // there is a unit
                // could be any of 4 1/2 or 4.5 etc
                // array count is [4,1/2] in case of 4 1/2
                //next line will take the original array of entries and 
                // try to check how many entries are before the unit 
                const arrCount = arrIng.slice(0,unitIndex);
                // if more than 1 entries convert to suitable counts
                //console.log(arrCount);
                if (arrCount===1) {
                    // evaluate count by replacing any - signs with +
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    //eval the expression obtained by slicing the 
                    //array from position 0 to before position of 
                    // predefined unit, joining all relevant 
                    //array entries with a + sign
                    //console.log(arrIng);
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                    //console.log(count);
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex], 
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                    // above equivalent to count:count
                }

            } else if (parseInt(arrIng[0],10)){
                // no unit but 1st element is a number
                objIng ={
                    count: parseInt(arrIng[0],10),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' ')
                    // slice from 2nd point all the way to the end and then 
                    // join using space as a separator
                }
            } else if (unitIndex === -1) {
                // no unit and no number in 1st position of array
                objIng ={
                    count:1,
                    unit:'',
                    ingredient
                    // above equivalent to ingredient:ingredient
                }
            }
            //console.log(objIng)
            return(objIng);
        });
        this.ingredients = newIngredients;
        //console.log(this.ingredients);
    }
}


 