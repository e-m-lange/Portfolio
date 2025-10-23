// template for the preview cards on the homepage
function templateHomepagePreview(project) {
    var projectPreview = 
    `<div class="projectPreview">
            <img class="projectPreviewImg" src="./resources/${project.imgUrl}"/>
        </div>
    <div class="projectPreviewLabel">
            <p style="margin: 0px; font-weight: 600;">${project.title}</p>`
    const snippetArr = project.snippet.split("*")
    for (let i = 0; i < snippetArr.length; i++) {
        projectPreview += (`<p style="margin: 0px;">${snippetArr[i]}</p>`);
    }
    projectPreview += `</div>`;

    return projectPreview;
}

function goToProjectBtn(project) {
    var btn = `<div class="goToProjectBtn";> <p>Go To Project</p> </div>`

    return btn;
}

// Create the project page with templates
var currentProject;

async function loadProjectContent() {
    // Choose json file based on which page it's currently on
    var response = "";
    if (sessionStorage.currentPage == "aboutPage") {
        response = await fetch('./resources/aboutContent.json'); // Fetch the JSON file
    }
    else if (sessionStorage.currentPage == "otherWorkPage"){
        response = await fetch('./resources/otherWorkContent.json');
    }
    else {
        response = await fetch('./resources/projectContent.json'); // Fetch the JSON file
    }
    var projectSingle = await response.json(); // Convert response to a JavaScript object
    projectContent = projectSingle;

    const newElement = document.createElement("div");
    newElement.id = "templateMainProjectContent";
    newElement.innerHTML = templateProjectPage(projectSingle); 
    document.getElementById("mainContent").appendChild(newElement);
    
    document.getElementById("mainContent").addEventListener("scroll", handleScrollProjectPage);

    // Anchor menu
    attachAnchorsToMenu();

    return projectSingle;
}

// Attach img zoom listeners (called in function.js)
function attachZoomableImgEvents () {
    var zoomables = document.getElementsByClassName("zoomableImg");
    for (let i = 0; i < zoomables.length; i++) {
        // Allow for hover to zoom once image has been clicked
        // Attach to the image
        zoomables[i].addEventListener("click", (e) => {
            // One click is regular zoom
            if (zoomables[i].dataset.clicked == "false" || zoomables[i].dataset.clicked == "truetruetrue") {
                zoomables[i].dataset.clicked = "true"; 
                // Show the zoom immediately
                const { left, top, width, height } = zoomables[i].parentElement.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    zoomables[i].style.transform = `scale(2.5)`;
                    zoomables[i].style.transformOrigin = `${x}% ${y}%`;
            }
            // Two clicks is super zoom
            else if (zoomables[i].dataset.clicked == "true") {
                zoomables[i].dataset.clicked = "truetrue";
                // Show the zoom immediately
                const { left, top, width, height } = zoomables[i].parentElement.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    zoomables[i].style.transform = `scale(5.5)`;
                    zoomables[i].style.transformOrigin = `${x}% ${y}%`;
            }
            // Three clicks is reset
            else if (zoomables[i].dataset.clicked == "truetrue") {
                zoomables[i].dataset.clicked = "truetruetrue";
                // Reset the image
                setTimeout(() => {
                    zoomables[i].style.transform = "translate(0px, 0px) scale(1)";
                    zoomables[i].style.transformOrigin = "50% 50%";
                    zoomables[i].dataset.clicked = "false";
                }, 10); // Delay because otherwise overlap with mousemove event
            }
        });
        // Attach to the parent of the image (div)
        zoomables[i].parentElement.addEventListener("mousemove", (e) => {
            if (zoomables[i].dataset.clicked == "true" || zoomables[i].dataset.clicked == "truetrue" || zoomables[i].dataset.clicked == "truetruetrue") {
                const { left, top, width, height } = zoomables[i].parentElement.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                zoomables[i].style.transformOrigin = `${x}% ${y}%`;
                if (zoomables[i].dataset.clicked == "true") {
                    zoomables[i].style.transform = `scale(2.5)`; // single zoom
                }
                else {
                    zoomables[i].style.transform = `scale(5.5)`; // double zoom
                }
            }
        });
        // When the mouse leaves the parent div, reset the image and clicked data
        zoomables[i].parentElement.addEventListener("mouseleave", (e) => {
            setTimeout(() => {
                zoomables[i].style.transform = "translate(0px, 0px) scale(1)";
                zoomables[i].style.transformOrigin = "50% 50%";
                zoomables[i].dataset.clicked = "false";
            }, 10); // Delay because otherwise overlap with mousemove event
        });
    }
}

