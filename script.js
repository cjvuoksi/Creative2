import {destinations, ferryNames} from "./destinations.js"; 
var departure = document.getElementById("departure"); 
var destination = document.getElementById("destination");  
var jsOut = document.getElementById("schedule"); 
var dropdownArray = [];  
var isResizeCallable = false; 

window.onload = (event) => {
    departure.selectedIndex = 0; 
    destination.selectedIndex = 0; 
    onResize(); 
}

document.getElementById("ferryInput").addEventListener('submit', formHandler); 

departure.addEventListener("change", updateDestinations);

function updateDestinations(event) {
    event.preventDefault(); 
    let selectedCity = departure.options[departure.selectedIndex].value; 
    while (destination.childElementCount > 2) {
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
            isResizeCallable = true; 
            onResize(); 
        }); 
}   



function departDOM(dpt, name, to = null) {
    //Create departure point
    let div = document.createElement("div"); 
    div.classList.add("departure"); 
    let depart = div.appendChild(document.createElement("h1"))
    depart.innerHTML = getName(name); 
    let toToken =  div.appendChild(document.createElement("h1"))
    toToken.classList.add("to"); 
    toToken.innerHTML = "to"; 
    if (to) {
        //Change this to a function
        div.appendChild(document.createElement("h1")).innerHTML = to; 
        div.appendChild(destDOM(dpt[to], to));
    }
    else {
        for (let i of Object.keys(dpt)) {
            if (i != Object.keys(dpt)[0]) {
                depart = div.appendChild(document.createElement("h1"));
                depart.innerHTML = getName(name);
                toToken = div.appendChild(document.createElement("h1"))
                toToken.classList.add("to"); 
                toToken.innerHTML = "to"; 
            }
            div.appendChild(document.createElement("h1")).innerHTML = getName(i); 
            div.appendChild(destDOM(dpt[i], String(i))); 
        }
    }
    jsOut.appendChild(div); 
}

function destDOM(dptTO, name) {
    let temp = document.createElement("div");
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
                time.classList.add("time"); 
                let list = document.createElement("ul"); 
                //create dropdownlists
                // list.setAttribute("id", "drop" + String(dropdownArray.length - 1) + "_" + String(dropdownArray.at(-1).push(0) - 1));
                list.setAttribute("id", "dropdown" + String(dropdownArray.push(dropdownArray.length) - 1))
                list.classList.add("dropdown"); 
                tempQ.setAttribute("onclick", "toggleDrop('" + list.getAttribute("id") + "')");
                tempQ.classList.add("destination"); 
                
                list.appendChild(document.createElement("li")).innerHTML = '<p class="vessel"> <i class="fa-solid fa-ferry"></i> ' + obj.vesselName + "</p>" + "<p><i>Estimated space</i></p>"
                list.appendChild(document.createElement("li")).innerHTML = "Total " + String(100 - obj.fill) + "%"
                list.appendChild(document.createElement("li")).innerHTML = '<i class="fa-solid fa-car"></i> ' +  String(100 - obj.carFill) + "%";
                list.appendChild(document.createElement("li")).innerHTML = '<i class="fa-solid fa-truck"></i> ' + String(100 - obj.oversizeFill) + "%"; 
                
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


window.onresize = onResize; 

function onResize() {
    if (isResizeCallable) if (document.getElementById("content").classList.contains("center")) document.getElementById("content").classList.remove("center"); 
    if (window.matchMedia("(min-width: 900px)").matches) {
        for(let i of document.getElementsByClassName("to")) {
            i.innerHTML = "<em>&#8594;</em>"; 
        }
         
    }
    else {
        for(let i of document.getElementsByClassName("to")) {
            i.innerHTML = " to ";
        }
    }
}; 
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
