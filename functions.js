var projects;
// Positioning list for 5 items (might have to cater for different lists if we choose to show more / fewer projects)
var projectPosList = [["2rem", "2rem"], ["50%", "11%"], ["30%", "37.5%"], ["55%", "64%"], ["10%", "71%"]];

// Attach the elements, need to do based on which page
function attachElements() {
    for (let i = 0; i < projects.length; i++){
        var projNumCount = 0;
        for (let key in projects[i]) {
            // Create a temporary container to hold the HTML string
            const tempDiv = document.createElement("div");
            tempDiv.classList.add("floating", "projectCard"); // To add the floating animation
            tempDiv.setAttribute("id", "projectCard" + projNumCount);
            tempDiv.style = "top:" + projectPosList[projNumCount][0] + "; left:" + projectPosList[projNumCount][1] + "; ";
            tempDiv.innerHTML = templateHomepagePreview(projects[i][key], i);

            // Attach
            document.getElementById("mainPreview").appendChild(tempDiv);   

            projNumCount++; // Used for the right positioning number
        }
    }
}

// This attaches the click events to the project cards
function attachProjectEvents() {
    var projectCards = document.getElementsByClassName("projectPreview");
    for (let i = 0; i < projectCards.length; i++) {
        projectCards[i].addEventListener("click", clickProjectCard)
    }
}

async function loadProjects() {
    const response = await fetch('./resources/projects.json'); // Fetch the JSON file
    const projectsOut = await response.json(); // Convert response to a JavaScript object
    console.log(projectsOut);

    // Once loaded, permitted to continue
    projects = projectsOut;

    // Need to load the projects first before attaching
    attachElements();
    attachProjectEvents();
}

// When user has clicked a project card
function clickProjectCard(element){
    const clickedCard = element.target;
    console.log("testing click" + clickedCard + " " + clickedCard.parentElement.id);
    
    // If a current one is selected, unblur and reblur accordingly
    if (projectCardIsSelected) {
        removeBlurProjectCards();
    }
    blurOtherProjectCards(clickedCard.parentElement.id);
    projectCardIsSelected = true; // for deselection later
}

function fullPreview(element) {
    document.getElementById("mainSkills").setAttribute("display", "none");
}

function blurOtherProjectCards(elementID) {
    var projectCards = document.getElementsByClassName("projectCard");

    for (let i = 0; i < projectCards.length; i++){
        if (projectCards[i].id != elementID){
            projectCards[i].style.filter = "blur(5px)";
            projectCards[i].style.opacity = "0.5";
            projectCards[i].classList.add("projectCard-overlay");
            console.log("adding");
        }
    }
}

function removeBlurProjectCards() {
    var projectCards = document.getElementsByClassName("projectCard");

    for (let i = 0; i < projectCards.length; i++){
        projectCards[i].style.filter = "none";
        projectCards[i].style.opacity = "1";
        projectCards[i].classList.remove("projectCard-overlay");
        console.log("removing");
    }
}

// Used to see if something should happen when user clicks document (see the currentpagestate.js file)
function checkDocumentClick(click) {
    console.log("clicked");
    if (projectCardIsSelected && !click.target.classList.contains("projectPreview")) {
        removeBlurProjectCards();
        projectCardIsSelected = false;
    }
}

function attachDocumentClick() {
    document.onclick = checkDocumentClick;
}

function start() {
    loadProjects();
    attachDocumentClick();
}

// Start
start();