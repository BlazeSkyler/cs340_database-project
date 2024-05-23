window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    // only show table on load
    window.addEventListener("load", function() {showform(display)});

    // show form when user clicks button
    const newButton = document.getElementById("new-button");
    newButton.addEventListener("click", function() {
        showform("insert")
    });

    // cancel button in forms
    const cancelButtons = document.querySelectorAll(".cancel");
    cancelButtons.forEach(function(cancel) {
        cancel.addEventListener("click", function() {
            showform("display");
        })
    })
}

function showform(selected) {
    const insert = document.getElementById("insert");
    const view = document.getElementById("display");
    const edit = document.getElementById("edit");

    if (selected == "insert") {
        insert.style.display = "block";
        view.style.display = "block";
        edit.style.display = "block";
    }
    else {
        insert.style.display = "none";
        view.style.display = "block";
        edit.style.display = "block";
    }
}