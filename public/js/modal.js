$(document).ready(function() {
  window.mod = $(".mod");

  $(".btn").click(function(event) {
    window.currentItem = $(event.target).parent();
    console.log("clicked", currentItem);
    if (!$(mod).hasClass("mod--show")) {
      let coverURL = `/assets/img/poster/${$(currentItem).attr("data-id")}.png`;
      let title = $(currentItem).attr("data-title");
      let desc =
        $(currentItem)
          .children(".event__desc")
          .text() || "lorem ipsum";
      console.log("clicked", title, coverURL, desc);
      $("#mod__cover").attr("src", coverURL);
      $("#mod__title").text(title);
      $("#mod__desc").text(desc);
    }

    console.log("btn clicked");
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
  });

  $(".overlay").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
  });

  $(".mod__close").click(function() {
    $(mod).toggleClass("mod--show");
    $("body").toggleClass("hide-overflow");
  });
});