// scroll handling for the project pages
async function handleScrollProjectPage() {

    if (!handleScrollIsRunning) {
        handleScrollIsRunning = true;
        // Hiding the title section
        if (innerWidth > 700 && document.getElementById("mainContent").scrollTop > 90) {
            if (document.getElementById("mainIntroMinimised") ==  null) {
                document.getElementById("mainIntro").id = "mainIntroMinimised";
                document.getElementById("header").classList.add("headerMinimised");
                wait(50);
                handleScrollIsRunning = false;
            }
        }
        // For mobile and tablet to prevent too much jumping from hiding and showing
        else if (innerWidth <= 700 && document.getElementById("mainContent").scrollTop > 130)
        {
            if (document.getElementById("mainIntroMinimised") ==  null) {
                document.getElementById("mainIntro").id = "mainIntroMinimised";
                document.getElementById("header").classList.add("headerMinimised");
                wait(50);
                handleScrollIsRunning = false;
            }
        }
        // Showing the title section again
        else if (document.getElementById("mainContent").scrollTop < 15) {
            if (document.getElementById("mainIntro") ==  null) {
                document.getElementById("mainIntroMinimised").id = "mainIntro";
                document.getElementById("header").classList.remove("headerMinimised");
                wait(50);
                handleScrollIsRunning = false;
            }
        }
        wait(100);
        handleScrollIsRunning = false;
    }
}

// Will load the template based on the type given
function loadTemplate(type, param0 = "", param1 = "", param2 = "", param3 = "") {
    switch(type) {
        case "titleParagraph":
            return templateTitleParagraph(param0, param1);
            break;
        case "iconBox":
            return templateIconBox(param0, param1);
            break;
        case "list":
            return templateList(param0, param1);
            break;
        case "fullWidthImage":
            return templateFullWidthImage(param0, param1, param2, param3);
            break;
        case "fixedHeightImage":
            return templateFixedHeightImage(param0, param1);
            break;
        case "fixedWidthImage":
            return templateFixedWidthImage(param0, param1);
            break;
        case "expandable":
            return templateExpandable(param0, param1);
            break;
        case "embed":
            return templateEmbed(param0);
            break;
        case "fixedScrollableImage":
            return templateFixedScrollableImage(param0, param1, param2);
            break;
        case "scrollingHorizontal":
            return templateScrollingHorizontal(param0, param1);
    }
}

