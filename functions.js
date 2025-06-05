// Positioning list for 5 items (might have to cater for different lists if we choose to show more / fewer projects)
var projectPosList = [["2rem", "2rem"], ["50%", "11%"], ["30%", "37.5%"], ["55%", "64%"], ["10%", "71%"]];

// Will help deal with the search bar and nav bar of mobile view
function setCustomVh() {
    // window.screen.height (got rid of this)
    var vvVh = window.visualViewport.height; // Visible portion of the screen multiplied to calculate unit of 1 vh
    customVh = Math.min(document.documentElement.clientHeight, window.innerHeight, vvVh);
    var mostVh = Math.max(document.documentElement.clientHeight, window.innerHeight, vvVh);
    document.documentElement.style.setProperty('--customVh', `${customVh}px`);
    vhDifference = mostVh - Number(customVh);
    document.documentElement.style.setProperty('--vhDifference', `${vhDifference}px`);
    //console.log('Visual viewport resized:' + customVh + " " + vvVh + " max " + mostVh + " difference " + vhDifference);
}

function projectPositions(numOfProjects) {
    switch (numOfProjects) {
        case 4:
            return [["6%", "30%"], ["38%", "3%"], ["53%", "50%"], ["10%", "71%"]]; // item 1 moved to item 2's position (to keep item 1 as the first for mobile)
        case 5:
            return [["2rem", "2rem"], ["50%", "11%"], ["30%", "37.5%"], ["55%", "64%"], ["10%", "71%"]];
    }
}

// Attach the elements, need to do based on which page
function attachElements() {
    //console.log(sessionStorage.currentPage);
    for (let i = 0; i < projects.length; i++){
        // Positions based on the project length
        var projectPosList = projectPositions(Object.keys(projects[i]).length);
        var projNumCount = 0;
        for (let key in projects[i]) {
            // Create a temporary container to hold the HTML string
            const tempDiv = document.createElement("div");
            tempDiv.classList.add("floating", "projectCard"); // To add the floating animation
            tempDiv.setAttribute("id", "projectCard" + projNumCount);
            tempDiv.style = "top:" + projectPosList[projNumCount][0] + "; left:" + projectPosList[projNumCount][1] + "; ";
            tempDiv.innerHTML = templateHomepagePreview(projects[i][key], i);
            
            // Save the project keys
            projectKeys[projNumCount] = key;

            // Attach
            document.getElementById("mainPreview").appendChild(tempDiv);   

            projNumCount++; // Used for the right positioning number
        }
    }
}

// This attaches the click events to the project cards on the homepage
function attachProjectEvents() {
    var projectCards = document.getElementsByClassName("projectPreview");
    for (let i = 0; i < projectCards.length; i++) {
        // update which project is selected currently in click project card
        projectCards[i].setAttribute("data-projectNumber", i); // for tracking
        projectCards[i].addEventListener("click", (element) => { updateCurrentProjectVar(element.target.getAttribute("data-projectNumber")); } )

        projectCards[i].addEventListener("click", clickProjectCard)
    }
}

function attachHeaderEvents() {
    // Attach correct page changes based on which navigation btn is clicked
    document.getElementById("navBtn0").addEventListener("click", function (element) { updateCurrentPage("home"); });
    document.getElementById("navBtn1").addEventListener("click", function (element) { updateCurrentPage("otherWorkPage"); });
    document.getElementById("navBtn2").addEventListener("click", function (element) { updateCurrentPage("aboutPage"); });
    // Attach the expand event for the 'about this site' btn
    if (document.getElementById("aboutThisSite") != null) {
        document.getElementById("aboutThisSite").addEventListener("click", function (element) { toggleAboutThisPage(); });
    }
}

