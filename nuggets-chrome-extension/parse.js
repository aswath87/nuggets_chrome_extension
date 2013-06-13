Parse.initialize("sKtmhxM9qK4VPgdJ8s1speUjACWy49U18mB6BlJY", "rTgoaqx3zjpZ4TPwuWlUa7niqvVxR6QMWtdENsET");
    
var Nugget = Parse.Object.extend("Nugget");
var nuggetObject = new Nugget();
  nuggetObject.save({Content: "ChromeTest", Source: "URLChrome", Tag: "ChromeTag"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});
