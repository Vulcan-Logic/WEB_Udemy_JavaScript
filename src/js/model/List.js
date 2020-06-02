import uniqid from 'uniqid';
export default class List {
    constructor(){
        this.items=[];
    }

    addItem(count,unit,ingredient){
        const item = {
            id:uniqid(),
            count, 
            unit, 
            ingredient
        };
        this.items.push(item);
        return(item);
    }

    deleteItem(id) {
        // [2,4,8] -> splice(1,2) return 4 and mutates array to [2,8]
        const index = this.items.findIndex(el=> el.id===id);
        this.items.splice(index,1);
    }

    updateCount(id,newCount){
        //update counts
        this.items.find(el=> el.id===id).count=newCount;
    }
}