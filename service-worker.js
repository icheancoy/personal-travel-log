const CACHE_NAME =
    "travel-log-v2";


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

        event.waitUntil(

            caches
                .open(
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

        event.waitUntil(

            caches
                .keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(

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


        /*
         * Untuk file aplikasi:
         * gunakan network terlebih dahulu.
         *
         * Ini memastikan perubahan
         * script.js terbaru tidak tertahan
         * oleh cache browser.
         */

        if (

            event.request.url.includes(
                "script.js"
            )

            ||

            event.request.url.includes(
                "index.html"
            )

            ||

            event.request.url.includes(
                "style.css"
            )

        ) {

            event.respondWith(

                fetch(
                    event.request
                )
                .then(
                    function (response) {

                        const responseClone =
                            response.clone();


                        caches
                            .open(
                                CACHE_NAME
                            )
                            .then(
                                function (cache) {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                }
                            );


                        return response;

                    }
                )
                .catch(

                    function () {

                        return caches.match(
                            event.request
                        );

                    }

                )

            );


            return;

        }


        /*
         * File lainnya:
         * cache first.
         */

        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(

                    function (response) {

                        return response ||

                            fetch(
                                event.request
                            );

                    }

                )

        );

    }

);
