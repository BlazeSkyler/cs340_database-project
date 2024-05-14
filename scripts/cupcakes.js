window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    // only show table on load
    window.addEventListener("load", function() {showform(display)});

    // show form when user clicks button
    const newButton = document.getElementById("new-button");
    const editButton = document.querySelectorAll("#edit-button");
    const delButton = document.querySelectorAll("#del-button");
    newButton.addEventListener("click", function() {
        showform("insert")
    });
    editButton.forEach(function(button) {
        button.addEventListener("click", function() {
            showform("edit");
        });
    })
    delButton.forEach(function(button) {
        button.addEventListener("click", function() {
            showform("del");
        });
    })


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
    const del = document.getElementById("delete");

    if (selected == "insert") {
        insert.style.display = "block";
        view.style.display = "block";
        edit.style.display = "none";
        del.style.display = "none";
    }
    else if (selected == "edit") {
        insert.style.display = "none";
        view.style.display = "none";
        edit.style.display = "block";
        del.style.display = "none";
    }
    else if (selected == "del") {
        insert.style.display = "none";
        view.style.display = "none";
        edit.style.display = "none";
        del.style.display = "block";
    }
    else {
        insert.style.display = "none";
        view.style.display = "block";
        edit.style.display = "none";
        del.style.display = "none";
    }
}