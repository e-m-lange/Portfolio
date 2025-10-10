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
    preloadHeroImg(projects);
}

// Preload for better experience on homepage, preload images in browser cache earlier on
function preloadHeroImg(project) {
    const numOfProjects = Object.keys(projects[0]).length; // get the length by counting how many keys there are
    const names = Array.from(Object.keys(projects[0]));
    var imgToLoad = [];
    
    for (let i = 0; i < numOfProjects; i++) {
        imgToLoad.push(projects[0][names[i]].imgUrl);
    }

    imgToLoad.forEach((src) => {
        const img = new Image();
        img.src = src;
        preloadedHeroImg.push(img);
    });
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

    //move the navigation bar to the left/right depending on project selected
    var otherProjectsBar = document.querySelector("#otherProjectsDiv");

    for (let i = 0; i < numOfProjects; i++) { // 1 higher since we are currently in one project, the first once
        // update which project is selected currently in click project card
        if (i !== currOpenedProjectNum) { // Don't update with what project currently shown
            projectBtns[i2].setAttribute("data-projectNumber", i); // for tracking
            projectBtns[i2].addEventListener("click", (element) => {
                if (window.innerWidth <= 625) {
                    //move the navigation bar to the left/right depending on project selected
                    if (i == (numOfProjects - 1)) {
                        otherProjectsBar.scrollTo({
                            left: otherProjectsBar.scrollWidth,
                            behavior: 'smooth'
                        });
                    }
                    else if (i !== 1 && i - currOpenedProjectNum > 0) { // moving up
                        otherProjectsBar.scrollTo({
                            left: i * (otherProjectsBar.scrollWidth / 5),
                            behavior: 'smooth'
                        });
                    }
                    else if (i !== 1 && i - currOpenedProjectNum <= 0) { // moving up
                        otherProjectsBar.scrollTo({
                            left: -i * (otherProjectsBar.scrollWidth / 5),
                            behavior: 'smooth'
                        });
                    }
                    else {
                        otherProjectsBar.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                }
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
    const otherProjectsMarker = document.getElementById("otherProjectsMarker");
    const names = Array.from(Object.keys(projects[0]));
    const numOfProjects = Object.keys(projects[0]).length;
    let i2 = 0;

    for (let i = 0; i < numOfProjects; i++) {
        if (i !== parseInt(currOpenedProjectNum)) {
            // update item location
            if (i < numOfProjects) {
                projectBtns[i2].style.order = i2;
            }
            else if (i == numOfProjects) {
                projectBtns[i2].style.order = i2;
            }

            projectBtns[i2].setAttribute("data-projectNumber", i); // update which projects the buttons lead to
            projectBtns[i2].innerHTML = projects[0][names[i]].title;
            i2++;
        }
        else {
            // Update the location of the marker
            otherProjectsMarker.style.order = i;
        }
    }
}

function updateCurrentProjectVar(projectNumber) {
    currOpenedProjectNum = projectNumber;
}

function updateProjectText() {
    document.querySelector("#projectTitle #titleFirst").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].title;
    document.querySelector("#projectTitle #titleSecond").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].title;
    document.querySelector("#projectDescription p").innerHTML = projects[0][projectKeys[currOpenedProjectNum]].blurb;
    document.querySelector("#projectImg img").src = preloadedHeroImg[currOpenedProjectNum].src; // Take the image from the preloaded images
    const tags = (projects[0][projectKeys[currOpenedProjectNum]].snippet).split("*");
    document.querySelectorAll("#projectTags p").forEach((element, i) => {
        element.innerHTML = tags[i];
    })
}

async function connectHomeAnimations() {
    var btns = document.querySelectorAll('.otherProjectBtn');
    var projectImg = document.querySelector('#projectImg img');
    var title = document.querySelector("#projectTitle #titleFirst");
    var title2 = document.querySelector("#projectTitle #titleSecond");
    var tags = document.querySelectorAll("#projectTags p");
    var hamburgerDiv = document.querySelector("#navBtnMenu div");
    var hamburger = document.querySelector("#navBtnMenu");
    var navBtnList = document.querySelector(".navBtnList");
    var arrow = document.querySelector("#goToProjectArrow");
    var marker = document.querySelector("#otherProjectsMarker");

    // Animate all buttons on page load
    btns.forEach(element => {
        otherBtnAnim(element);
    });

    tags.forEach(element => {
        addAnimateClass(element, 400);
    });

    addAnimateClass(projectImg, 400);
    addAnimateClass(title, 500);
    addAnimateClass(title2, 500);
    addAnimateClass(arrow, 600);
    addAnimateClass(marker, 400);

    // Animate the button animations and also the image animation since they change too
    btns.forEach((element) => {
        element.addEventListener('click', () => { 
            btns.forEach(element => {        // loop over all buttons
                addAnimateClass(element, 500);
                addAnimateClass(projectImg, 400);
                addAnimateClass(title, 500);
                addAnimateClass(title2, 500);
                tags.forEach(element => {
                    addAnimateClass(element, 400);
                });
                addAnimateClass(arrow, 600);
                addAnimateClass(marker, 400);
            });
        });
    })

    // For the mobile hamburger menu, change from the hamburger icon and exit cross icon
    let closedSVG = '<svg width="1.25rem" height="1.25rem" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H18.5M1 7.75H18.5M1 14.5H18.5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
    let openSVG = '<svg width="1.25rem" height="1.25rem" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L17.5 16.5M17.5 1L1 16.5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';

    hamburgerDiv.setAttribute('data-menuState', 'closed');

    hamburgerDiv.addEventListener('click', () => {
        if (hamburgerDiv.getAttribute('data-menuState') === 'closed' ) {
            document.querySelector(".navBtnList").style.display = "flex";
            hamburgerDiv.innerHTML = openSVG;
            hamburgerDiv.setAttribute('data-menuState', 'open');
        }
        else {
            hamburgerDiv.innerHTML = closedSVG;
            document.querySelector(".navBtnList").style.display = "none";
            hamburgerDiv.setAttribute('data-menuState', 'closed');
        }
        addAnimateClass(hamburger, 400);
        addAnimateClass(navBtnList, 400);
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

// To handle disappearing the header on mobile view
function headerScroll() {
    document.querySelector("main").addEventListener('scroll', function() {
        if (this.innerWidth > 625) {
            return
        }
        let scrollPos = document.querySelector("main").scrollTop; // How far the page is scrolled vertically

        if (scrollPos > 160) { // trigger after 200px of scrolling
            document.querySelector('header').style.opacity = 0;
        } else {
            document.querySelector('header').style.opacity = 1;
        }
    });
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

// for the otherProjectCircle follow cursor
function attachCircleEvent() {
    const container = document.querySelector('#otherProjects');
    const circle = document.querySelector('#otherProjectsCircle');

    container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const offsetX = -5.5 * remInPixels;
    const offsetY = 3.5 * remInPixels;
    const x = e.clientX + offsetX;
    const y = e.clientY - offsetY;

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    });

    container.addEventListener('mouseenter', () => {
    circle.style.transform = 'scale(1)';
    });

    container.addEventListener('mouseleave', () => {
    circle.style.transform = 'scale(0)';
    });

    // Smooth animation loop
    function animate() {
        // easing factor (0 < factor < 1)
        const ease = 0.5;

        circleX += (mouseX - circleX) * ease;
        circleY += (mouseY - circleY) * ease;

        circle.style.left = `${circleX}px`;
        circle.style.top = `${circleY}px`;

        requestAnimationFrame(animate);
    }

    animate();
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
        headerScroll();
        await loadProjects().then(() => { updateProjectText(); });
    }
    // Loading the project page
    else if (window.location.pathname.includes("projectPage") || window.location.pathname.includes("aboutPage") || window.location.pathname.includes("otherWorkPage")) { // For now about page is built with same template
        loadProjectContent().then(attachZoomableImgEvents); // wait for elements to be attached before attaching events
    }
    attachDocumentClick();
    attachHeaderEvents();
    attachCircleEvent();

    setCustomVh();
    window.addEventListener('resize', setCustomVh);
}

start();