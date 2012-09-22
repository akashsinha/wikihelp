// ==UserScript==
// @name WikiHelp
// @namespace http://github.com/akashsinha
// @description show help text for wiki links
// @include *.wikipedia.org/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// ==/UserScript== 

var xhr = null;
var helpTime = null;

$("<div id='wt-overlay' style='display: none;position: absolute;background: rgba(95, 95, 95, 0.7);padding:10px 6px;-moz-border-radius:4px; box-shadow: 0 0 7px #e5e5e5;width:400px;font-size:10pt;'><div id='wt-content' style='background:#fff;padding: 3px;max-height: 200px;overflow:hidden;'></div></div>").appendTo("body");

function showHelp(query) {
    var terms = query.split("/");
    var term = terms[terms.length - 1];
    if (term.indexOf(':') > 0 || term.indexOf('?') > 0) {
        return;
    }

    $("#wt-overlay").show();
    $('#wt-content').html("Loading..");
    xhr = $.ajax({
        url: query,
        success: function (data) {
            if (term.indexOf('#') > 0) {
                ids = term.split('#');
                objid = ids[1];
                $("#wt-content").html($(data).find("#" + objid).parent().next());
            } else {
                $("#wt-content").html($(data).find("#mw-content-text > p:first"));
            }
        }
    });
}



$("#mw-content-text a").hover(

function () {
    var query = $(this).attr("href");

    $(this).removeAttr("title");

    if (xhr && xhr.readystate != 4) {
        xhr.abort();
    }
    var offset = $(this).offset();
    var wt_left = offset.left;
    var wt_top = offset.top;
    wt_top = wt_top + 20;

    $("#wt-overlay").css({
        'left': wt_left,
        'top': wt_top
    });
   helpTime = setTimeout(showHelp, 350, query);

}, function () {
    if (helpTime) {
        clearTimeout(helpTime);
    }
    $("#wt-overlay").hide();
    if (xhr && xhr.readystate != 4) {
        xhr.abort();
    }

}
);


