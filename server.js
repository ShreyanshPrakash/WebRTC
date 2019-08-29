const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const webPush = require('web-push');

var WebSocketServer = require('ws'); 
const app = express();

var vapidKeys = {
    publicKey : "BEouuI4xFlxsz_3kRLmjqXJVnTyrk9kWKPzF2HX0TfKuGTnhOQMEih51T-dMhkNvyO_QDpTux4cUg21uu773ASs",
    privateKey: "ZEC9Oqdt8Q_ms-zlowxsc7Z-ZqjB5dMc_-77_kpSiL8"
}

var clientSubscription = {
    endpoint:"https://fcm.googleapis.com/fcm/send/f38xUiGvHm0:APA91bH34TRdaW3Tzr33Yl2Ci5d_k2fhwGBCymZbOPlSaPsaWOeu4h1wsvU4fHOx12ck2v3EEsSZJxND41bo0eAHwCy944I5M_Gn0IX-_kMLiOuqDt04Hs-Xj__fV7mR5xsksBXbXLsQ",
    expirationTime:null,
    keys:{
        p256dh:"BGlsbsc9J-i0oSoLfgwiFr-nh0aXculBhfJ_rJtFEICSV-zn3Ije8FBpISS4VBbyz2MvMDfyQV0UNOm",
        auth:"CKpysK12n6QnO56KZJ9fNQ"
    }
}

//setting our previously generated VAPID keys
webPush.setVapidDetails(
    'mailto:myuserid@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
// setTimeout( ( clientSubscription ) => {
//     console.log("timer");
//     sendNotification( clientSubscription, 'Remote' );
// })
function sendNotification( clientSubscription, dataToSend = "" ){

    webPush.sendNotification( clientSubscription, dataToSend );

}

const httpServer = new http.createServer( app );
// const ws = new WebSocketServer.Server({
//     server: httpServer,
//     path: '/home'
// })

const wsHome = new WebSocketServer.Server({
    noServer: true
})
const wsOffice = new WebSocketServer.Server({
    noServer: true
})

let chatRoom = wsHome;

httpServer.on( 'upgrade' , ( req, socket, head ) => {
   switch( url.parse( req.url ).pathname ){
    
    case '/home': attachHandlers( wsHome );
        wsHome.handleUpgrade( req, socket, head, wss => { console.log('/hme');
            wsHome.emit('connection', wss);
        })
        break;
    
    case '/office': attachHandlers( wsOffice );
        wsOffice.handleUpgrade( req, socket, head, wss => { console.log('/off');
            wsOffice.emit('connection', wss);
        })
        break;
    
    default: 
        console.log('error default');
   }


})


// create a fucntion where u will pass the socket object and it will attacje all the handlers.
// same way to remove all handlers


function attachHandlers( chatRoom ){
    
    chatRoom.on('connection', ( socket ) => {  // get the reference to socket back
        socket.on('message', message => {
            // console.log( message );
            chatRoom.clients.forEach( socket => {
                
                socket.send( message );

            })
        })
    
        socket.on('disconnect', event => {
    
        });
    
        socket.on('error', err => {
    
        })

    
    })

}


app.use(
    express.static(
        path.join( __dirname )
    )
);


app.get('/remote', (req,res) => {

    sendNotification( clientSubscription, 'Remote data' );
    res.json({
        success: "true"
    })
})

app.get('*', (req,res) => {
    
    console.log(req.url);
    fs.createReadStream(
        path.join( __dirname, 'index.html')
    ).pipe(res);

});

// const httpsOptions = {
//     cert : fs.readFileSync((__dirname,'ssl/server.crt').toString()),
//     key : fs.readFileSync((__dirname,'ssl/server.key').toString())
// }
// https.createServer(httpsOptions, app)
//     .listen(4800, () => console.log('Example app listening on port 4800!'))


// app.listen( 4200, () => {
//     console.log("Listening at port 4200");
// });

httpServer.listen( 4200, () =>  console.log("Listening at port 4200") )

