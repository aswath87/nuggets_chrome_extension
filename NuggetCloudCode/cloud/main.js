// Gets the next revision nugget for the user
//
Parse.Cloud.define("nextRevisionNugget", function(request, response) {
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var query = new Parse.Query(Nugget_User);
  //query.equalTo("user", Parse.User.current()).descending("updatedAt");
  //query.notEqualTo("isDeleted", true);
  query.include("nugget");
  query.find({
    success: function(results_nugget_user) {
      if (results_nugget_user.length == 0)
      {
        response.success("stay hungry, stay foolish"); 
      }
      else
      {
        response.success(results_nugget_user[Math.floor(Math.random() * results_nugget_user.length)].get("nugget").get("text")); 
      }
    }
    
  });
});
