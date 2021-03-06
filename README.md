# lastfm-node

Read and write to users recent plays on Last.fm.

## Installation

    npm install lastfm

## Usage

    var LastFmNode = require('lastfm').LastFmNode;
  
    var lastfm = new LastFmNode({
      api_key: 'apikey',    // sign-up for a key at http://www.last.fm/api
      secret: 'secret'
    });

## Documentation

### RecentTracksStream

    lastfm.stream(username);

Returns: a `RecentTracksStream` instance

Methods:

- *start()*

        Start streaming recent track info.

- *stop()*

        Stop streaming recent track info.

- *on(event, listener)*

        Adds a listener for the specified event.

- *removeListener(event, listener)*

        Removes the listener for the specified event.

Options:

- *autostart*

        Start streaming automatically. Defaults to false.

- *lastPlayed*, *nowPlaying*, *scrobbled*, *stoppedPlaying*, *error*

        Event listeners.

Events:

- *lastPlayed(track)*

        The user's last scrobbled track.

- *nowPlaying(track)*

        Track the user is currently listening to.

- *scrobbled(track)*
        
        Now playing track has been scrobbled.

- *stoppedPlaying(track)*

        User stopped listening to current track.

- *error(error)*

        Ruh-roh.

### LastFmSession

    lastfm.session([user], [key]);

Returns: a `LastFmSession` instance.

If no key is supplied then the authorise() method must be used before the session can be used to make authenticated calls. See the last.fm API documentation for more info.

Public properties:

- *user*

        The username of the Last.fm user associated with the session.

- *key*

        The session key. Either passed in or generated using authorise().

Methods:

- *authorise(token, [options])*

 Authorises user with Last.fm api. See last.fm documentation.
        Options:
       - *authorised* : `function(session)`
        Listener for *authorised* event. See below.

       - *error* : `function(error)`
        Listener for `error` event. See below.

- *on(event, handler)*

        Adds a listener for the specified event.

- *removeListener(event, handler)*

        Removes the listener for the specified event.

- *isAuthorised()*

        Returns true if the session has been authorised or a key was specified in the constructor.

Events:

- *authorised(session)*

        Authorisation of session was successful.
        Note: Only emitted after a call to authorise(). Keys supplied in the constructor are assumed to be valid.

- *error(track, error)*

        Ruh-roh.

### LastFmUpdate

    lastfm.update(method, session, options);

Returns a `LastFmUpdate` instance. 

Valid methods are 'nowplaying' and 'scrobble'.

An authorised `LastFmSession` instance is required to make a successful update.

Options:

- *track*
    
        Track for nowplaying and scrobble requests. Uses same format as returned by `RecentTracksStream` events.

- *timestamp*

        Required for scrobble requests. Timestamp is in unix time (seconds since 01-01-1970 and is in UTC time).

- *success*

        Listener for `success` event.

- *error*

       Listener for `error` event.

Events:

- *success(track)*

       Update request was successful. 

- *error(track, error)*

        Ruh-roh.

### LastFmInfo

    lastfm.info(itemtype, [options]);

Returns: a `LastFmInfo` instance.

Gets extended info about specified item.

Public properties:

- *itemtype*

        Any Last.fm item with a getInfo method. eg user, track, artist, etc.

Options:

- *success*

        Listener for `success` event.

- *error*

       Listener for `error` event.

- *various*

       Params as specified in Last.fm API, eg user: "username"

Special cases:

When requesting track info the `track` param can be either the track name or a track object as returned by `RecentTracksStream`.


## Example

    var LastFmNode = require('lastfm').LastFmNode;
    
    var lastfm = new LastFmNode({
      api_key: 'abc',
      secret: 'secret'
    });

    var trackStream = lastfm.stream('username');
    
    trackStream.on('lastPlayed', function(track) {
      console.log('Last played: ' + track.name);
    });
    
    trackStream.on('nowPlaying', function(track) {
      console.log('Now playing: ' + track.name);
    });

    trackStream.on('scrobbled', function(track) {
      console.log('Scrobbled: ' + track.name);
    });

    trackStream.on('stoppedPlaying', function(track) {
      console.log('Stopped playing: ' + track.name);
    });

    trackStream.on('error', function(error) {
      console.log('Error: '  + error.message);
    });

    trackStream.start();

    var session = lastfm.session();
    session.authorise(token, {
       authorised: function(session) {
          lastfm.update('nowplaying', session, { track: track } );
          lastfm.update('scrobble', session, { track: track, timestamp: 12345678 });
       }
    });

## Influences

Heavily drawn from technoweenie's twitter-node  
http://github.com/technoweenie/twitter-node
