//Storage Controller


//Item Controller
const ItemCtrl = function() {
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 700},
            // {id: 0, name: 'Cookie', calories: 400},
            // {id: 0, name: 'Eggs', calories: 200},
        ],
        currentItem : null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;

            if(data.items.length > 0 ) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //calroeies to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id){
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if (item.id === id) {
                   found = item; 
                }
            });
            return found;
        },

        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(item){
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            //loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            });
            // set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;
        },


        logData: function() {
            return data;
        }
    }

}();



//UI Controller
const UICtrl = function() {

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCalorriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
    }

    // public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>
                `;
            }); 

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalorriesInput).value
            }
        },

        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add id
            li.id =  `item-${item.id}`;
            
            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },


        //clear input fields
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '',
            document.querySelector(UISelectors.itemCalorriesInput).value = ''
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalorriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        

        getSelectors: function() {
            return UISelectors;
        } 
    }
}();



//App Controller
const App = (function(ItemCtrl, UICtrl){

    //Load event listners
    const loadEventListners = function() {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    }

    // add items submit
    const itemAddSubmit = function(e) {
        //get input from ui controller
        const input = UICtrl.getItemInput();

        //check name and calories input
        if(input.name !== '' && input.calories !== '') {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to ui list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //clear fields
           UICtrl.clearInput();
        }       

        e.preventDefault();
    }

    //Edit submit item 

    const itemUpdateSubmit = function(e) {
        if(e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            

            //break init array
            const listIdArr = listId.split('-');

            //get actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);
            
            // console.log(itemToEdit);
            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // public methods
    return {
        init: function() {
            UICtrl.clearEditState();

            // fetch items from data structure
            const items = ItemCtrl.getItems();
            //check if any items
            if (items.length === 0) {
                UICtrl.hideList();                
            }else {                
                //populate list with items
                UICtrl.populateItemList(items);
            }

            //Load event listener
            loadEventListners();
        },
    }
})(ItemCtrl, UICtrl);

App.init();