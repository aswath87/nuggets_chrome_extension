$(document).ready(function(){

var welcome_nuggets = [];
var welcome_nuggets_to_show = 5;
var next_welcome_nugget_index = 0;

function initialize() {
  Parse.initialize("F1fRCfIIYQzvft22ckZd5CdrOzhVecTXkwfgWflN", "DUoWr9lIjQME2MmqgMApFmWFdzMcl7B6mKfj8AAc");
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function updateWelcomeNuggetsMarkup()
{
  var welcome_nuggets_markup = [];
  next_welcome_nugget_index = Math.min(welcome_nuggets_to_show, welcome_nuggets.length);
  for(i=0;i<next_welcome_nugget_index;i++)
  {
    var markup_to_push = '<tr><td><div id="' + welcome_nuggets[i].id + '" class="nugget-wrapper row-fluid"><div class="span11"><p>' + welcome_nuggets[i].get("text") + " ";
    var tags = welcome_nuggets[i].get("tags");
    if (tags)
    {
      for (j=0;j<tags.length;j++)
      {
        markup_to_push += '<span class="nugget-tag">#' + tags[j] + '</span> ';
      }
    }
    markup_to_push += '</p></div>';
    markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-plus nugget-action-icon"></i></span>';
    markup_to_push += '</div></td></tr>';
    welcome_nuggets_markup.push(markup_to_push);
  }
  $('#welcome-nuggets-table').html(welcome_nuggets_markup.join(''));
  $('#welcome-nuggets-div').css("display", "block");
}

function runQuery()
{
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var User = Parse.Object.extend("User");
  var user = new User();
  user.id = "fyudoOXYX2";
  var query = new Parse.Query(Nugget_User);
  query.equalTo("user", user);
  query.notEqualTo("isDeleted", true).ascending("updatedAt").limit(20);
  query.include("nugget");
  query.find().then(function(results) {
    console.log('results: ' + results.length);
    if (results.length == 0)
    {
      $('#welcome-nuggets-div').css("display", "none");
    }
    else
    {
      results = results.sort(function() { return 0.5 - Math.random();}); // randomize array
      /*for (result in results)
      {
        welcome_nuggets.push(result.get("nugget"));
      }*/
      welcome_nuggets = $.map(results, function(nugget_user) {
          return nugget_user.get("nugget");
      });
      updateWelcomeNuggetsMarkup();
    }
  });
}

$('#welcome-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#welcome-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

$('#welcome-nuggets-table').on('click', '.icon-plus', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  var nugget_id = nugget_div.attr('id');
  var Nugget = Parse.Object.extend("Nugget");
  var nugget = new Nugget();
  nugget.id = nugget_id;
  var Nugget_User = Parse.Object.extend("Nugget_User");
  var query = new Parse.Query(Nugget_User);
  query.equalTo("user", Parse.User.current());
  query.equalTo("nugget", nugget);
  query.find().then(function(nugget_users) {
    if (!nugget_users || nugget_users.length == 0)
    {
      var nugget_user = new Nugget_User();
      nugget_user.save({
        nugget: nugget,
        user: Parse.User.current()
      });
    }
    else if (nugget_users.length == 1 && nugget_users[0].get("isDeleted") == true)
    {
      var nugget_user = nugget_users[0];
      nugget_user.set("isDeleted", false);
      nugget_user.save();
    }
  });
  $(this).prop('class','icon-ok');
  nugget_div.fadeTo(1000, 0.2, function() {
    for(i=0;i<welcome_nuggets.length;i++)
    {
      if(welcome_nuggets[i].id == nugget_id)
      {
         welcome_nuggets.splice(i, 1);
         updateWelcomeNuggetsMarkup();
         break;
      }
    }
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
    runQuery();
  }
}

initialize();

});
