
let chat = document.getElementById('chat');
let chatMessage = document.getElementById('chatMessage');
let sendButton = document.getElementById('sendButton');
let roomName = document.getElementById('roomName');
let connectButton = document.getElementById('connectButton');
let file = document.getElementById('file');
let sendFile = document.getElementById('sendFile');



file.onchange = event => {
    
    // console.log( event );
    let fileData = event.target.files[0];
    console.log( fileData );
    let fileReader = new FileReader();
    fileReader.readAsDataURL( fileData );
    // fileReader.readAsArrayBuffer( fileData );
    fileReader.onprogress = event => console.log( event );
    fileReader.onload = event => {

        // console.log( event );
        console.log( fileReader );

        

        
        if( fileData.type.includes( "video" ) ){
            let sizeLim  = 10000;
            let data = '';
            for( let i = 0; i < fileReader.result.length; i++ ){
                if( data.length < sizeLim ){
                    data = data + fileReader.result.charAt( i );
                }else{
                    ws.send( JSON.stringify( {
                        video: true,
                        buffer: data
                    }));
                    data = '';
                    data = data + fileReader.result.charAt( i );
                }
            }
            ws.send( JSON.stringify({
                video: true,
                end: true
            }))
            // ws.send( JSON.stringify( {
            //     video: true,
            //     buffer: fileReader.result
            // }));console.log('in');
        }else if( fileData.type === 'image/jpeg' ){
            ws.send( JSON.stringify( {
                image: true,
                buffer:  fileReader.result 
            } ) );
        }else{
            console.log( fileData.type );
        }

    }

    

}


sendFile.onclick = event => {

    

}


let ws ;
sendButton.onclick = event => {
    
    ws.send( JSON.stringify({
        text: true,
        data: chatMessage.value
     }) );

}

connectButton.onclick = event => {

    ws = new WebSocket(`ws://localhost:4200/${ roomName.value }`);
    ws.onopen = ( event ) => handelWsOpen( event );
    ws.onmessage = ( event ) => handelWsMessage( event );
    ws.onerror = ( event ) => handelWsError( event );
    ws.onclose = ( event ) => handelWsClose( event );

}


function handelWsOpen( event ){
    console.log('handelWsOpen', event);
}

let buffer = '';
function handelWsMessage( event ){
    
    const message = JSON.parse( event.data ); console.log( message );
    if( message.img ){
        const img = document.createElement('img');
        img.src = message.buffer;
        chat.appendChild( img );
        console.log( img );
    }else if ( message.video ){
        const video = document.createElement('video');
        if( message.end ){
            console.log( buffer );
            video.src = buffer;
            video.setAttribute( 'autoplay', true );
            chat.appendChild( video );
        }else{ 
            buffer = buffer + message.buffer; 
            video.src = video.src + message.buffer;
            console.log( buffer );
        }
        
    }else{
        console.log( message );
    }
}

function handelWsError(){
    console.log( event );
}

function handelWsClose(){
    console.log( event );
}


installServiceWorker();
async function installServiceWorker(){

    if( 'serviceWorker' in navigator ){
        try{
            let serviceWorker = await navigator.serviceWorker.register('./service.worker.js');
            console.log( serviceWorker );
        }catch( err ){
            console.log( err )
        }
    }else{
        console.log('Service worker not supported');
    }

}

let defferedPrompt;

window.addEventListener( 'beforeinstallprompt', event => {
    console.log( "hello",event );
    event.preventDefault();
    defferedPrompt = event;
    showAddToHomeScreen();
})  

function showAddToHomeScreen(){

    let promptBanner = document.getElementById('pwaBanner');
    promptBanner.style.display = "block";
    promptBanner.addEventListener( 'click', addToHomeScreen );

}

function addToHomeScreen(){
    let promptBanner = document.getElementById('pwaBanner');
    promptBanner.style.display = "none";

    defferedPrompt.prompt();    // this is the main line
    // this oepns a banner like alert in desktop with install and cancel button by default.
    defferedPrompt.userChoice.then( event => {
        console.log( "accepted", event );
    })

}

// so basically, i am creating my own banner that will show on "beforeinstallprompt" event.
// in mobile phone, this comes at the bottom.
// on click of this, hide the banner and i will use the browser's default prompt
// where i will have install and cancel button.
// on click of install, i think install event will be fired.
// so manifest file info will be shown in the default prompt


// Notification API

Notification.requestPermission( status => {


    if( Notification.permission === 'granted' ){
        navigator.serviceWorker.getRegistration().then( reg => {
            
            console.log( reg );
            reg.showNotification( 'Hello world', {
                body: 'This is testing',
                vibrate: [200,100,200,100],
                tag: "vibration",
                data: {name:"sp",age:53},
                image: "/images/android-icon-192x192.png",
                icon: "/images/android-icon-192x192.png",
                actions: [
                    {
                        action: "click", title: "click", icon: "/images/android-icon-192x192.png"
                    },
                    {
                        action: "close", title: "close", icon: "/images/android-icon-192x192.png"
                    },
                    {
                        action: "open", title: "open", icon: "/images/android-icon-192x192.png"
                    }
                ]
            })


            reg.pushManager.subscribe(
                {
                    userVisibleOnly: true, 
                    applicationServerKey: 'BEouuI4xFlxsz_3kRLmjqXJVnTyrk9kWKPzF2HX0TfKuGTnhOQMEih51T-dMhkNvyO_QDpTux4cUg21uu773ASs'
                }
                     ).then( sub => {
                        console.log( JSON.stringify(sub) );
                        return;
            })

            // reg.pushManager.getSubscription({} ).then( sub => {
            //     console.log( sub );
            // })
        })
    }
})
