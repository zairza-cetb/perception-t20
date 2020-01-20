$(document).ready(function() {
    // Check if the user was sent here from another page
    if (document.referrer !== "") {

        // Get the path component of the previous page
        let pathname = (new URL(document.referrer)).pathname;

        // Set the ref query parameter
        $("form").attr("action", `${window.location.href}?ref=${pathname}`);
    }
});