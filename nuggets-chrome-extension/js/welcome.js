$(document).ready(function(){

var welcome_nuggets = [];
var welcome_nuggets_to_show = 3;
var next_welcome_nugget_index = 0;
var CURRENT_NUGGET_USER = 'currentNuggetUser';

function initialize() {
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
  var userId = "fyudoOXYX2"; // TODO once data is migrated, we need to make a call to find the token for this user. Until then, this won't work!!
  var token = 'GET FROM API using /api-token-auth with username and password';
  $.ajax({
    url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets",
    type: 'GET',
    dataType: 'json',
    headers:{'Authorization':'Token ' + token},
    success: function(results) {
      console.log('results: ' + results.length);
      if (results.length == 0) {
        $('#welcome-nuggets-div').css("display", "none");
      }
      else {
        results = results.sort(function () {
          return 0.5 - Math.random();
        }); // randomize array

        welcome_nuggets = $.map(results, function (nugget) {
          return nugget;
        });
        updateWelcomeNuggetsMarkup();
      }
    }}
  );
}

$('#welcome-nuggets-table').on('mouseenter', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','block');
});

$('#welcome-nuggets-table').on('mouseleave', 'tr', function()
{
  $(this).find('.nugget-action-icons').css('display','none');
});

function getCurrentUserToken() {
  return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['token'];
}

function getCurrentUserId() {
  return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['userId'];
}

$('#welcome-nuggets-table').on('click', '.icon-plus', function()
{
  var nugget_div = $(this).parents('.nugget-wrapper');
  var nugget_id = nugget_div.attr('id');

  var userId = "fyudoOXYX2"; // TODO once data is migrated, we need to make a call to find the token for this user. Until then, this won't work!!
  var token = 'GET FROM API using /api-token-auth with username and password';
  $.ajax({
    url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets/" + nugget_id + "/",
    type: 'GET',
    dataType: 'json',
    headers:{'Authorization':'Token ' + token},
    success: function(nugget_from_famous_person) {
      // copy nugget from famous person into current user:
      var currentUserId = getCurrentUserId();
      var currentUserToken = getCurrentUserToken();
      var dataMap = { text : nugget_from_famous_person.text, tags : nugget_from_famous_person.tags, source : nugget_from_famous_person.source };
      $.ajax({
        url: "https://nuggets-django.herokuapp.com/api/v0/user/" + currentUserId + "/",
        data: dataMap,
        type: 'POST',
        dataType: 'json',
        headers:{'Authorization':'Token ' + currentUserToken},
        });
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

function doesUserCurrentExist() {
  return localStorage.getItem(CURRENT_NUGGET_USER);
}

function validateLogin() {
  if (!doesUserCurrentExist())
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
