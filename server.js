const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
// var WebSocketServer = require('ws').Server; 
const app = express();

//creating a websocket server at port 9090 
// var wss = new WebSocketServer({ server: app });
  
// //when a user connects to our sever 
// wss.on('connection', function( client ) { 
//    console.log("user connected"); 
    
//    //when server gets a message from a connected user 
//    client.on('message', function(message) { 
//       console.log("Got message from a user:", message); 
//       client.send( message );
//    }); 
	
//    client.send("Hello from server");
// });




app.use(
    express.static(
        path.join( __dirname )
    )
);




app.get('*', (req,res) => {

    fs.createReadStream(
        path.join( __dirname, 'index.html')
    ).pipe(res);

});

const httpsOptions = {
    cert : fs.readFileSync((__dirname,'ssl/server.crt').toString()),
    key : fs.readFileSync((__dirname,'ssl/server.key').toString())
}
https.createServer(httpsOptions, app)
    .listen(4800, () => console.log('Example app listening on port 4800!'))


// app.listen( 4200, () => {
//     console.log("Listening at port 4200");
// });

