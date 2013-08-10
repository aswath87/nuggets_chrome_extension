function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  
}

initialize(); 
Parse.Cloud.run('nextRevisionNugget', { }, {
  success: function(text) {
    var nuggetText = text;
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
    strVar += "<div class=\"\" id=\"nugget-review\">";
    strVar += "<div id =\"nugget-text\">" + nuggetText + "<\/div>"; //Right apology - express regret, accept responsibility, commit to making it right, genuinely repent, request forgiveness<\/h3>";
    strVar += "<div id = \"nugget-meta\">Nugg from Jun 14 2013<\/div>";
    strVar += "<\/div>";
    
    $('body').prepend(strVar);
    $(strVar).insertAfter('#subscribe-banner');
  },
  error: function(error) {
    nuggetText = error; 
  }
});
