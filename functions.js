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

function attachHeaderEvents() {
    // Attach correct page changes based on which navigation btn is clicked
    document.getElementById("navBtn0").addEventListener("click", function (element) { updateCurrentPage("home"); });
    document.getElementById("navBtn1").addEventListener("click", function (element) { updateCurrentPage("otherWorkPage"); });
    document.getElementById("navBtn2").addEventListener("click", function (element) { updateCurrentPage("aboutPage"); });
}

async function loadProjects() {
    const response = await fetch('./resources/projects.json'); // Fetch the JSON file
    const projectsOut = await response.json(); // Convert response to a JavaScript object

    // Once loaded, permitted to continue
    projects = projectsOut;
    // Need to load the projects first before attaching
    updateProjectKeys(projects);
    attachGoToProjectBtn();
    attachProjectBtnEvents(projects);
}

function updateProjectKeys(projects){
    Object.keys(projects[0]).forEach((key, i) => {
        projectKeys[i] = key;
    });
}

// Attach the changing page to the 'Go To Project' btn
function attachGoToProjectBtn() {
    document.getElementById("goToProjectBtn").addEventListener("click", (element) => {
        console.log(currOpenedProjectNum);
        updateCurrentPage(projectKeys[currOpenedProjectNum]);
    })
}

// This attaches the click events to the project buttons on the homepage
function attachProjectBtnEvents(projects) {
    var projectBtns = document.getElementsByClassName("otherProjectBtn");
    const numOfProjects = Object.keys(projects[0]).length; // get the length by counting how many keys there are
    const names = Array.from(Object.keys(projects[0]));
    let i2 = 0;

    for (let i = 0; i < numOfProjects; i++) { // 1 higher since we are currently in one project, the first once
        // update which project is selected currently in click project card
        if (i !== currOpenedProjectNum) { // Don't update with what project currently shown
            projectBtns[i2].setAttribute("data-projectNumber", i); // for tracking
            projectBtns[i2].addEventListener("click", (element) => { 
                updateCurrentProjectVar(element.target.getAttribute("data-projectNumber"));
                updateProjectText();
                updateOtherProjectBtn();
            } )
            // Update the innerhtml of the buttons too
            projectBtns[i2].innerHTML = projects[0][names[i]].title;
            i2++;
        }
    }
}

// When swapping projects, update the other projects buttons with the unselected options
function updateOtherProjectBtn() {
    const projectBtns = document.getElementsByClassName("otherProjectBtn");
    const names = Array.from(Object.keys(projects[0]));
    const numOfProjects = Object.keys(projects[0]).length;
    let i2 = 0;

    for (let i = 0; i < numOfProjects; i++) {
        if (i !== parseInt(currOpenedProjectNum)) {
            projectBtns[i2].setAttribute("data-projectNumber", i); // update which projects the buttons lead to
            projectBtns[i2].innerHTML = projects[0][names[i]].title;
            i2++;
        }
    }
}

function updateCurrentProjectVar(projectNumber) {
    currOpenedProjectNum = projectNumber;
}

function updateProjectText() {
    document.querySelector("#projectTitle h2").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].title;
    document.querySelector("#projectDescription p").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].blurb;
    document.querySelector("#projectImg img").src = projects[0][projectKeys[currOpenedProjectNum]].imgUrl;
    const tags = (projects[0][projectKeys[currOpenedProjectNum]].snippet).split("*");
    document.querySelectorAll("#projectTags p").forEach((element, i) => {
        element.innerHTML = tags[i];
    })
}

async function connectHomeAnimations() {
    var btns = document.querySelectorAll('.otherProjectBtn');
    var projectImg = document.querySelector('#projectImg img');
    var title = document.querySelector("#projectTitle");
    var tags = document.querySelectorAll("#projectTags p");

    // Animate all buttons on page load
    btns.forEach(element => {
        otherBtnAnim(element);
    });

    tags.forEach(element => {
        addAnimateClass(element, 400);
    });

    addAnimateClass(projectImg, 400);
    addAnimateClass(title, 600);

    // Animate the button animations and also the image animation since they change too
    btns.forEach((element) => {
        element.addEventListener('click', () => { 
            btns.forEach(element => {        // loop over all buttons
                addAnimateClass(element, 500);
                addAnimateClass(projectImg, 400);
                addAnimateClass(title, 600);
                tags.forEach(element => {
                    addAnimateClass(element, 400);
                });
            });
        });
    })
}

async function otherBtnAnim(element) {
    element.classList.remove('animate');
    //void element.offsetWidth;
    element.classList.add('animate');
    await wait(600);
    element.classList.remove('animate');
}

async function addAnimateClass(element, waitTime) {
    element.classList.remove('animate');
    element.classList.add('animate');
    await wait(waitTime);
    element.classList.remove('animate');
}

// Used to see if something should happen when user clicks document (see the currentpagestate.js file)
function checkDocumentClick(click) {
    // On the project pages, if the anchor menu is shown and it wasn't the menu that was clicked
    if (anchorMenuTitles && !document.getElementById("anchorMenu")?.contains(click.target)) {
        document.getElementById("anchorMenuBtn").click();
    }
}

function attachDocumentClick() {
    document.onclick = checkDocumentClick;
}

let handleScrollIsRunning = false;

// Helper function to create a delay (in milliseconds)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateCurrentPage(pageName = "") {
    console.log("updating " + pageName)
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

async function start() {
    //console.log("Start " + sessionStorage.currentPage);
    if (!updateCurrentPage()) {
        sessionStorage.currentPage = new URLSearchParams(window.location.search).get('page');
    }
    if (sessionStorage.currentPage == "home") {
        //To begin, start with the first project
        connectHomeAnimations();
        updateCurrentProjectVar(0);
        await loadProjects().then(() => { updateProjectText(); });
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

start();