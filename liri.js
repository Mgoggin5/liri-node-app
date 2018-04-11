require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var command = process.argv[2];
var value = process.argv[2];
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


if(command === "movie-this") {
    if(value === undefined) {
        movieThis("Mr Nobody");
        log();
    } else {
        movieThis(value);
        log();
    }
} else if(command === "my-tweets") {
    if(value === undefined) {
        myTweets("greatcoder5");
        log();
    } else {
        myTweets(value);
        log();
    }
} else if(command === "spotify-this-song") {
    if(value === undefined) {
        spotifyThisSong("I Want It That Way");
        log();
    } else {
        spotifyThisSong(value);
        log();
    }
} else if(command === "do-what-it-says") {
    doWhatItSays();
    log();
}



function movieThis() {
    var movie = process.argv[3];
    if (!movie) {
        movie = "Mr Nobody"
    }
    params = movie
    request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObject = JSON.parse(body);
            //console.log(movieObject); 
            var movieResults =
                "------------------------------ begin ------------------------------" + "\r\n"
            "Title: " + movieObject.Title + "\r\n" +
                "Year: " + movieObject.Year + "\r\n" +
                "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
                "Country: " + movieObject.Country + "\r\n" +
                "Language: " + movieObject.Language + "\r\n" +
                "Plot: " + movieObject.Plot + "\r\n" +
                "Actors: " + movieObject.Actors + "\r\n" +
                "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
                "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" +
                "------------------------------ fin ------------------------------" + "\r\n";
            console.log(movieResults);
            log(movieResults);
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

function myTweets() {
    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });

    var twitterUsername = process.argv[3];
    if (!twitterUsername) {
        twitterUsername = "greatcoder5";
    }
    params = { screen_name: twitterUsername };
    client.get("statuses/user_timeline/", params, function (error, data, response) {
        if (!error) {
            for (var i = 0; i < data.length; i++) {

                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + "\r\n" +
                    data[i].created_at + "\r\n" +
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                console.log(twitterResults);
                log(twitterResults);
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if (!songName) {
        songName = "I Want It That Way";
    }
    params = songName;
    spotify.search({ type: "track", query: params }, function (error, data) {
        if (!error) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                        "Song: " + songInfo[i].name + "\r\n" +
                        "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                        "Preview Url: " + songInfo[i].preview_url + "\r\n" +
                        "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults);
                }
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};

function log(logResults) {
    fs.appendFile("log.txt", logResults, (error) => {
        if (error) {
            throw error;
        }
    });
};