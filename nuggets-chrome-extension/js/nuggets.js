$(document).ready(function(){

function initialize() {
  chrome.tabs.getSelected(null, function(tab) {
    $(".prepopulate").val(tab.title);
  });
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}
function goToLoginPage()
{
  window.location.replace('login.html');
}

function goToNuggetPage()
{
  window.location.replace('nuggets.html');
}

function validateLogin() {
  var currentUser = Parse.User.current();
  if (!currentUser)
  {
    goToLoginPage();
  }
  else
  {
    document.getElementById("extension-container").style.display = "block";
  }
}

initialize();

// function runQuery() {
//   var Nugget = Parse.Object.extend("Nugget");
//   var query = new Parse.Query(Nugget).equalTo("Source",$(".prepopulate").val()).descending("createdAt");

//   query.find({
//     success: function(results) {
//       var query_results = [];
//       for(i=0;i<results.length;i++)
//       {
//         query_results.push('<div class="nugget-tile">' + '<div class="nugget-content">' + results[i].get("Content") + "</div>" + '<div class="nugget-add"><img class="follow-image" src="plus.png" /></div></div>');
//       }
//       $('#query').html(query_results.join(''));    
//     },
//     error: function(error) {
//       alert("error");
//       $(".error").show();
//     }
//   });
// }

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
