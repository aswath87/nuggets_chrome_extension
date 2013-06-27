$(document).ready(function(){

$('#my-nuggets-table').on('click', 'a.nugget-source-link', function(event) {
  chrome.tabs.create({url: $(this).attr('href')});
  return false;
});

function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function sortNuggetsDescendingByUpdatedAt(a, b)
{
  return ((a.updatedAt > b.updatedAt) ? -1 : ((a.updatedAt < b.updatedAt) ? 1 : 0));
}

// function migrationCode()
// {
//   var Nugget = Parse.Object.extend("Nugget");
//   var query = new Parse.Query(Nugget);
//   query.ascending("updatedAt");
//   query.find({
//     success: function(results) {
//       for(i=0;i<results.length;i++)
//       {
//         var Nugget_User = Parse.Object.extend("Nugget_User");
//         var nugget_user = new Nugget_User();
//         nugget_user.save({
//           nugget: results[i],
//           user: Parse.User.current(),
//           isOwner: true
//         });
//       }
//     }
//   });
// }

function runQuery()
{
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var query = new Parse.Query(Nugget_User);
  query.equalTo("user", Parse.User.current()).descending("updatedAt");
  query.notEqualTo("isDeleted", true);
  query.include("nugget");
  query.find({
    success: function(results_nugget_user) {
      if (results_nugget_user.length == 0)
      {
        $('#my-nuggets-table').html('<p>none</p>');
      }
      else
      {
        var my_nuggets = [];
        var results = $.map(results_nugget_user, function(n) {
          return n.get("nugget");
        });
        // results.sort(sortNuggetsDescendingByUpdatedAt); // should sort by nugget_user updatedAt rather than nugget's
        for(i=0;i<results.length;i++)
        {
          var markup_to_push = '<tr><td><div id="' + results[i].id + '" class="nugget-wrapper"><p>' + results[i].get("text");
          var tags = results[i].get("tags");
          for (j=0;j<tags.length;j++)
          {
            markup_to_push += ' <span class="nugget-tag">#' + tags[j] + '</span>';
          }
          markup_to_push += '</p>'
          if (results[i].get("url") && results[i].get("url") != "")
          {
            markup_to_push += '<p><a href="' + results[i].get("url") + '" class="nugget-source-link">' + results[i].get("source") + '</a></p>';
          }
          else if (results[i].get("source") != "")
          {
            markup_to_push += '<p class="gray">' + results[i].get("source") + '</p>';
          }
          var timeAgo = moment(results[i].updatedAt).fromNow();
          if (moment().diff(results[i].updatedAt) < 0)  // Parse seems to set updatedAt a couple seconds into the future, so preventing the time-ago tag from saying "in a few seconds"
          {
            timeAgo = moment().fromNow();
          }
          markup_to_push += '<div class="row-fluid"><span class="nugget-time-ago span10">' + timeAgo + '</span>';
          markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-trash nugget-action-icon"></i></span>';
          markup_to_push += '</div></div></td></tr>';
          my_nuggets.push(markup_to_push);
        }
        $('#my-nuggets-table').html(my_nuggets.join(''));
      }
    }
  });
}

$('#my-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#my-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

$('#my-nuggets-table').on('click', '.icon-trash', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  // nugget_div.prop('disabled', true);
  var nugget_id = nugget_div.attr('id');
  var Nugget = Parse.Object.extend("Nugget");
  var query = new Parse.Query(Nugget);
  query.get(nugget_id).then(function(nugget) {
    var Nugget_User = Parse.Object.extend("Nugget_User");
    var query2 = new Parse.Query(Nugget_User);
    query2.equalTo("user", Parse.User.current());
    query2.equalTo("nugget", nugget);
    query2.first().then(function(nugget_user) {
      nugget_user.set("isDeleted", true);
      nugget_user.save();
    }, function(error) {
      // nugget_div.prop('disabled', false);
    }).then(function() { // after nugget_user has been updated to isDeleted=true
      runQuery();
    });
  }).then(function() { // in case nugget gets deleted and the query.get(nugget_id) fails, should refresh my nuggets
    runQuery();
  });
});

function validateLogin() {
  var currentUser = Parse.User.current();
  if (!currentUser)
  {
    goToLoginPage();
  }
  else
  {
    $('#extension-container').css('display','block');
    runQuery();
    // migrationCode();
  }
}

initialize();

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
