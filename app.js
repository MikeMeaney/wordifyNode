var request = require("request");
var http = require("http");
var randomWordURL = 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=4&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + port )
});

http.createServer(function(req, res) {
    var theWord = "";
    var theDef = "";
    var theData = "";
    var thePartOfSpeech = "";
    var thePronuncation = "";

    //get the random word from wordnik & it's def
    request(randomWordURL, function (error, response, body) {
        theWord = body;
        theWord=JSON.parse(theWord);
        theWord=theWord.word;
        console.log(theWord);

        var wordDefURL = 'http://api.wordnik.com:80/v4/word.json/' + theWord + '/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
        //Get the definition
        request(wordDefURL, function (error, response, body) {
            res.writeHead(200, {'Content-Type': 'text/plain', "Access-Control-Allow-Origin": '*'});

            console.log(body);
            var theBody = JSON.parse(body);
            if (theBody.length > 0 || theBody == "<html><body><h1>400 Bad request</h1></body></html>" ) {
                var theBodyObject = theBody[0];
                //The part of speech
                thePartOfSpeech = theBodyObject.partOfSpeech;
                console.log(theBodyObject.partOfSpeech);
                //The Definition
                theDef = theBodyObject.text;
                console.log(theDef);

                //Construct the word data into a JSON String
                theData = {"word": theWord, "def": theDef, "partOfSpeech" : thePartOfSpeech};
                theData = JSON.stringify(theData);
                console.log(theData);

                //Send the data back to the user
                res.end(theData);
                console.log("---------------------------------");

            } else {
                theData = {"word": theWord, "def": "Hell If I know", "partOfSpeech": "? ? ?"};
                theData = JSON.stringify(theData);
                console.log(theData);

                //Send the data back to the user
                res.end(theData);
                console.log("---------------------------------");

            }
        });

    })
}).listen(server_port, server_ip_address);