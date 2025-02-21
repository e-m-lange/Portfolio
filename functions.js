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
            
            // Save the keys
            projectKeys[projNumCount] = key;

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
        // update which project is selected currently in click project card
        projectCards[i].setAttribute("data-projectNumber", i); // for tracking
        projectCards[i].addEventListener("click", (element) => { updateCurrentProjectVar(element.target.getAttribute("data-projectNumber")); } )

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
        showAllProjectCards();
        hideGoToProjectBtn();
        hidePreviewProjectBg();
    }

    blurOtherProjectCards(clickedCard.parentElement.id);
    hideMainSkills();
    hideProjectCard(element);
    showGoToProjectBtn(element);
    showPreviewProjectBg();
    welcomeSectionToProject();
    forceScrollTo();
    projectCardIsSelected = true; // for deselection later
}

function updateCurrentProjectVar(projectNumber) {
    currOpenedProjectNum = projectNumber;
}

// Hide the specific project card
function hideProjectCard(element) {
    // hide the card and attach the nav btn
    const parent = element.target.parentElement;
    for (let i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].classList != undefined) {
            parent.childNodes[i].classList.add("hidden");
            parent.style.width = "14rem";
        }
    }
}

// Show the go to project button
function showGoToProjectBtn(element) {
    let newElement = document.createElement("div");
    newElement.innerHTML = goToProjectBtn();
    newElement.id = "goToProjectID"; // Used for deletion later
    element.target.parentElement.appendChild(newElement);
}

function hideGoToProjectBtn() {
    document.getElementById("goToProjectID").remove();
}

// Re-show the project cards
function showAllProjectCards() {
    for (let k = 0; k < document.getElementsByClassName("projectCard").length; k++) {
        var element = document.getElementsByClassName("projectCard")[k]
        for (let i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].classList != undefined) {
                element.childNodes[i].classList.remove("hidden");
                element.style.width = "20rem";
            }
        }
    }
}

// Hide the main skills section when a project has been selected
function hideMainSkills() {
    // if it is in mobile view, ignore since hiding it messes with scrolling too much on mobile
    if (innerWidth > 700) {
        // adding minimising effect
        document.getElementById("mainIntroItem1").classList.add("hidden");
        document.getElementById("mainSkills").style.padding = "0rem";
        for (let i = 0; i < document.getElementById("mainSkills").children.length; i++) {
            document.getElementById("mainSkills").children[i].classList.add("hidden");
        }
    }
}

// Show the main skills again once all project cards have been deselected
function showMainSkills() {
    // if it is in mobile view, ignore
    if (innerWidth > 700) {
        document.getElementById("mainIntroItem1").classList.remove("hidden");
        document.getElementById("mainSkills").style.padding = "1rem";
        for (let i = 0; i < document.getElementById("mainSkills").children.length; i++) {
            document.getElementById("mainSkills").children[i].classList.remove("hidden");
        }
    }
}

function blurOtherProjectCards(elementID) {
    var projectCards = document.getElementsByClassName("projectCard");

    for (let i = 0; i < projectCards.length; i++){
        if (projectCards[i].id != elementID){
            projectCards[i].style.filter = "blur(3px)";
            projectCards[i].style.opacity = "0.5";
            projectCards[i].style.height = "7.5rem"
            projectCards[i].style.width = "14rem"
            projectCards[i].classList.add("projectCard-overlay");
            projectCards[i].querySelector("img").classList.add("hidden");
        }
    }
}

function removeBlurProjectCards() {
    var projectCards = document.getElementsByClassName("projectCard");

    for (let i = 0; i < projectCards.length; i++){
        projectCards[i].style.filter = "none";
        projectCards[i].style.opacity = "1";
        projectCards[i].style.height = "9.375rem"
        projectCards[i].style.width = "20rem"
        projectCards[i].classList.remove("projectCard-overlay");
        projectCards[i].querySelector("img").classList.remove("hidden");
    }
}

