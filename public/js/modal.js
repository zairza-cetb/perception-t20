$(document).ready(function() {
  window.mod = $(".mod");

  $(".evbtn").click(function(event) {
    window.currentItem = $(event.target).parent();
    // console.log("clicked", currentItem);
    if (!$(mod).hasClass("mod--show")) {
      let eventID = $(currentItem).attr("data-id")
      mod.eventID = eventID;
      let coverURL = `/assets/img/poster/${eventID}.jpg`;
      let title = $(currentItem).attr("data-title");
      let desc = $(currentItem).attr('data-desc');
      let link = $(currentItem).attr('data-link');

      $("#mod__cover").attr("src", "/assets/img/alt.jpeg");

      // Check if the user is already registered for the event
      // and set the function of the button as required
      fetch(`/chregister/${eventID}`).then(function(res) {
        return res.text();
      }).then(function(message) {
        let buttonText;
        // console.log(message);
        if (message == "T") {

          // Make the button into a Unregister button
          buttonText = "Unregister";
          $("#regbtn")
            .removeClass("btn-success")
            .addClass("btn-danger")
            .text(buttonText)
            .removeClass("hide");
        } else {

          // Make the button into a Register button
          buttonText = "Register";
          $("#regbtn")
            .removeClass("btn-danger")
            .addClass("btn-success")
            .text(buttonText)
            .removeClass("hide");
        }
        // $("#regbtn").text(buttonText);
        // $("#regbtn").removeClass("hide");
      });
      // console.log("clicked", title, coverURL, desc);

      // Add a cover image, title and description to the modal
      $("#mod__cover").attr("src", coverURL);
      $("#mod__title").text(title);
      $("#mod__desc").text(desc);
    } else {

      // When the modal closes, remove both classes and hide the button
      $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");


      // Remove the previously linked cover image
      // $("#mod__cover").attr("src", "/assets/img/alt.jpeg");

      // Empty the title and description
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
    }

    // console.log("btn clicked");

    // Show the modal
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
  });

  $(".overlay").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
    $("#regbtn").addClass("hide");


    $("#regbtn").removeClass("btn-success").removeClass("btn-danger");
    // $("#mod__cover").attr("src", "/assets/img/alt.jpeg");
    $("#mod__title").text("Loading...");
    $("#mod__desc").text("");
  });

  $(".mod__close").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
    $("#regbtn").addClass("hide");


    $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");
      // $("#mod__cover").attr("src", "/assets/img/alt.jpeg");
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
  });

  $("#regbtn").click(function() {

    // Disable the button after it is clicked
    $("#regbtn").attr("disabled", true);
    $("#regbtn")
      .addClass("hide")
      .removeClass("btn-success")
      .removeClass("btn-danger");

    if ($("#regbtn").text() == "Register") {

      // If the button says Register
      // make a GET request to the register route
      fetch(`/register/${mod.eventID}`).then(function(res) {
        return res.text();
      })
      .then(function(data) {

        if (data == "T") { // If Registered successfully

          // Change text to Unregister
          $("#regbtn").text("Unregister");
          $("#regbtn").addClass("btn-danger");
          $("#mod__link").text(link);
          $("#mod__link").attr("href",link);
        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");

      })
    } else if ($("#regbtn").text() == "Unregister") {

      // If the button says Unregister
      // make a GET request to the unregister route
      fetch(`/unregister/${mod.eventID}`).then(function(res) {

        return res.text();
      }).then(function(data) {

        if (data == "T") { // If Unregistered successfully

          // Change text to Unregister
          $("#regbtn").text("Register");
          $("#regbtn").addClass("btn-success");
        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");
      })
    }
  });
});
