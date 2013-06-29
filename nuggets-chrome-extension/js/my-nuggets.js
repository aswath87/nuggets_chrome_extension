$(document).ready(function(){

var my_nuggets = [];

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
        var results = $.map(results_nugget_user, function(nugget_user) {
          var nugget = nugget_user.get("nugget");
          var return_object = new Object();
          return_object.id = nugget.id;
          return_object.text = nugget.get("text");
          if (!nugget.get("tags"))
          {
            return_object.tags = [];
          }
          else
          {
            return_object.tags = nugget.get("tags");
          }
          return_object.url = nugget.get("url");
          return_object.source = nugget.get("source");
          return_object.isOwner = nugget_user.get("isOwner");
          return_object.updatedAt = nugget_user.updatedAt;
          return return_object;
        });
        my_nuggets = results;
        updateMyNuggetsMarkup(my_nuggets);
      }
      $('#my-nuggets-search-div').css('display','block');
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
  var nugget_id = nugget_div.attr('id');
  var Nugget = Parse.Object.extend("Nugget");
  var query = new Parse.Query(Nugget);
  query.get(nugget_id).then(function(nugget) {
    var Nugget_User = Parse.Object.extend("Nugget_User");
    var query2 = new Parse.Query(Nugget_User);
    query2.equalTo("nugget", nugget);
    query2.notEqualTo("isDeleted", true);
    query2.find().then(function(nugget_users) {
      if (nugget_users.length == 1 && nugget_users[0].get("user").id == Parse.User.current().id) // last person to lose connection with this nugget, set nugget as deleted
      {
        nugget.set("isDeleted", true);
        nugget.save();
      }
      for (i=0;i<nugget_users.length;i++)
      {
        if (nugget_users[i].get("user").id == Parse.User.current().id)
        {
          nugget_users[i].set("isDeleted", true);
          nugget_users[i].save().then(function() {
            runQuery();
          });
        }
      }
    }, function(error) {
      nugget_div.fadeTo(200, 1.0);
    });
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
  }
}

initialize();

$('#logout-button').click(function()
{
  Parse.User.logOut();
  goToLoginPage();
});

});
