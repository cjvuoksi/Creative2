 
var departure = document.getElementById("departure"); 
var destination = document.getElementById("destination");  

// document.getElementById("departure").addEventListener("keyup", function(event) {
//     event.preventDefault(); 
//     departure = document.getElementById("departure").value; 
// }); 

// document.getElementById("destination").addEventListener("keyup", function(event) {
//     event.preventDefault(); 
//     destination = document.getElementById("destination").value; 
// }); 

document.getElementById("ferryInput").addEventListener('submit', formHandler); 

function formHandler(event) {
  event.preventDefault(); 
  getApi(); 
}

function getApi() {
    debugger
    let url = "https://www.bcferriesapi.ca/api/" + document.getElementById("from").value + "/" + document.getElementById("to").value; 
    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
        });
}