const CACHE_NAME =
    "travel-log-v1";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json"

];


self.addEventListener(
    "install",
    function (event) {

        console.log(
            "Service Worker installing..."
        );


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(
                function (cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    function (event) {

        console.log(
            "Service Worker activated."
        );


        event.waitUntil(

            caches.keys()

            .then(
                function (cacheNames) {

                    return Promise.all(

                        cacheNames

                        .map(
                            function (cacheName) {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                            }
                        )

                    );

                }
            )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    function (event) {

        const request =
            event.request;


        // Jangan cache request ke Google Apps Script

        if (
            request.url.includes(
                "script.google.com"
            )
        ) {

            return;

        }


        event.respondWith(

            caches.match(
                request
            )

            .then(
                function (response) {

                    if (response) {

                        return response;

                    }


                    return fetch(
                        request
                    );

                }
            )

        );

    }
);