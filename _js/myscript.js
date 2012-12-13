
var query = "\
SELECT DISTINCT ?g WHERE { \
  GRAPH ?g { ?s ?p ?o } \
} \
ORDER BY ?g \
LIMIT 30 OFFSET %offset%";

var parseResults = function(data) {
    console.log(data);
    var i = 0,
    len = data.results.bindings.length,
    domEntry, cv_result,
    $result = $("#list-result");

    // empty old stuff
    $("#list-result").empty();
    // fill in
    for(i = 0; i < len; i++){
        cv_result = data.results.bindings[i];
        cv_name = cv_result.g.value;
        domEntry = '<li><a href="#cv-details"';
        domEntry += ' onclick="getCVDetails(\''+ cv_name + '\')">';
        domEntry += cv_name;
        domEntry += '</a></li>';
        $("#list-result").append( $(domEntry) );
    }

    // refresh style
    $("#list-result").listview('refresh');

    // hide loader
    $.mobile.hidePageLoadingMsg();
};

var getResumes = function(skip){
    // show loader
    $.mobile.showPageLoadingMsg();

    if( skip == null || typeof skip == "undefined" ) skip = 0;

    var prepQuery = query.replace("%offset%", skip);
    var url = "http://futurewavehosting.com:3030/my-semantic-information-manager/sparql?query=" + encodeURIComponent(prepQuery) + "&format=json";

    $.getJSON(url, parseResults);
}

$(document).ready(function(){
    var skip = 0;

    $("#prev").click(function(){
        skip -= 30;
        if( skip < 0 ) skip = 0;
        getResumes(skip);
    });

    $("#next").click(function(){
        skip += 30;
        getResumes(skip);
    });

    getResumes(skip);
});

var cvquery = "\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
PREFIX cv: <http://kaste.lv/~captsolo/semweb/resume/cv.rdfs#> \
SELECT ?skill WHERE { \
  GRAPH <%cv_name%> { \
    { \
      ?s rdf:type cv:Skill ; rdfs:label ?skill . \
    } UNION { \
      ?s rdf:type cv:Course ; rdfs:label ?skill . \
    } \
  } \
} \
ORDER BY ?skill \
LIMIT 30";

var parseCVResults = function(data) {
    console.log(data);
    var i = 0;
    var len = data.results.bindings.length;
    var cv_details;
    var domEntry;

    // empty old stuff
    $("#cv-result-details").empty();

    // fill in
    domEntry = '<h1>Skills and Training:</h1>';
    $("#cv-result-details").append( $(domEntry) );
    for (i = 0; i < len; i++) {
        var result = data.results.bindings[i];
        domEntry = '<h1>';
        domEntry += result.skill.value;
        domEntry += '</h1>';
        domEntry += '<p>';
        // domEntry += result0.abstract.value;
        domEntry += '</p>';
        $("#cv-result-details").append( $(domEntry) );
    }

    // hide loader
    $.mobile.hidePageLoadingMsg();
};

var getCVDetails = function(cv_name_selected) {
    // show loader
    $.mobile.showPageLoadingMsg();

    var prepQuery = cvquery.replace("%cv_name%", cv_name_selected);
    var url = "http://futurewavehosting.com:3030/my-semantic-information-manager/sparql?query=" + encodeURIComponent(prepQuery) + "&format=json";

    $.getJSON(url, parseCVResults);
}
