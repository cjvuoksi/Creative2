import {destinations, ferryNames} from "./destinations.js"; 
var departure = document.getElementById("departure"); 
var destination = document.getElementById("destination");  
var jsOut = document.getElementById("schedule"); 

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
    let from = departure.options[departure.selectedIndex].value; 
    let to = destination.options[destination.selectedIndex].value; 
    // let url = "https://www.bcferriesapi.ca/api/" + departure.options[departure.selectedIndex].value; 
    // url += destination.options[destination.selectedIndex].value ? "/" + destination.options[destination.selectedIndex].value : "/";
    let url = 'https://www.bcferriesapi.ca/api/'
    fetch(url)
        .then(function(response) {
            console.log(response); 
            
            return response.json(); 
        })
        .then((json) => {
            console.log(json); 
            jsOut.replaceChildren("");  
            let schedule = json.schedule; 
            if (schedule.hasOwnProperty(from)) {
                if (schedule.from.hasOwnProperty(to)) {
                    departDOM(schedule[from], from, to); 
                }
                else {
                    departDOM(schedule[from], from); 
                }
            }
            else {
                for (let i of Object.keys(schedule)) {
                    departDOM(schedule[i], i); 
                }
            }
        }); 
}   

function departDOM(dpt, name, to = null) {
    debugger
    let div = document.createElement("div"); 
    div.classList.add("departure"); 
    div.innerHTML = getName(name);  
    for (let i of Object.keys(dpt)) {
        let temp = document.createElement("p"); 
        temp.innerHTML = getName(i); 
        div.appendChild(temp); 
    }
    jsOut.appendChild(div); 
}

function getName(ferryAbbreviation) {
    return ferryNames[ferryAbbreviation]; 
}

const fetchInit = {
    method: 'GET',
    redirect: 'follow'
}