function templateProjectPage(projectSingle) {
    var template = "";
    var count = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    var done = false;
    var paramArray = new Array(5).fill(""); // the type + only have max 4 params so far
    //console.log(projectSingle);

    for (let key in projectSingle) {
        if (key == sessionStorage.currentPage){
            // For the summary page specifically
            if (document.querySelector('#projectSummaryBox')) {
                var projectSumItems = document.getElementById("projectSummaryBox").getElementsByClassName("projectSummaryPContent"); // For the summary section
                var projectSumItemsArray = new Array(projectSumItems.length).fill(""); // For the summary
                var projectHeroItems = new Array(2); // Only the title and the hero image
            }

            for (let key2 in projectSingle[key]) {
                // Load in the parameters for the template
                count3 = 0;
                for (let key3 in projectSingle[key][key2]) {
                    if (key2 == "hero") { // Hero section
                        projectHeroItems[count3] = projectSingle[key][key2][key3];
                    }
                    else if (key2 == "summary") { // For the summary page
                        projectSumItemsArray[count3] = projectSingle[key][key2][key3];
                    }
                    else { // For the other template items
                        paramArray[count3] = projectSingle[key][key2][key3];
                    }
                    count3++;
                }
                // Add template: Hero section
                if (key2 == "hero") {
                    document.getElementById("projectNameTitle").innerHTML = projectHeroItems[0];
                    document.getElementById("projectFeaturedImage").src = projectHeroItems[1];
                }
                // Add template: Summary section
                else if (key2 == "summary") {
                    var itemsToFill = document.getElementsByClassName("projectSummaryPContent");
                    for (let i = 0; i < projectSumItemsArray.length; i++) {
                        itemsToFill[i].innerHTML = projectSumItemsArray[i];
                    }
                }
                // Add template for rest of content
                else {
                    template += loadTemplate(paramArray[0], paramArray[1], paramArray[2], paramArray[3], paramArray[4])
                    paramArray = new Array(5).fill("");
                }
                count4++;
            }
            break;
            count2++;
        }
        count++;
    }

    return template;
}

// Template with an H2 title and p paragraph
function templateTitleParagraph(titleText, paragraphText) {
    var template = ``;
    if (titleText == "" || titleText == null) {
        template = // anchor will indicate it should be included in the anchored list
        `<div class="templateTitleParagraph">
            <h2 style="display: none;"></h2>
            <p>${paragraphText}</p>
        </div>`;
    }
    else if (paragraphText == "" || paragraphText == null) {
        template = 
        `<div class="templateTitleParagraph"> 
            <h2 class="anchor">${titleText}</h2>
            <p style="display: none;"></p>
        </div>`
    }
    else {
        template = 
        `<div class="templateTitleParagraph"> 
            <h2 class="anchor">${titleText}</h2>
            <p>${paragraphText}</p>
        </div>`
    }

    return template;
}

// Template in a box with border, an icon top left corner, and paragraph
function templateIconBox(imgSource, text) {
    var template = 
    `<div class="templateIconBox"> 
        <img src="${imgSource}" loading="lazy"/>
        <p>${text}</p>
    </div>`
    
    return template;
}

// Template with p title and list
function templateList(title, listItems) {
    var template = 
    `<div class="templateList">
        <p>${title}:</p><ul>`;
    var splitList = listItems.split("*");
    for (let i = 0; i < splitList.length; i++) {
        template += `<li>${splitList[i]}</li>`;
    }
    template += `</ul></div>`;

    return template;
}

// Template that can have 1 or more images that whose width is end-to-end of the page (no gaps)
function templateFullWidthImage(imgSrcList, captionList, noGap = false, bgColor = null) {
    console.log(noGap);
    if (!noGap) {
        var template = `<div class="templateFullWidthImage"> <div>`;
        if (bgColor != "" && bgColor != null) {
            var template = `<div class="templateFullWidthImage"> <div style="background-color:${bgColor}">`;
        }
    }
    else {
        var template = `<div class="templateFullWidthImage templateFullWidthImageNoGap"> <div>`;
        if (bgColor != "" && bgColor != null) {
            var template = `<div class="templateFullWidthImage templateFullWidthImageNoGap"> <div style="background-color:${bgColor}">`;
        }
    }
    var splitImgList = imgSrcList.split("*");
    var splitCapList = captionList.split("*");
    for (let i = 0; i < splitImgList.length; i++) {
        template += 
            `<div class="templateFullWidthImageChild">
            <img data-clicked="false" class="zoomableImg" src="${splitImgList[i]}" loading="lazy"/>`; // Allow zooming
            if (captionList[i] != "" && captionList[i] != null) {
                template += `<p>${splitCapList[i]}</p>`;
            }
        template += `</div>`;
    }

    // For the magnifying glass icon for zooming
    //template += `<div class="magnifying"><img src="resources\\templateItems\\magnifying.svg"/></div>`;

    template += `</div></div>`;

    return template;
}

