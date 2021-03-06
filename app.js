require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
});

app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {

      let searchTermArtist = { search: req.query.artist };

      res.render("artist-search-results", {
        artistsArray: data.body.artists.items, searchTermArtist,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {

      let albumArtistChosen = {chose: data.body.items[0].artists[0].name}

      res.render("albums", { albumsArray: data.body.items, albumArtistChosen });
    })
    .catch((err) =>
      console.log("The error while searching artists albums occurred: ", err)
    );
});

app.get("/album-tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 10, offset: 0 })
    .then((data) => {

      res.render("album-tracks", { tracksArray: data.body.items });
    })
    .catch((err) => console.log("Something went wrong!", err));
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