async function loadProjects() {
    const response = await fetch('./resources/projects.json'); // Fetch the JSON file
    const projectsOut = await response.json(); // Convert response to a JavaScript object
    //console.log(projectsOut);

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

        if (innerWidth <= 700) {
            document.querySelector("#welcomeSection").style.paddingBottom = "0rem";
        }
    }

    blurOtherProjectCards(clickedCard.parentElement.id);
    hideMainSkills();
    darkenNameAndBg();
    hideProjectCard(element);
    showGoToProjectBtn(element);
    if (innerWidth <= 700) {
        // For mobile, don't show them anyway
        hideOtherProjectCards();
        document.querySelector("#welcomeSection").style.paddingBottom = "1rem";
    }
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

function hideOtherProjectCards() {
    var projectCards = document.getElementsByClassName("projectCard");
    for (let i = 0; i < projectCards.length; i++) {
        if (projectCards[i].querySelector("#goToProjectID") == null) {
            console.log(projectCards[i].querySelector("#goToProjectID") + ", " + projectCards[i]);
            projectCards[i].style.opacity = 0;
            projectCards[i].querySelector(".projectPreview").classList.add("hidden");
            projectCards[i].querySelector(".projectPreviewLabel").classList.add("hidden");
        }
    }
}

// Show the go to project button
function showGoToProjectBtn(element) {
    let newElement = document.createElement("div");
    newElement.innerHTML = goToProjectBtn();
    newElement.id = "goToProjectID"; // Used for deletion later
    newElement.addEventListener('click', function(element) { updateCurrentPage(projectKeys[currOpenedProjectNum]); }); // attach click event
    element.target.parentElement.appendChild(newElement);
    // For mobile
    if (innerWidth <= 700) { // Shifts the button down a bit for the first card
        if (newElement.getBoundingClientRect().top <= (innerHeight / 2)) {
            newElement.style.paddingTop = "3rem";
        }
        else if (newElement.getBoundingClientRect().top >= (innerHeight / 4)) {
            newElement.parentElement.style.paddingBottom = "6rem";
        }
    }
}

function hideGoToProjectBtn() {
    // For mobile
    if (innerWidth <= 700) {
        if (document.getElementById("goToProjectID").getBoundingClientRect().top >= (innerHeight / 4)) {
            document.getElementById("goToProjectID").parentElement.style.paddingBottom = "0rem";
        }
    }
    document.getElementById("goToProjectID").remove();
}

