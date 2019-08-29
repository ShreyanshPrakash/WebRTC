
let CACHE_NAME =   "testv1.0.0";



this.addEventListener( 'install', async ( event ) => {

    console.log( 'install event', event );
    let cache = await caches.open( CACHE_NAME )
        console.log( cache );
        cache.addAll([
            '/index.html',
            '/style.css',
            '/service.worker.js',
            '/webSocket.js',
            '/manifest.json'
        ])

})

this.addEventListener( 'fetch', ( event ) => {

    console.log( 'fetch event', event );
    event.respondWith( getCustomResponsePromise( event ) )
    
})

async function getCustomResponsePromise( event ) {

    try{
        const cachedResponse = await caches.match( event.request );
        if( cachedResponse )
            return cachedResponse

        const networkResponse = await fetch( event.request );
        let cache = await caches.open( CACHE_NAME )
        cache.put( event.request, networkResponse.clone() )
        return networkResponse
    }catch( error ){
        console.log( error )
    }

}

this.addEventListener( 'notificationclick', event => {
    console.log( event );
});

this.addEventListener( 'notificationclose', event => {
    console.log( event );
});



this.addEventListener( 'push', event => {

    console.log( event )

    var options = {
        body: "This is push notification",
        tag: "namePlate",
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
    }

    self.registration.showNotification( 'Push Notification', options )
})


// this.addEventListener( 'notificationerror', event => {
//     console.log( event );
// });

// this.addEventListener( 'notificationshow', event => {
//     console.log( event );
// });


// this.addEventListener( 'activate', event => {
//     console.log( event );

//     // self.registration.pushManager.subscribe( {
//     //     userVisibleOnly: true, 
//     //     applicationServerKey: 'BAVR1KZoitVgsfJ8ICyp4XE0H4riw8SRIjr26F4TqM7HUrl5f3clkOMLNu_xZkQB__eJ7f_GRmpdC--BZjqmzcA'
//     // } ).then( sub => {
//     //     console.log( sub );
//     // }).catch( err =>{
//     //     console.log( err );
//     // })
    
// });

