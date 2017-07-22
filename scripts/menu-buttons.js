/*** MENU BUTTONS ***/
function openNav() {
    $("#side-menu").css("width", "300px");
}

function closeNav() {
    $("#side-menu").css("width", "0");
}

function showRedPage() {
    if ($("body").hasClass("bg-purple")) {
        // hide 'purple page' content
        $("#purple-content").attr("hidden", true);
        $("body").toggleClass("bg-red bg-purple");
        // show 'red page' content again:
        $("#red-content").show();
    }
}