// Image whose ratio remains the same, HEIGHT is fixed and width depends on the ratio
function templateFixedHeightImage(imgSrcList, captionList) {
    var template = 
    `<div class="templateFixedHeightImage"> <div>`
    var splitImgList = imgSrcList.split("*");
    var splitCapList = captionList.split("*");

    for (let i = 0; i < splitImgList.length; i++) {
        template += 
            `<div class="templateFixedHeightImageChild">
            <img data-clicked="false" class="zoomableImg" src="${splitImgList[i]}" loading="lazy"/>`;
            if (captionList[i] != "" && captionList[i] != null) {
                template += `<p>${splitCapList[i]}</p>`;
            }
        template += `</div>`;
    }
    template += `</div></div>`;

    return template;
}

// Image whose ratio remains the same, WIDTH is fixed and height depends on the ratio
function templateFixedWidthImage(imgSrcList, captionList) {
    var template = 
    `<div class="templateFixedHeightImage"> <div>`
    var splitImgList = imgSrcList.split("*");
    var splitCapList = captionList.split("*");
    for (let i = 0; i < splitImgList.length; i++) {
        template += 
            `<div class="templateFixedHeightImageChild templateFixedWidthImageChild">
            <img data-clicked="false" class="zoomableImg" src="${splitImgList[i]}" loading="lazy"/>`;
            if (captionList[i] != "" && captionList[i] != null) {
                template += `<p>${splitCapList[i]}</p>`;
            }
        template += `</div>`;
    }
    template += `</div></div>`;

    return template;
}

// Box with text that can be expanded and minimised
function templateExpandable(titleText, paragraphText) {
    // The template and also add the function directly here instead of waiting to attach first
    var template = 
    `<div class="templateExpandable" onclick="showHideTemplateExpandable(this)">
        <div class="templateExpandableTitle">
            <p>${titleText}</p>
            <img src="resources\\templateItems\\plusIcon.svg"/>
        </div>
        <div class="templateExpandableContent">
            <p>${paragraphText}</p>
        </div>
    </div>`

    return template;
}

//
function templateFixedScrollableImage(imgSrcList, captionList, xOrY) {
    var direction = "scrollableImgX";
    var message = "← Scroll Side to Side →"
    if (xOrY == "Y") {
        direction = "scrollableImgY";
        message = "Scroll Down ↓";
    }
    var template = 
    `<div class="templateFixedHeightImage" class="templateFixedScrollableImage"> <div>`
    var splitImgList = imgSrcList.split("*");
    var splitCapList = captionList.split("*");

    for (let i = 0; i < splitImgList.length; i++) {
        template += 
            `<div class="templateFixedScrollableImageChild">
            <p>${message}</p>`;
        if (captionList[i] != "" && captionList[i] != null) {
            template += `<p>${splitCapList[i]}</p>`;
        }
        template += `<div class="${direction}"> <img data-clicked="false" class="zoomableImg" src="${splitImgList[i]}" loading="lazy"/> </div>`;
            
        template += `</div>`;
    }
    template += `</div></div>`;
    return template;
}

function templateEmbed(embedCode) {
    var template =
    `<div class="templateEmbed">
        ${embedCode}
    </div>`

    return template
}

// Template with text spanning whole screen and automaticall scrolls (slowly)
function templateScrollingHorizontal(textSrcList, duration) {
    var splitText = textSrcList.split("*");
    var template = `<div class="templateScrollingHorizontalParent"><div class="templateScrollingHorizontal" style="animation-duration: ${duration}s;">`;
    for(var i = 0; i < 2; i++) {
        splitText.forEach(i => {
            template += `<p style="width: fit-content; text-wrap-mode: nowrap;">${i}</p>`;
        });
    }
    template += "</div></div>";

    return template;
}

