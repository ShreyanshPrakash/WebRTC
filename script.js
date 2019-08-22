
let videoElemLeft = document.getElementById('left');
let videoElemRight = document.getElementById('right');

let leftInput = document.getElementById('leftInput');
let rightInput = document.getElementById('rightInput');

let leftButton = document.getElementById('leftButton');
let rightButton = document.getElementById('rightButton');

let leftButtonInit = document.getElementById('leftButtonInit');
let rightButtonInit = document.getElementById('rightButtonInit');

let localRTCPeer = new RTCPeerConnection(
    {'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]}
    // ,iceTransports: 'all'
);
localRTCPeer.addEventListener( 'icecandidate', handleRTCIceCandidate ); 
localRTCPeer.addEventListener( 'iceconnectionstatechange', handleRTCConnectionChange );
localRTCPeer.addEventListener( 'negotiationneeded', handleRTCNegotiationNeeded );
localRTCPeer.ontrack = (event ) => { 
    console.log( event )
    videoElemRight.srcObject = event.streams[0];
};
// called when remote track streams is received

leftButton.addEventListener( 'click', handleLeftButtonClick );
rightButton.addEventListener( 'click', handRightButtonClick );

leftButtonInit.addEventListener( 'click', handleLeftInitButtonClick );
rightButtonInit.addEventListener( 'click', handRightInitButtonClick );

function handleLeftButtonClick(){
    console.log( leftInput.value );
}

function handRightButtonClick( event ){
    console.log( JSON.parse(rightInput.value));
    handleRemoteDescription( JSON.parse(rightInput.value) );
}

function handleLeftInitButtonClick(){
    console.log( leftInput.value );
    init();
}

function handRightInitButtonClick(){
    console.log( rightInput.value );
    init();
}

if( !sessionStorage.getItem('initiator') )
    sessionStorage.setItem('initiator', JSON.stringify({initiator: true}));


function init(){
    let localStream;
    navigator.mediaDevices.getUserMedia( {
        video: true,
        audio: true
    }).then( mediaStream => {
        localStream = mediaStream;
        videoElemLeft.srcObject = localStream;
        localStream.getTracks().map( stream => {
            localRTCPeer.addTrack( stream, localStream );
        });
        
    }).catch( err => {
        console.log( err );
    })
}


function handleRTCNegotiationNeeded( data ){ 
    console.log( data );
    JSON.parse(sessionStorage.getItem('initiator')).initiator ? createOffer() : createAnswer();
}

function createOffer(){ 
    localRTCPeer.createOffer().then( offer => {
        localRTCPeer.setLocalDescription( offer );
        console.log( offer );
        sessionStorage.setItem('sdp', JSON.stringify(offer) );
    });
}

function handleRemoteDescription( data ){
    localRTCPeer.setRemoteDescription(data).then( data => {
        console.log( data );
        createAnswer();
    });
}

function createAnswer(){
    localRTCPeer.createAnswer().then( answer => {
        localRTCPeer.setLocalDescription( answer );
        console.log( answer );
        sessionStorage.setItem('sdp', JSON.stringify(answer) );
    });
}


function handleRTCIceCandidate( data ){
    console.log( data );
    // this is where you have to make a call to your signalling server to send the candidate info
    if( data.candidate ){
        // init( videoElemRight );
        handleNewICECandidateMsg( data );
    }
    
}

function handleRTCConnectionChange( data ){
    console.log( data );
}







function handleNewICECandidateMsg(msg) {
        console.log( msg );
        var candidate = new RTCIceCandidate(msg.candidate);
        localRTCPeer.addIceCandidate(candidate)
}






























function handleStream(){
    videoDom.srcObject = localStream;
    localStream.getTracks().map( stream => {
        localRTCPeer.addTrack( stream, localStream );
    })
}