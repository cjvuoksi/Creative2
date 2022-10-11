import {destinations, ferryNames} from "./destinations.js"; 
var departure = document.getElementById("departure"); 
var destination = document.getElementById("destination");  

window.onload = (event) => {
    departure.selectedIndex = 0; 
    destination.selectedIndex = 0; 
}

document.getElementById("ferryInput").addEventListener('submit', formHandler); 

departure.addEventListener("change", updateDestinations);

function updateDestinations(event) {
    event.preventDefault(); 
    let selectedCity = departure.options[departure.selectedIndex].value; 
    while (destination.childElementCount > 1) {
        destination.removeChild(destination.lastChild); 
    }
    for (let i of destinations[selectedCity]) {
        let option = document.createElement("option");
        option.setAttribute("value", i); 
        option.innerHTML = ferryNames[i]; 
        destination.appendChild(option); 
    }     
}


function formHandler(event) {
  event.preventDefault(); 
  getApi(); 
}

function getApi() {
    let url = "https://www.bcferriesapi.ca/api/" + departure.options[departure.selectedIndex].value 
    url = destination.options[destination.selectedIndex].value ? "/" + destination.options[destination.selectedIndex].value : ""; 
    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
        });
}