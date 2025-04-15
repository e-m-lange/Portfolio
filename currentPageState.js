var currentPage = ""; // *changed to sessionStorage* Use this to access the right page content, upon loading the html fill this in
var projects; // from the loaded projects of json
var projectContent; // for the single project page
var currOpenedProjectNum; // numbers 0-4 at the moment
let projectKeys = new Array(7); // for easy access of json dictionary
var projectCardIsSelected = false; // Used to track deselecting a project card (when click happens on document)
var anchorMenuTitles = false; // Used to track if the anchor menu is opened or not
var aboutThisSiteSelected = false; // Use to track is about this site is open or not

var welcomeSectionTitleDefault = "Welcome!";
var welcomeSectionPDefault = "I'm a UX/UI designer in Sweden from Hong Kong focused on digital experiences. Always ready to say \"Let's try it!\"";

var isHostedOnGithub = false; // Temporary workaround solution
var customVh; // Especially for mobile screen
var vhDifference; // Deals with the difference caused by extra browser bar