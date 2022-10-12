import {destinations, ferryNames} from "./destinations.js"; 
var departure = document.getElementById("departure"); 
var destination = document.getElementById("destination");  
var jsOut = document.getElementById("schedule"); 
var dropdownArray = [];  


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
            dropdownArray = []; 
            let schedule = json.schedule; 
            if (schedule.hasOwnProperty(from)) {
                if (schedule[from].hasOwnProperty(to)) {
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
    //Create departure point
    let div = document.createElement("div"); 
    div.classList.add("departure"); 
    let depart = div.appendChild(document.createElement("h1"))
    depart.innerHTML = getName(name); 
    if (to) {
        //Change this to a function
        div.appendChild(destDOM(dpt[to], to));
    }
    else {
        let outerDiv = document.createElement("div"); 
        for (let i of Object.keys(dpt)) {
            outerDiv.appendChild(destDOM(dpt[i], String(i))); 
        }
        div.appendChild(outerDiv); 
    }
    jsOut.appendChild(div); 
}

function destDOM(dptTO, name) {
    let temp = document.createElement("div");
    temp.innerHTML = "<h1>" + getName(name) + "</h1>";
    temp.classList.add("dest-container"); 
    // temp.classList.add("dropdown"); 
    // temp.setAttribute("id", "dropdown" + String(dropdownArray.push([]) - 1))
    // temp.setAttribute("onclick", "toggleDrop('" + temp.getAttribute("id") + "')"); 
    for (let i of Object.keys(dptTO)) {
        let tempP = document.createElement("h2"); 
        if (typeof dptTO[i] == 'object') {
            for (let j of Object.keys(dptTO[i])) {
                let tempQ = document.createElement("div"); 
                let obj = dptTO[i][j]; 
                let time = document.createElement("h3"); 
                time.innerHTML = obj.time; 
                
                let list = document.createElement("ul"); 
                //create dropdownlists
                // list.setAttribute("id", "drop" + String(dropdownArray.length - 1) + "_" + String(dropdownArray.at(-1).push(0) - 1));
                list.setAttribute("id", "dropdown" + String(dropdownArray.push(dropdownArray.length) - 1))
                list.classList.add("dropdown"); 
                tempQ.setAttribute("onclick", "toggleDrop('" + list.getAttribute("id") + "')");
                tempQ.classList.add("destination"); 
                
                list.appendChild(document.createElement("li")).innerHTML = obj.vesselName;
                list.appendChild(document.createElement("li")).innerHTML = obj.fill; 
                list.appendChild(document.createElement("li")).innerHTML = obj.carFill;
                list.appendChild(document.createElement("li")).innerHTML = obj.oversizeFill; 
                
                tempQ.appendChild(time); 
                tempQ.appendChild(list); 
                temp.appendChild(tempQ); 
            }
        }
        else {
            tempP.innerHTML = "Departure times"; 
            temp.appendChild(tempP); 
        }
    }
    return temp; 
}

function getName(ferryAbbreviation) {
    return ferryNames[ferryAbbreviation]; 
}

const fetchInit = {
    method: 'GET',
    redirect: 'follow'
}

/* MOVED THIS FUNCTION TO HTML SO IT CALLS CORRECTLY 
function toggleDrop(dropID) {
    debugger;
    let ID = document.getElementById(dropID); 
    if (ID.classList.contains("dropdown")) {
        ID.classList.remove("dropdown"); 
    }
    else {
        ID.classList.add("dropdown"); 
    }
}
*/
