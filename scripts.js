"use strict";

// function for calculating the amount of carbs in a portion

function myCalc() {
    let x = document.getElementById("c").innerText;
    let y = document.getElementById("por").innerText;
    if (x <= 100.00) {
        x = (x * y) / 100;
        document.getElementById("show").innerHTML = Math.round(x) + "g";
    }
}

const initialise = () => {
    getIO();
    switchTabs("home");
    const decimalExp = /^\d{0,4}$/;
    const beforeDecimalRegEx = /^\d{0,3}$/;
    const decimalNumberRegEx = /^\d{0,4}[.]\d?$/;
    let cur_active = "c";

    // input processing and validation (using regular expressions) for when a button is pressed
    // Sidenote: added an extra validation check for carbs per 100g => User input cannot be over 100gs, since it is physically impossible to have more than a 100 grams of carbs per 100g of a food item

    function processinput(id) {
        switch (id) {
            case "reset":
                document.getElementById(cur_active).innerText = "0";
                setInput();
                break;

            case "resetAll":
                document.getElementById("c").innerText = "0";
                document.getElementById("por").innerText = "0";
                localStorage.setItem('c', document.getElementById("c").innerText);
                localStorage.setItem('por', document.getElementById("por").innerText);
                break;


            case "bs":
                document.getElementById(cur_active).innerText = document.getElementById(cur_active).innerText.slice(0, -1);
                if (document.getElementById(cur_active).innerText == "") {
                    document.getElementById(cur_active).innerText = "0";
                    setInput();
                }
                setInput();
                break;

            case "dec":
                if (document.getElementById(cur_active).innerText.match(decimalExp)) {
                    document.getElementById(cur_active).innerText += ".";
                    setInput();
                } else
                    window.alert("You can't have multiple decimals points!");

                break;

            case "eq":
                if (!((document.getElementById("por")).innerText == "0") && !((document.getElementById("c")).innerText == "0")) {
                    if (document.getElementById("c").innerText <= 100.00) {
                        myCalc();
                    } else
                        window.alert("Can't have more than 100g of carbs per 100g!");
                } else
                    window.alert("Can't calcute total carbs, if one of the inputs is a 0!");
                break;

            default:
                if (document.getElementById(cur_active).innerText == "0") {
                    document.getElementById(cur_active).innerText = id;
                    setInput();

                } else if (
                    (document.getElementById(cur_active).innerText.match(beforeDecimalRegEx)) ||
                    (document.getElementById(cur_active).innerText.match(decimalNumberRegEx))
                ) {

                    document.getElementById(cur_active).innerText += id;
                    setInput();
                } else

                    window.alert("You may only enter 4 digits before the decimal, and 2 after!");


        }


    }

    // functions and the listeners for making one of the input fields active (and highlighted) on the home page

    document.getElementById("por").addEventListener("click", () => { makeActiveP() });
    document.getElementById("c").addEventListener("click", () => { makeActiveC() });

    function makeActiveP() {
        cur_active = "por"
        document.getElementById("por").style.backgroundColor = 'lightcyan';
        document.getElementById("c").style.backgroundColor = 'white';
    }
    function makeActiveC() {
        cur_active = "c"
        document.getElementById("c").style.backgroundColor = 'lightcyan';
        document.getElementById("por").style.backgroundColor = 'white';
    }

    // function storing the user input in local storage

    function setInput() {
        switch (cur_active) {
            case "c":
                localStorage.setItem('c', document.getElementById("c").innerText);
                break;

            case "por":
                localStorage.setItem('por', document.getElementById("por").innerText);
                break;
        }
    }

    const IDs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "reset", "resetAll", "dec", "bs", "eq"];

    for (let i = 0; i < IDs.length; i++) {
        document.getElementById(IDs[i]).addEventListener("click", () => processinput(IDs[i]));
    }

    // getting the portion and carbs per 100g inputs from previous session via local storage, if doesn't exist, then sets them 0

    function getIO() {
        var carbs = localStorage.getItem('c');
        var portion = localStorage.getItem('por');
        if (!carbs) { carbs = "0"; }
        if (!portion) { portion = "0"; }
        document.getElementById("c").innerText = carbs;
        document.getElementById("por").innerText = portion;
        if ((carbs != "0") && (portion != "0")) {
            myCalc();
        }

    }

    // function for switching tabs, loading favorited food items from storage,

    const tabIDs = ["home", "starred", "search"]
    function switchTabs(tabID) {
        switch (tabID) {
            case "home":
                document.getElementById("homeContent").style.display = "block";
                document.getElementById("searchContent").style.display = "none";
                document.getElementById("starredContent").style.display = "none";
                break;

            case "starred":
                document.getElementById("starredContent").style.display = "block";
                document.getElementById("searchContent").style.display = "none";
                document.getElementById("homeContent").style.display = "none";
                items = JSON.parse(localStorage.getItem(savePlace));
                if (items.length != 0) {
                    document.getElementById("starredContent").innerText = "";
                    var justHere = document.createElement('p');
                    var textHere = document.createTextNode("Click on the box of the food item you want to select!");
                    justHere.appendChild(textHere);
                    document.getElementById("starredContent").appendChild(justHere);
                    for (let i = 0; i < items.length; i += 2) {
                        var newButton = document.createElement('button');
                        newButton.id = items[i];
                        newButton.className = "carbButton";
                        var buttonText = document.createTextNode(items[i + 1] + ": " + items[i] + "g/100g");
                        newButton.appendChild(buttonText);
                        document.getElementById("starredContent").appendChild(newButton);
                    }
                    for (let i = 0; i < (document.getElementsByClassName("carbButton").length); i++) {
                        document.getElementsByClassName("carbButton")[i].addEventListener("click", (e) => { stToHome(e.srcElement.id) });
                    }
                } else
                    document.getElementById("starredContent").innerText = "You have no favorited food items!";                
                break;

            case "search":
                document.getElementById("searchContent").style.display = "block";
                document.getElementById("starredContent").style.display = "none";
                document.getElementById("homeContent").style.display = "none";
                break;


        }
    }
    for (let i = 0; i < tabIDs.length; i++) {
        document.getElementById(tabIDs[i]).addEventListener("click", () => switchTabs(tabIDs[i]));
    }

    // Saving the user input food name and carbs per 100g value into local storage (also input validation)

    var items = [];
    const savePlace = 'saved';
    function saveItem() {
        if ((document.getElementById("c").innerText) <= 100.00) {
            items = JSON.parse(localStorage.getItem(savePlace));
            if (!items) { items = []; }
            var uInput = prompt("gib me name");
            if (!(items.includes(uInput))) {
                items.push(document.getElementById("c").innerText);
                items.push(uInput);
                localStorage.setItem(savePlace, JSON.stringify(items));
            } else
                window.alert("This item is already in your favorites!");

        } else
            window.alert("Please a give a valid value to the carbs/100g");

    }


    document.getElementById("save").addEventListener("click", () => saveItem());

    // Getting the carbs per 100g parameter of a food item, switches tabs to the home page, and fills in the carbs per 100g

    function stToHome(val) {
        document.getElementById("homeContent").style.display = "block";
        document.getElementById("searchContent").style.display = "none";
        document.getElementById("starredContent").style.display = "none";
        document.getElementById("c").innerText = val;
    }

    // Validating user input for the search, and fetching the JSON objects from the API

    function doSearch() {

        var searchInput = document.getElementById("searchInput").value;
        if (searchInput.length > 3) {
            searchInput = "https://devweb2022.cis.strath.ac.uk/~aes02112/food/?s=" + searchInput;
            fetch(searchInput).then((response) => response.json())
                .then((data) => processSearch(data));
        } else
            window.alert("Please enter at least 4 characters!");

    }

    document.getElementById("searching").addEventListener("click", () => doSearch());


    //  Processes the data from the JSON objects, and transforms it into clickable buttons
    function processSearch(data) {
        document.getElementById("searchResults").innerText = "";
        if (data.length != 0) {
            for (let i = 0; i < data.length; i++) {

                var newResult = document.createElement('button');
                newResult.id = data[i].carbsper100g;
                newResult.className = "resultButton";
                var resultText = document.createTextNode(data[i].name + ": " + data[i].carbsper100g + "g/100g");
                newResult.appendChild(resultText);
                document.getElementById("searchResults").appendChild(newResult);


            }
        } else
            window.alert("There is no such item in our database:(");
        for (let i = 0; i < (document.getElementsByClassName("resultButton").length); i++) {
            document.getElementsByClassName("resultButton")[i].addEventListener("click", (e) => { stToHome(e.srcElement.id) });
        }
    }

}




window.addEventListener("load", initialise);