function hidePreviewProjectBg() {
    // show profile photo again
    if (innerWidth > 625) {
        document.getElementById("profilePhoto").style.opacity = 1;
    }
    
    // make bg more opaque
    document.getElementById("mainPreview").style.backgroundColor = "rgba(255, 255, 255, 0.8)";

    // Fade out animation
    if (!projectCardIsSelected) {
        setTimeout(() => {
            document.getElementById("mainPreviewProjectBg").style.opacity = 0;
            document.getElementById("mainPreviewOverlay").style.opacity = 0;
        }, 50);  
    }
    else {
        setTimeout(() => {
            document.getElementById("mainPreviewProjectBg").style.opacity = 0;
        }, 50);  
    }
}

// Shows the preview project bg with the right images
function showPreviewProjectBg() {   
    if (innerWidth > 625) {
        // hide profile photo to get rid of clutter, but only outside of mobile
        document.getElementById("profilePhoto").style.opacity = 0;
    }

    // make bg more opaque
    document.getElementById("mainPreview").style.backgroundColor = "rgba(255, 255, 255, 0.875)";
    
    // set the images
    var bgImages = document.querySelectorAll("#mainPreviewProjectBg img");
    var tempCurrProject = projects[0][projectKeys[currOpenedProjectNum]];

    // for correct fade in animation
    if (!projectCardIsSelected) { // If no project is currently selected
        //showPreviewProjectBgLoadImage(bgImages);
        new Promise((resolve) => { showPreviewProjectBgLoadImage(bgImages, tempCurrProject, resolve); }).then(showPreviewProjectBgImagesLoaded);
    }
    else {
        document.getElementById("mainPreviewProjectBg").style.opacity = 0; // Otherwise hide the currently shown
        setTimeout(() => { 
            new Promise((resolve) => { showPreviewProjectBgLoadImage(bgImages, tempCurrProject, resolve); }).then(showPreviewProjectBgImagesLoaded);
        }, 300); // need to wait for fade out animation first
    }
}

// Attaches the project images as background images
function showPreviewProjectBgLoadImage(bgImages, tempCurrProject, resolve) {
    var loadedImages = 0; // count how many images have been loaded

    console.log(tempCurrProject);
    var imgList = tempCurrProject.previewImageList.split("*");
    for (let i = 0; i < bgImages.length; i++) {
        bgImages[i].src = "./resources/" + imgList[i];

         // Attach a load event listener to each image
        bgImages[i].onload = () => {
            loadedImages++;  // Count how many images are loaded

            // If all images are loaded, resolve the promise
            if (loadedImages === bgImages.length) {
                resolve();
                console.log("images loaded");
            }
        };
    }   
}

// Continue the fade in once all images have been loaded
function showPreviewProjectBgImagesLoaded() {
    // Fade in animation
    if (!projectCardIsSelected) {
        setTimeout(() => {
            document.getElementById("mainPreviewProjectBg").style.transition = "0.3s";
            document.getElementById("mainPreviewProjectBg").style.opacity = 1;
            document.getElementById("mainPreviewOverlay").style.opacity = 1;
        }, 50);
    }
    else {
        setTimeout(() => {
            document.getElementById("welcomeSection").style.transition = "0.3s";
            document.getElementById("mainPreviewProjectBg").style.opacity = 1;
            document.getElementById("mainPreviewOverlay").style.opacity = 1;
        }, 300);
    }

    console.log("fade in");
}

// Reset the message in the welcome section to the default
function resetWelcomeSection() {
    // for fade in animation
    document.getElementById("welcomeSection").style.transition = "0.0s";
    document.getElementById("welcomeSection").style.opacity = 0;

    document.querySelector("#welcomeSection h1").innerHTML = welcomeSectionTitleDefault;
    document.querySelector("#welcomeSection p").innerHTML = welcomeSectionPDefault;

    document.getElementById("mainIntro").style.position = "relative";

    // Fade in animation
    setTimeout(() => {
        document.getElementById("welcomeSection").style.opacity = 1;
        document.getElementById("welcomeSection").style.transition = "0.3s";
    }, 50);
}

