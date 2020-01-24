$(document).ready(function() {

    window.getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Check if the user was sent here from another page
    let ref = getParameterByName('ref'), refpath
    if (ref !== undefined && ref !== null) {

        // Check query parameters for referrer
        refpath = ref;
    } else if (document.referrer !== undefined && document.referrer !== null && document.referrer !== '') {

        // Otherwise get the path component of the previously visited URL
        refpath = (new URL(document.referrer)).pathname.slice(1);
    }else {
        refpath = '';
    }
    console.log('reff',refpath);
    // Set the ref query parameter for the submit action
    $("form").attr("action", `${window.location.pathname}?ref=${refpath}`);

    // Set the ref query parameter for links to login/register page
    $("[href*='/login']").attr("href", `/login?ref=${refpath}`);
    $("[href*='/register']").attr("href", `/register?ref=${refpath}`);
    $(".forgot-link").attr("href", `/forgotpassword?ref=${refpath}`);
});