
let videoElemLeft = document.getElementById('left');
let videoElemRight = document.getElementById('right');
// let ws = new WebSocket('ws://localhost:4200/', 'echo-protocol');


// ws.onopen = (event) => {
//     console.log( event );

// };


// ws.onmessage = msg => {
//     console.log( msg );
// }

init();
let localRTCPeer = new RTCPeerConnection(
    {'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]}
);

localRTCPeer.ontrack = (event ) => { 
    console.log( event );
    videoElemRight.srcObject = event.streams[0]
};
localRTCPeer.addEventListener( 'icecandidate', handleRTCIceCandidate ); // when network candidate becomes available
// the above event is called when someone is trying to initiate or listen
// localRTCPeer.addEventListener( 'iceconnectionstatechange', handleRTCConnectionChange );
// localRTCPeer.addEventListener( 'negotiationneeded', handleRTCNegotiationNeeded );


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
        handleRemoteDescription();
        // left side is for local webcam stream.
    }).catch( err => {
        console.log( err );
    })
}

// function handleStream(){
//     videoDom.srcObject = localStream;
//     localStream.getTracks().map( stream => {
//         localRTCPeer.addTrack( stream, localStream );
//     })
// }

function handleRTCIceCandidate( data ){
    console.log( data );
    // this is where you have to make a call to your signalling server to send the candidate info
    if( data.candidate ){
        // init( videoElemRight );
        handleNewICECandidateMsg( data );
    }
    
}

// function handleRTCConnectionChange( data ){
//     console.log( data );
// }

// function handleRTCNegotiationNeeded( data ){ // called by the initiator
//     console.log( data );
//     createOffer();
// }

// function createOffer(){
//     localRTCPeer.createOffer().then( offer => {
//         localRTCPeer.setLocalDescription( offer );
//         console.log( offer );
//     });
// }

function createAnswer(){
    localRTCPeer.createAnswer().then( answer => {
        localRTCPeer.setLocalDescription( answer );
        console.log( answer );
    });
}

function handleRemoteDescription( ){

    localRTCPeer.setRemoteDescription( {
        sdp: "v=0\r\no=mozilla...THIS_IS_SDPARTA-60.2.0 8945563197143594553 0 IN IP4 0.0.0.0\r\ns=-\r\nt=0 0\r\na=fingerprint:sha-256 C6:11:7B:F7:58:82:D0:59:92:93:82:26:3F:99:E5:C3:F9:A4:EA:98:60:C7:93:96:D1:08:10:80:30:C4:45:C0\r\na=group:BUNDLE sdparta_0 sdparta_1\r\na=ice-options:trickle\r\na=msid-semantic:WMS *\r\nm=audio 9 UDP/TLS/RTP/SAVPF 109 9 0 8 101\r\nc=IN IP4 0.0.0.0\r\na=sendrecv\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2/recvonly urn:ietf:params:rtp-hdrext:csrc-audio-level\r\na=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=fmtp:109 maxplaybackrate=48000;stereo=1;useinbandfec=1\r\na=fmtp:101 0-15\r\na=ice-pwd:7afa7f61b49390972cd499e55138614f\r\na=ice-ufrag:9ea2ef5d\r\na=mid:sdparta_0\r\na=msid:{b7b7fce5-2426-4d35-a32f-f92c92d6a17e} {1c8645d0-971a-4c80-b9ac-a44035f58e15}\r\na=rtcp-mux\r\na=rtpmap:109 opus/48000/2\r\na=rtpmap:9 G722/8000/1\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:101 telephone-event/8000/1\r\na=setup:actpass\r\na=ssrc:1724620298 cname:{10a6f361-e337-4c94-b26a-8cbe803155f8}\r\nm=video 9 UDP/TLS/RTP/SAVPF 120 121\r\nc=IN IP4 0.0.0.0\r\na=sendrecv\r\na=extmap:1 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=fmtp:120 max-fs=12288;max-fr=60\r\na=fmtp:121 max-fs=12288;max-fr=60\r\na=ice-pwd:7afa7f61b49390972cd499e55138614f\r\na=ice-ufrag:9ea2ef5d\r\na=mid:sdparta_1\r\na=msid:{b7b7fce5-2426-4d35-a32f-f92c92d6a17e} {a77540e6-77c8-4749-a16a-c9a646999796}\r\na=rtcp-fb:120 nack\r\na=rtcp-fb:120 nack pli\r\na=rtcp-fb:120 ccm fir\r\na=rtcp-fb:120 goog-remb\r\na=rtcp-fb:121 nack\r\na=rtcp-fb:121 nack pli\r\na=rtcp-fb:121 ccm fir\r\na=rtcp-fb:121 goog-remb\r\na=rtcp-mux\r\na=rtpmap:120 VP8/90000\r\na=rtpmap:121 VP9/90000\r\na=setup:actpass\r\na=ssrc:1226725143 cname:{10a6f361-e337-4c94-b26a-8cbe803155f8}\r\n",
    type: "offer"} ).then( data => {
        console.log( data );
        createAnswer();
    });

}

function handleNewICECandidateMsg(msg) {
        console.log( msg );
        var candidate = new RTCIceCandidate(msg.candidate);
        localRTCPeer.addIceCandidate(candidate)
}

