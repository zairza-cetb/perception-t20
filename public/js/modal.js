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
      let date_time = $(currentItem).attr('data-date_time');
      let venue = $(currentItem).attr('data-venue');
      let rule_link = $(currentItem).attr('data-rule_link');
      let form_link = $(currentItem).attr('data-form_link');
      // (rule_link === "")?(rule_link = '#'):(rule_link=rule_link);

      $("#mod__cover").attr("src", "/assets/img/alt.jpeg");

      // Check if the user is already registered for the event
      // and set the function of the button as required
      fetch(`/chregister/${eventID}`).then(function(res) {
        if (res.ok) {
        return res.text();
        } else {
          return "E";
        }
      }).then(function(message) {
        let buttonText;
        if (message == "T") {

          // Make the button into a Unregister button
          buttonText = "Unregister";
          $("#regbtn")
            .removeClass("btn-success")
            .addClass("btn-danger")
            .text(buttonText)
            .removeClass("hide");
          $("#mod__form_desc").addClass("show");
          $("#mod__form_link").attr("href",form_link);  
        } else {

          // Make the button into a Register button
          buttonText = "Register";
          $("#regbtn")
            .removeClass("btn-danger")
            .addClass("btn-success")
            .text(buttonText)
            .removeClass("hide");
            $("#mod__form_desc").addClass("hide");
        }
      });


      // Add a cover image, title and description to the modal
      $("#mod__cover").attr("src", coverURL);
      $("#mod__title").text(title);
      $("#mod__desc").text(desc);
      $("#mod__date_time_venue").html("<strong>Slot :</strong> "+date_time+"  <strong>Venue :</strong>" + venue);
      $('#mod__rule_link').attr("href",rule_link);
      console.log(rule_link); 
      $('#downloadbtn').click(function(){
        
        if(rule_link === '#'){
          Toast.fire({
            icon: "info",
            title: "Sorry, Rule are not available yet."
          });
        }else{
          window.location.href=rule_link;
        }
      });
      $('#formbtn').click(function(){
        if(rule_link === '#'){
          Toast.fire({
            icon: "info",
            title: "Sorry, Forms are not available yet."
          });
        }else{
          window.location.href=rule_link;
        }
      });
    } else {

      // When the modal closes, remove both classes and hide the button
      $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");


      // Remove the previously linked cover image
      // $("#mod__cover").attr("src", "/assets/img/alt.jpeg");

      // Empty the title and description
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
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
    $("#mod__date_time_venue").html("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
  });

  $(".mod__close").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
    $("#regbtn").addClass("hide");


    $("#regbtn").removeClass("btn-success").removeClass("btn-danger").addClass("hide");

      // $("#mod__cover").attr("src", "/assets/img/alt.jpeg");
      $("#mod__title").text("Loading...");
      $("#mod__desc").text("");
      $("#mod__date_time_venue").text("<strong>Slot :</strong> Loading...  <strong>Venue :</strong> Loading..." );
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
        if (res.ok) {
          return res.text();
          } else {
            return "E";
          }
      })
      .then(function(data) {

        if (data == "T") { // If Registered successfully

          // Change text to Unregister
          $("#regbtn").text("Unregister");
          $("#regbtn").addClass("btn-danger");
          $("#mod__form_desc").addClass("show");
          $("#mod__form_link").attr("href",form_link); 
          
        } else {
          // Change text back to Register
          $("#regbtn").text("Register");
          $("#regbtn").addClass("btn-success");
          $("#mod__form_desc").addClass("hide");
        }

        if (data == "E") {
          // Close the modal
          $(mod).toggleClass("mod--show");
          $("body").toggleClass("hide-overflow");
          // Notify errors
          Toast.fire({
            icon: "info",
            title: "Sorry, we couldn't do that. Please reload the page."
          });

        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");

      })
    } else if ($("#regbtn").text() == "Unregister") {

      // If the button says Unregister
      // make a GET request to the unregister route
      fetch(`/unregister/${mod.eventID}`).then(function(res) {

        if (res.ok) {
          return res.text();
          } else {
            return "E";
          }
      }).then(function(data) {

        if (data == "T") { // If Unregistered successfully

          // Change text to Register
          $("#regbtn").text("Register");
          $("#regbtn").addClass("btn-success");
        } else {
          // Change text back to Unregister
          $("#regbtn").text("Unregister");
          $("#regbtn").addClass("btn-danger");
        }

        if (data == "E") {
          // Close the modal
          $(mod).toggleClass("mod--show");
          $("body").toggleClass("hide-overflow");
          // Notify errors
          Toast.fire({
            icon: "info",
            title: "Sorry, we couldn't do that. Please reload the page."
          });
        }

        // Enable the button
        $("#regbtn").attr("disabled", false);
        $("#regbtn").removeClass("hide");
      })
    }
  });
});
