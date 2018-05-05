// Write your Javascript code.
function getData(query) {
    return $.ajax({
        url: "/Home/GetData",
        method: "POST",
        dataType: "json",
        data: {
            data: query
        }
    })
}


$(document).ready(function () {
    var sendButton = $("#send_button");
    var queryInput = $("#query_input");
    var out = $("#out");
    
   sendButton.click(function (q) {
       out.empty();
       var query = queryInput.val();
       getData(query)
           .done(function (data) {
               //console.log(JSON.stringify(data))
               out.text(JSON.stringify(data))
           })
   });
});