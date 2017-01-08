$(document).ready(function(){

var my_nuggets = [];
var CURRENT_NUGGET_USER = 'currentNuggetUser';


$('#my-nuggets-table').on('click', 'a.nugget-source-link', function(event) {
  chrome.tabs.create({url: $(this).attr('href')});
  return false;
});

function initialize() {
  validateLogin();
}

function goToLoginPage()
{
  window.location.replace('login.html');
}

function addHighlightMarkup(text, highlightText)
{
  var highlightIndex = text.toLowerCase().indexOf(highlightText);
  var return_markup = "";
  var endOfPreviousHighlightIndex = highlightIndex;
  if (highlightText && highlightIndex != -1)
  {
    return_markup += text.substring(0, highlightIndex);
    do {
      return_markup += '<span class="highlight">' + text.substring(highlightIndex, highlightIndex + highlightText.length) + '</span>';
      endOfPreviousHighlightIndex = highlightIndex + highlightText.length;
      highlightIndex = text.toLowerCase().indexOf(highlightText, highlightIndex + highlightText.length);
      if (highlightIndex == -1)
      {
        break;
      }
      return_markup += text.substring(endOfPreviousHighlightIndex, highlightIndex);
    } while (text.length >= endOfPreviousHighlightIndex + highlightText.length)
    return_markup += text.substring(endOfPreviousHighlightIndex);
    return return_markup;
  }
  return text;
}

function updateMyNuggetsMarkup(results, highlightText)
{
  var my_nuggets_markup = [];
  for(i=0;i<results.length;i++)
  {
    var markup_to_push = '<tr><td><div id="' + results[i].id + '" class="nugget-wrapper"><p>' + addHighlightMarkup(results[i].text, highlightText);
    var tags = results[i].tags;
    for (j=0;j<tags.length;j++)
    {
      markup_to_push += ' <span class="nugget-tag">' + addHighlightMarkup('#' + tags[j], highlightText) + '</span>';
    }
    markup_to_push += '</p>'
    if (results[i].url && results[i].url != "")
    {
      markup_to_push += '<p><a href="' + results[i].url + '" class="nugget-source-link">' + addHighlightMarkup(results[i].source, highlightText) + '</a></p>';
    }
    else if (results[i].source != "")
    {
      markup_to_push += '<p class="gray">' + addHighlightMarkup(results[i].source, highlightText) + '</p>';
    }
    var timeAgo = moment(results[i].updatedAt).fromNow();
    if (moment().diff(results[i].updatedAt) < 0)  // Parse seems to set updatedAt a couple seconds into the future, so preventing the time-ago tag from saying "in a few seconds"
    {
      timeAgo = moment().fromNow();
    }
    markup_to_push += '<div class="row-fluid"><span class="nugget-time-ago span10">' + timeAgo + '</span>';
    markup_to_push += '<span class="span1 pull-right nugget-action-icons" style="display: none;"><i class="icon-trash nugget-action-icon"></i></span>';
    markup_to_push += '</div></div></td></tr>';
    my_nuggets_markup.push(markup_to_push);
  }
  $('#my-nuggets-table').html(my_nuggets_markup.join(''));
}

function getCurrentUserToken() {
    return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['token'];
}

function getCurrentUserId() {
    return JSON.parse(localStorage.getItem(CURRENT_NUGGET_USER))['userId'];
}

function doesUserCurrentExist() {
  return localStorage.getItem(CURRENT_NUGGET_USER);
}

function removeUserObjectFromLocalStorage() {
  localStorage.removeItem(CURRENT_NUGGET_USER);
}

function runQuery()
{
  var token = getCurrentUserToken();
  var userId = getCurrentUserId();
  $.ajax({
    url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets",
    type: 'GET',
    dataType: 'json',
    headers:{'Authorization':'Token ' + token},
    success: function(results_nugget_user) {
      if (results_nugget_user.length == 0)
      {
        $('#my-nuggets-table').html('<p>none</p>');
        $('#my-nuggets-search-div').css('display','none');
      }
      else
      {
        my_nuggets = $.map(results_nugget_user, function(nugget) {
          var return_object = {};
          return_object.id = nugget.id;
          return_object.text = nugget.text;
          if (!nugget.tags)
          {
              return_object.tags = [];
          }
          else
          {
              return_object.tags = nugget.tags;
          }
          return_object.url = nugget.url;
          return_object.source = nugget.source;
          return_object.updatedAt = nugget.updatedAt;
          return return_object;
        });
        updateMyNuggetsMarkup(my_nuggets);
        $('#my-nuggets-search-div').css('display','block');
      }
    }
  });
}

function executeSearch()
{
  var searchText = $('#my-nuggets-search').val().toLowerCase();
  my_nuggets_search_results = [];
  for(i=0;i<my_nuggets.length;i++)
  {
    var indexOfSearchText = my_nuggets[i].text.toLowerCase().indexOf(searchText);
    if (indexOfSearchText != -1)
    {
      my_nuggets_search_results.push(my_nuggets[i]);
    }
    else
    {
      indexOfSearchText = my_nuggets[i].source.toLowerCase().indexOf(searchText);
      if (indexOfSearchText != -1)
      {
        my_nuggets_search_results.push(my_nuggets[i]);
      }
      else
      {
        for(j=0;j<my_nuggets[i].tags.length;j++)
        {
          indexOfSearchText = ('#' + my_nuggets[i].tags[j]).toLowerCase().indexOf(searchText);
          if (indexOfSearchText != -1)
          {
            my_nuggets_search_results.push(my_nuggets[i]);
            break;
          }
        }
      }
    }
  }
  updateMyNuggetsMarkup(my_nuggets_search_results, searchText);
}

$('#my-nuggets-search').on('input', function()
{
  executeSearch();
});

$('#my-nuggets-search-clear').click(function()
{
  $('#my-nuggets-search').val("");
  $('#my-nuggets-search').focus();
  executeSearch();
});

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
  nugget_div.fadeTo(500, 0.2);
  var nuggetId = nugget_div.attr('id');
  var token = getCurrentUserToken();
  var userId = getCurrentUserId();

  $.ajax({
    url: "https://nuggets-django.herokuapp.com/api/v0/user/" + userId + "/nuggets/" + nuggetId + "/",
    type: 'DELETE',
    dataType: 'json',
    headers:{'Authorization':'Token ' + token},
      success: function() {
        runQuery();
      },
      error: function() {
        nugget_div.fadeTo(200, 1.0);
      }
    });
});

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

$('#logout-button').click(function()
{
  removeUserObjectFromLocalStorage();
  goToLoginPage();
});

});
