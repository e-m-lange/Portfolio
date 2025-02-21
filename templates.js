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