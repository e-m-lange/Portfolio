var currentPage = "";
var projects; // from the loaded projects of json
var currOpenedProjectNum; // numbers 0-4 at the moment
let projectKeys = new Array(7); // for easy access of json dictionary
var projectCardIsSelected = false; // Used to track deselecting a project card (when click happens on document)

var welcomeSectionTitleDefault = "Welcome!";
var welcomeSectionPDefault = "I'm a UX/UI designer based in Sweden from Hong Kong with a focus on digital experiences, and always ready to say: \"Let's try it out!\"";