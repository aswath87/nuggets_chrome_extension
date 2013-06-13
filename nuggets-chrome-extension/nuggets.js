$(document).ready(function(){
    
function initialize() {chrome.tabs.getSelected(null, function(tab) {
            $(".prepopulate").val(tab.title);
            Parse.initialize("sKtmhxM9qK4VPgdJ8s1speUjACWy49U18mB6BlJY", "rTgoaqx3zjpZ4TPwuWlUa7niqvVxR6QMWtdENsET");
            runQuery();
            });
        }

function runQuery() {
        var Nugget = Parse.Object.extend("Nugget");
        var query = new Parse.Query(Nugget).equalTo("Source",$(".prepopulate").val()).descending("createdAt");

        query.find({
          success: function(results) {
            var query_results = [];
            for(i=0;i<results.length;i++)
            {
              query_results.push('<div class="nugget-tile">' + '<div class="nugget-content">' + results[i].get("Content") + "</div>" + '<div class="nugget-add"><img class="follow-image" src="plus.png" /></div></div>');
            }
            $('#query').html(query_results.join(''));    
          },
          error: function(error) {
            alert("error");
            $(".error").show();
          }
        });
        }

initialize();

    
    $('#submit').click(function() {
    
        
        var formData = $("#form").serializeArray(),
            len = formData.length,
            dataObj = {};
        
        for (i=0; i<len; i++) {
            dataObj[formData[i].name] = formData[i].value;
            }
            
        if (dataObj['Nugget.Content'] == "") {
            return false;
            }

        var Nugget = Parse.Object.extend("Nugget");
        var nuggetObject = new Nugget();
          nuggetObject.save({Content: dataObj['Nugget.Content'], Source: dataObj['Nugget.Source'], Tag: dataObj['Nugget.Tag']}, {
          success: function(object) {
            $(".success").show();
          },
          error: function(model, error) {
            $(".error").show();
          }
        });
        
        runQuery();
        
        $('.nugget-field').val("");
        
        return false; 
    });
    
    $('.follow-image').click( function() {
        $(this).attr('src','check.png');
        });
});