// Re-show the project cards
function showAllProjectCards() {
    for (let k = 0; k < document.getElementsByClassName("projectCard").length; k++) {
        var element = document.getElementsByClassName("projectCard")[k]
        element.opacity = 1;
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
    //if (innerWidth > 700) { // (old) if it is in mobile view, ignore since hiding it messes with scrolling too much on mobile
    if (true) {
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
    // if (innerWidth > 700) { // (old) // if it is in mobile view, ignore
    if (true) {
        document.getElementById("mainIntroItem1").classList.remove("hidden");
        document.getElementById("mainSkills").style.padding = "1rem";
        for (let i = 0; i < document.getElementById("mainSkills").children.length; i++) {
            document.getElementById("mainSkills").children[i].classList.remove("hidden");
        }
    }
}

// Will change the colour of the name title and the background
function darkenNameAndBg() {
    document.body.style.backgroundImage = "linear-gradient(to bottom, rgb(21, 27, 30, 0.93), rgba(54, 59, 61, 0.93)), url('./resources/background_image.webp')"
    document.getElementById("nameTitle").style.backgroundImage = "none";
    document.querySelector("#mainIntro").style.boxShadow = "0px 4px 16px #0000003d";
}

function resetNameAndBg() {
    document.body.style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.7)), url('./resources/background_image.webp')";
    document.getElementById("nameTitle").style.backgroundImage = "linear-gradient(to right, black 0%, var(--blue-dark) 70%, var(--yellow-med))";
    document.querySelector("#mainIntro").style.boxShadow = "0px 0px 0px";
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

    var imgList = tempCurrProject.previewImageList.split("*");
    for (let i = 0; i < bgImages.length; i++) {
        bgImages[i].src = "./resources/" + imgList[i];

         // Attach a load event listener to each image
        bgImages[i].onload = () => {
            loadedImages++;  // Count how many images are loaded

            // If all images are loaded, resolve the promise
            if (loadedImages === bgImages.length) {
                resolve();
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
        }, 50);
    }
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

// Show/hide this site info if selected
function toggleAboutThisPage() {
    var divToToggle = document.querySelector("#aboutThisSite > div");
    if (divToToggle.style.display == "none" || divToToggle.style.display == "") {
        divToToggle.style.display = "block";
        aboutThisSiteSelected = true;
    }
    else {
        divToToggle.style.display = "none";
        aboutThisSiteSelected = false;
    }
}

// particularily on mobile, scroll so e.g., button is visible
function forceScrollTo() {
    var buttonPosition;
    if (document.getElementById("goToProjectID") !== null) {
        buttonPosition = document.getElementById("goToProjectID").getBoundingClientRect().top;
    }
    const mainIntroDistance = document.getElementById("mainIntro").getBoundingClientRect().top;
    const mainIntroPos = document.getElementById("mainContent").scrollTop;
    console.log(mainIntroDistance - buttonPosition);

    if (-230 < (mainIntroDistance - buttonPosition)) {
        // Scroll to the position of the button
        document.getElementById("mainContent").scroll({top: mainIntroPos + (buttonPosition - buttonPosition - mainIntroDistance - 20), behavior: "smooth"});
    }
}

var scrollStylesSet = false;
let handleScrollIsRunning = false;

// Check scroll for the mobile ux
async function handleScrollHome() {
    // Only care when user is browsing a project
    // To return the arrow under the welcome message
    if (!projectCardIsSelected && !handleScrollIsRunning && scrollStylesSet) {
        handleScrollIsRunning = true;
        unsetScrollStyle();
        await wait(500); // 500 milliconds
        handleScrollIsRunning = false
    }
    else if (projectCardIsSelected && !handleScrollIsRunning){
        handleScrollIsRunning = true;
        //console.log("handle scroll 2 " + document.getElementById("mainContent").scrollTop);
        const scrollPosition = document.getElementById("mainContent").scrollTop; // Get the scroll position from the top of the page
        console.log("scrollStylesSet " + scrollStylesSet);

        if (!scrollStylesSet) {
            setScrollStyle();
            await wait(490); // 500 milliconds  
            handleScrollIsRunning = false
            forceScrollTo();
        }            
        await wait(500); // 500 milliconds  
        handleScrollIsRunning = false
    }
}

function unsetScrollStyle() {
    document.getElementById("mainIntro").style.position = "relative";
    document.getElementById("mainIntroItem1").classList.remove("hidden");
    //document.getElementById("mainSkills").style.filter = "none";
    scrollStylesSet = false;
}

function setScrollStyle() {
    document.getElementById("mainIntro").style.position = "sticky";
    document.getElementById("mainIntro").style.top = "0px"; // Needed to activate sticky
    document.getElementById("mainIntroItem1").classList.add("hidden");
    //document.getElementById("mainSkills").style.filter = "blur(3px)";
    scrollStylesSet = true;
}

async function handleScrollMobile() {
    // On mobile we don't show other project cards when one is selected
    for (let element in document.getElementsByClassName("projectPreview")) {
        element.classList.add("hidden");
    }
    for (let element in document.getElementsByClassName("projectPreviewLabel")) {
        element.classList.add("hidden");
    }
}

// Helper function to create a delay (in milliseconds)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Used to see if something should happen when user clicks document (see the currentpagestate.js file)
function checkDocumentClick(click) {
    // for the project card preview interations, when deselecting
    if (projectCardIsSelected && !click.target.classList.contains("projectPreview")) {
        projectCardIsSelected = false;
        removeBlurProjectCards();
        showMainSkills();
        showAllProjectCards();
        hideGoToProjectBtn();
        hidePreviewProjectBg();
        resetWelcomeSection();
        resetNameAndBg();

        unsetScrollStyle();
    }
    // On the project pages, if the anchor menu is shown and it wasn't the menu that was clicked
    if (anchorMenuTitles && !document.getElementById("anchorMenu")?.contains(click.target)) {
        document.getElementById("anchorMenuBtn").click();
    }
    // On homepage, if the about this site was selected
    if (aboutThisSiteSelected && !document.getElementById("aboutThisSite")?.contains(click.target)) {
        toggleAboutThisPage();
    }
}

function attachDocumentClick() {
    document.onclick = checkDocumentClick;
}

function updateCurrentPage(pageName = "") {
    if (pageName != "") {
        //console.log(sessionStorage.currentPage);
        sessionStorage.currentPage = pageName;
        // Home page (includes changing to the right slug)
        if (pageName == "home" && new URLSearchParams(window.location.search).get('page') != "home") { // Swapping to home page
            console.log("home " + window.location.pathname);
            if (window.location.pathname.includes("/Portfolio")) { // Temporary workaround solution for Github
                isHostedOnGithub = true;
                console.log("is hosted on github");
            }
            if (isHostedOnGithub) {
                window.location.href = "/Portfolio/" + `?page=${sessionStorage.currentPage}`;
                console.log("hosted on github");
            }
            else {
                window.location.href = "/" + `?page=${sessionStorage.currentPage}`;
                console.log("not hosted on github");
            }
        }
        // About Page
        else if (pageName == "aboutPage" && window.location.origin == "aboutPage" && new URLSearchParams(window.location.search).get('page') != "aboutPage") {
            window.location.href = window.location.origin + window.location.pathname + `?page=${sessionStorage.currentPage}`;
        }
        // Change to the parameter or otherwise change to the one in the url
        else if (pageName == "aboutPage" && window.location.origin != "aboutPage" && new URLSearchParams(window.location.search).get('page') != "aboutPage") {
            window.location.href = "aboutPage.html" + `?page=${sessionStorage.currentPage}`;
        }
        // About Page
        else if (pageName == "otherWorkPage" && window.location.origin == "otherWorkPage" && new URLSearchParams(window.location.search).get('page') != "otherWorkPage") {
            window.location.href = window.location.origin + window.location.pathname + `?page=${sessionStorage.currentPage}`;
        }
        // Change to the parameter or otherwise change to the one in the url
        else if (pageName == "otherWorkPage" && window.location.origin != "otherWorkPage" && new URLSearchParams(window.location.search).get('page') != "otherWorkPage") {
            window.location.href = "otherWorkPage.html" + `?page=${sessionStorage.currentPage}`;
        }
        // Project pages
        else if (window.location.origin == "projectPage" && new URLSearchParams(window.location.search).get('page') != pageName) { // Only update if not correct
            window.location.href = window.location.origin + window.location.pathname + `?page=${sessionStorage.currentPage}`;
        }
        // Change to the parameter or otherwise change to the one in the url
        else if (window.location.origin != "projectPage" && new URLSearchParams(window.location.search).get('page') != pageName) {
            window.location.href = "projectPage.html" + `?page=${sessionStorage.currentPage}`;
        }
        return true;
    }
    return false;
}

function start() {
    //console.log("Start " + sessionStorage.currentPage);
    if (!updateCurrentPage()) {
        sessionStorage.currentPage = new URLSearchParams(window.location.search).get('page');
    }
    if (sessionStorage.currentPage == "home") {
        loadProjects();
        document.getElementById("mainContent").addEventListener("scroll", handleScrollHome); // Add the scroll event listener
    }
    // Loading the project page
    else if (window.location.pathname.includes("projectPage") || window.location.pathname.includes("aboutPage") || window.location.pathname.includes("otherWorkPage")) { // For now about page is built with same template
        loadProjectContent().then(attachZoomableImgEvents); // wait for elements to be attached before attaching events
    }
    attachDocumentClick();
    attachHeaderEvents();

    setCustomVh();
    window.addEventListener('resize', setCustomVh);
}
//mainIntroMinimised
// Start
start();