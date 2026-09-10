const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


let btnAmbilLokasi;
let latitudeInput;
let longitudeInput;
let accuracyInput;
let waktuInput;
let statusElement;


document.addEventListener(
    "DOMContentLoaded",
    function () {

        btnAmbilLokasi =
            document.getElementById(
                "btnAmbilLokasi"
            );

        latitudeInput =
            document.getElementById(
                "latitude"
            );

        longitudeInput =
            document.getElementById(
                "longitude"
            );

        accuracyInput =
            document.getElementById(
                "accuracy"
            );

        waktuInput =
            document.getElementById(
                "waktu"
            );

        statusElement =
            document.getElementById(
                "status"
            );


        btnAmbilLokasi.addEventListener(
            "click",
            ambilLokasi
        );

    }
);


/**
 * ==========================================
 * AMBIL LOKASI GPS
 * ==========================================
 */

function ambilLokasi() {

    if (!navigator.geolocation) {

        setStatus(
            "Browser tidak mendukung GPS.",
            "error"
        );

        return;

    }


    btnAmbilLokasi.disabled = true;


    setStatus(
        "Mengambil lokasi...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            const accuracy =
                position.coords.accuracy;


            const waktu =
                formatWaktu(
                    position.timestamp
                );


            console.log(
                "Latitude:",
                latitude
            );


            console.log(
                "Longitude:",
                longitude
            );


            console.log(
                "Accuracy:",
                accuracy
            );


            console.log(
                "Waktu:",
                waktu
            );


            // =================================
            // TAMPILKAN DATA
            // =================================

            latitudeInput.value =
                latitude.toFixed(7);


            longitudeInput.value =
                longitude.toFixed(7);


            accuracyInput.value =
                accuracy.toFixed(2) +
                " meter";


            waktuInput.value =
                waktu;


            setStatus(
                "Lokasi diperoleh. Mengirim ke Spreadsheet...",
                "loading"
            );


            // =================================
            // KIRIM DATA
            // =================================

            kirimKeSpreadsheet(
                latitude,
                longitude,
                accuracy,
                waktu
            );

        },


        function (error) {

            console.error(
                "GPS ERROR:",
                error
            );


            let message =
                "Gagal mendapatkan lokasi.";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                message =
                    "Izin lokasi ditolak.";

            }


            if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                message =
                    "Lokasi tidak tersedia.";

            }


            if (
                error.code ===
                error.TIMEOUT
            ) {

                message =
                    "Pengambilan lokasi timeout.";

            }


            setStatus(
                message,
                "error"
            );


            btnAmbilLokasi.disabled =
                false;

        },


        {
            enableHighAccuracy: true,

            timeout: 30000,

            maximumAge: 0

        }

    );

}


/**
 * ==========================================
 * KIRIM KE GOOGLE APPS SCRIPT
 * ==========================================
 */

function kirimKeSpreadsheet(
    latitude,
    longitude,
    accuracy,
    waktu
) {


    const url =
        GOOGLE_SCRIPT_URL +

        "?latitude=" +
        encodeURIComponent(
            latitude
        ) +

        "&longitude=" +
        encodeURIComponent(
            longitude
        ) +

        "&accuracy=" +
        encodeURIComponent(
            accuracy
        ) +

        "&waktu=" +
        encodeURIComponent(
            waktu
        );


    console.log(
        "Mengirim:",
        url
    );


    /*
     * Gunakan Image request.
     *
     * Tidak menggunakan fetch POST.
     * Tidak menggunakan CORS.
     */

    const request =
        new Image();


    request.onload =
        function () {

            console.log(
                "Request selesai."
            );

        };


    request.onerror =
        function () {

            /*
             * Error pada Image tidak berarti
             * Apps Script gagal menerima request.
             *
             * Yang penting request sudah
             * dikirim ke URL.
             */

            console.log(
                "Request telah dikirim."
            );

        };


    request.src = url;


    /*
     * Berikan waktu untuk Apps Script
     * menyimpan data.
     */

    setTimeout(
        function () {

            setStatus(
                "Data lokasi telah dikirim ke Spreadsheet.",
                "success"
            );


            btnAmbilLokasi.disabled =
                false;

        },
        2000
    );

}


/**
 * ==========================================
 * FORMAT WAKTU INDONESIA
 * ==========================================
 */

function formatWaktu(timestamp) {

    const date =
        timestamp
            ? new Date(timestamp)
            : new Date();


    return new Intl.DateTimeFormat(
        "id-ID",
        {

            timeZone:
                "Asia/Jakarta",

            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                false

        }
    ).format(date);

}


/**
 * ==========================================
 * STATUS
 * ==========================================
 */

function setStatus(
    message,
    type
) {

    if (!statusElement) {

        return;

    }


    statusElement.textContent =
        message;


    statusElement.className =
        "status status-" +
        type;

}