function showHideTemplateExpandable(element) {
    if (element.querySelector(".templateExpandableContent").style.display == "none" || element.querySelector(".templateExpandableContent").style.display == "") { // First time is undefined and we know it's none by default in CSS
        element.querySelector(".templateExpandableContent").style.display = "block";
        element.querySelector(".templateExpandableContent").style.marginTop = "-0.5rem";
        element.querySelector(".templateExpandableTitle > img").src = "resources\\templateItems\\minusIcon.svg";
        element.querySelector(".templateExpandableTitle > img").style.transform = "rotate(0deg)";
        wait(50).then(() => { element.querySelector(".templateExpandableContent").style.opacity = "1"; }); // This allows for transition animation to happen
    }
    else {
        element.querySelector(".templateExpandableContent").style.opacity = "0";
        var heightToMinim = element.querySelector(".templateExpandableContent").offsetHeight;
        console.log("minus height " + heightToMinim);
        element.querySelector(".templateExpandableTitle > img").src = "resources\\templateItems\\plusIcon.svg";
        element.querySelector(".templateExpandableTitle > img").style.transform = "rotate(180deg)";
        wait(50).then(() => { element.querySelector(".templateExpandableContent").style.marginTop = heightToMinim * -1 + "px"; });
        wait(150).then(() => { element.querySelector(".templateExpandableContent").style.display = "none"; }); // wait() is already a promise   
    }
}

var allAnchorElements; // store for scrolltoview()
function attachAnchorsToMenu() {
    allAnchorElements = document.getElementsByClassName("anchor");
    // Add the anchors
    for (let i = 0; i < allAnchorElements.length; i++) {
        if (i == 0) {
            // Add back to top event for the back to top btn
            document.getElementById("anchorMenuBtnBackToTop").addEventListener( "click", () => {
                console.log(document.getElementById("mainContent").scrollTop = 0);
            });
        }
        else {
            var title = document.createElement('p');
            title.innerHTML = allAnchorElements[i].innerHTML;
            document.getElementById("anchorMenuTitles").appendChild(title);
            // Attach scroll event when a title is clicked
            title.addEventListener( "click", () => { 
                allAnchorElements[i].scrollIntoView();
                if (innerWidth > 700) {
                    document.getElementById("mainContent").scrollBy(0, -45);
                }
                else {
                    document.getElementById("mainContent").scrollBy(0, -125);
                }
            });
        }
    }
    // Toggle btn appearance and title visibility when clicked
    document.getElementById("anchorMenuBtn").addEventListener("click", (element) => { 
        document.getElementById("anchorMenuBtn").classList.toggle("anchorMenuBtnActive");
        // If hidden, show the menu
        if (document.getElementById("anchorMenuTitles").classList.contains("hidden")) {
            // Delaying for transition animation
            wait(100).then( () => { 
                document.getElementById("anchorMenuTitles").style.opacity = 1; 
                document.getElementById("anchorMenuBtnBackToTop").style.opacity = 1;
                anchorMenuTitles = true;
            });
            document.getElementById("anchorMenuTitles").classList.toggle("hidden");
            document.getElementById("anchorMenuBtnBackToTop").classList.toggle("hidden");
            // For the click outside to hide the menu
        }
        // Otherwise hide the menu
        else {
            document.getElementById("anchorMenuTitles").style.opacity = 0;
            document.getElementById("anchorMenuBtnBackToTop").style.opacity = 0;
            // Delaying for transition animation
            wait(100).then( () => { 
                document.getElementById("anchorMenuTitles").classList.toggle("hidden"); 
                document.getElementById("anchorMenuBtnBackToTop").classList.toggle("hidden");
                anchorMenuTitles = false;
            });
        }
    });
}