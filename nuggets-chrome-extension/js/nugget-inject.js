

var strVar="";
strVar += "<div id=\"myCarousel\" class=\"carousel slide\"> ";
strVar += "  <ol class=\"carousel-indicators\"> ";
strVar += "    <li data-target=\"#myCarousel\" data-slide-to=\"0\" class=\"active\"><\/li>";
strVar += "    <li data-target=\"#myCarousel\" data-slide-to=\"1\"><\/li>";
strVar += "    <li data-target=\"#myCarousel\" data-slide-to=\"2\"><\/li>";
strVar += "  <\/ol>";
strVar += "  <!-- Carousel items -->";
strVar += "  <div class=\"carousel-inner\">";
strVar += "    <div class=\"active item\">Work on your personal infrastructure<\/div>";
strVar += "    <div class=\"item\">Have fun, be happy, spread the joy.<\/div>";
strVar += "    <div class=\"item\">Stay hungry, stay foolish<\/div>";
strVar += "  <\/div>";
strVar += "  <!-- Carousel nav -->";
strVar += "  <a class=\"carousel-control left\" href=\"#myCarousel\" data-slide=\"prev\">&lsaquo;<\/a>";
strVar += "  <a class=\"carousel-control right\" href=\"#myCarousel\" data-slide=\"next\">&rsaquo;<\/a>";
strVar += "<\/div>";

strVar="";
strVar += "<div id=\"nugget-review\">";
strVar += "<a data-feed-post-link=\"\" >";
strVar += "<small>";
strVar += "<span data-feed-post-date=\"%m %d\">Nugg from Jun 14 2013<\/span>";
strVar += "<\/small>";
strVar += "<h3 data-feed-post-title=\"\">Have fun, be happy, spread the joy<\/h3>";
strVar += "<\/a><\/div>";

alert("hello"); 
alert(window.name); 
$(strVar).insertAfter('#subscribe-banner');