// change the text in the welcome section to the project text
function welcomeSectionToProject() {
    // for fade in animation
    if (!projectCardIsSelected){
        document.getElementById("welcomeSection").style.transition = "0.0s";
        document.getElementById("welcomeSection").style.opacity = 0;
        document.querySelector("#welcomeSection h1").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].title;
        document.querySelector("#welcomeSection p").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].blurb;
    }
    else {
        setTimeout(() => {
            document.getElementById("welcomeSection").style.opacity = 0;
            setTimeout(() => {
                document.querySelector("#welcomeSection h1").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].title;
                document.querySelector("#welcomeSection p").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].blurb;
            }, 200);
        }, 90);
    }
    
    if (innerWidth <= 700){
        // make it sticky if it's mobile and a project is opened
        document.getElementById("mainIntro").style.position = "sticky";
    }

    // Fade in animation
    if (!projectCardIsSelected){
        setTimeout(() => {
            document.getElementById("welcomeSection").style.opacity = 1;
            document.getElementById("welcomeSection").style.transition = "0.3s";
        }, 50);
    }
    else {
        setTimeout(() => {
            document.getElementById("welcomeSection").style.opacity = 1;
            document.getElementById("welcomeSection").style.transition = "0.3s";
        }, 280);
    }
}

// particularily on mobile, scroll so e.g., button is visible
function forceScrollTo() {
    const buttonPosition = document.getElementById("goToProjectID").getBoundingClientRect().top;
    const mainIntroDistance = document.getElementById("mainIntro").getBoundingClientRect().top;
    const mainIntroPos = document.getElementById("mainContent").scrollTop;
    console.log(mainIntroDistance - buttonPosition);

    if (-270 < (mainIntroDistance - buttonPosition)) {
        // Scroll to the position of the button
        document.getElementById("mainContent").scroll({top: mainIntroPos + (buttonPosition - buttonPosition - mainIntroDistance - 100), behavior: "smooth"});
    }
}

var scrollStylesSet = false;
let handScrollIsRunning = false;

// Check scroll for the mobile ux
async function handleScroll() {
    // Only care when user is browsing a project
    if (projectCardIsSelected && !handScrollIsRunning){
        handScrollIsRunning = true;

        //console.log("handle scroll 2 " + document.getElementById("mainContent").scrollTop);
        const scrollPosition = document.getElementById("mainContent").scrollTop; // Get the scroll position from the top of the page
        const threshold = 10; // Scroll threshold in pixels

        if (scrollPosition > threshold) {
            if (!scrollStylesSet) {
                document.getElementById("mainIntro").style.position = "sticky";
                document.getElementById("mainIntro").style.top = "0px";
                document.getElementById("mainIntroItem1").classList.add("hidden");
                scrollStylesSet = true;
                await wait(500); // 500 milliconds  
                handScrollIsRunning = false
            }
        } else {
            if (scrollStylesSet) {
                document.getElementById("mainIntro").style.position = "relative";
                document.getElementById("mainIntroItem1").classList.remove("hidden");
                scrollStylesSet = false;
                await wait(500); // 500 milliconds
                handScrollIsRunning = false
            }
        }

        forceScrollTo();
    }
}

// Helper function to create a delay (in milliseconds)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Used to see if something should happen when user clicks document (see the currentpagestate.js file)
function checkDocumentClick(click) {
    console.log("clicked");
    
    // for the project card preview interations, when deselecting
    if (projectCardIsSelected && !click.target.classList.contains("projectPreview")) {
        projectCardIsSelected = false;
        removeBlurProjectCards();
        showMainSkills();
        showAllProjectCards();
        hideGoToProjectBtn();
        hidePreviewProjectBg();
        resetWelcomeSection();
    }
}

function attachDocumentClick() {
    document.onclick = checkDocumentClick;
}

function start() {
    loadProjects();
    attachDocumentClick();
    document.getElementById("mainContent").addEventListener("scroll", handleScroll); // Add the scroll event listener
}

// Start
start();