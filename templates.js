// template for the preview cards on the homepage
function templateHomepagePreview(project) {
    var projectPreview = 
    `<div class="projectPreview" style="position: absolute; overflow: hidden; width: 310px; height: 140px; border-radius: 20px; box-shadow: 0px 0px 8px #18414126 inset; z-index: -1;">
            <img style="max-width: 255px; height: auto; margin-left: 85px; box-shadow: 0px 0px 6px #00000066;" src="./resources/${project.imgUrl}"/>
        </div>
        <div style="pointer-events: none; position: absolute; overflow: hidden; width: 160px; background: white; padding: 10px; margin: 14px; border-radius: 12px; box-shadow: 0px 0px 12px #18414166;">
            <p style="margin: 0px; font-weight: 600;">${project.title}</p>`
    const snippetArr = project.snippet.split("*")
    for (let i = 0; i < snippetArr.length; i++) {
        projectPreview += (`<p style="margin: 0px;">${snippetArr[i]}</p>`);
    }
    projectPreview += `</div>`;

    return projectPreview;
}