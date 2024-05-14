import { initializeApp } from  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref , push , onValue , remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"



document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    // Including the code that references HTML elements
    // This ensures that the code runs after the DOM has fully loaded
    const firebaseconfig = {
        databaseURL: "https://playground-fcf7e-default-rtdb.europe-west1.firebasedatabase.app",
        projectId:"playground-fcf7e"
    };

    //fields
    let input_field = document.getElementById("input-field");
    let add_button = document.getElementById("add-button");
    let shopping_list = document.getElementById("shopping-list");

    const app = initializeApp(firebaseconfig);
    const database = getDatabase(app);
    const shoppinglistIndb = ref(database, "shoppingList")
    




    onValue(shoppinglistIndb , function(snapshot){

        if(snapshot.exists()){

        let shoparray = Object.entries(snapshot.val())//convert object to array

        shopping_list.innerHTML = ""

        for (let index = 0; index < shoparray.length; index++) {

            let currentitem = shoparray[index];

                //should add trim
            appenditemtoshoppinglist(currentitem)

        }}

        else{
            shopping_list.innerHTML = "No items found , double click to delete items when added "
        }
    })


    input_field.addEventListener("keydown", function(event) {
        // Check if the pressed key is Enter (keyCode 13)
        if (event.keyCode === 13) {
            // Prevent the default behavior of the Enter key (form submission)
            let inputvalue = input_field.value
            if(inputvalue.trim()!=""){
                event.preventDefault();
                push(shoppinglistIndb,inputvalue.trim())
                clear_input_field()
            }
            // Call the function to add the item to the shopping list
        }
    });

    

    add_button.addEventListener("click", function() {
        let inputvalue = input_field.value;
        if (inputvalue.trim() !== "") {
            push(shoppinglistIndb, inputvalue.trim());
            clear_input_field();
        }
    });

    function clear_input_field(){
        input_field.value = ""; // Clear the input field
    }
    
    function appenditemtoshoppinglist(currentitem){
        // shopping_list.innerHTML += "<li>" + inputvalue + "</li>";

        let item_id = currentitem[0]
        let item_value = currentitem[1]

        let newEL = document.createElement("li")
        newEL.tabIndex = 0
        newEL.textContent  = item_value //create an item and then adds this text into it

        shopping_list.append(newEL) //it adds it hear to the ul

        newEL.addEventListener("dblclick" , function(){
            let exactlocationofelemntindb = ref(database, `shoppingList/${item_id}`)
            remove(exactlocationofelemntindb)
        })
    }

    
});

