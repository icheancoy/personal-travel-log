/**
 * ==========================================
 * URL GOOGLE APPS SCRIPT
 * ==========================================
 */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzex8Fm438xhtKQ-BtHqUBS4bEufrlf_PC4MLfAl99k7JW_-BdWLmrlW7PIr39J5Vg1/exec";


/**
 * ==========================================
 * SAAT HALAMAN SELESAI DIMUAT
 * ==========================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const button =
            document.getElementById(
                "btnAmbilLokasi"
            );


        if (!button) {

            console.error(
                "Tombol tidak ditemukan."
            );

            return;

        }


        button.addEventListener(
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

    const button =
        document.getElementById(
            "btnAmbilLokasi"
        );


    const status =
        document.getElementById(
            "status"
        );


    // ========================================
    // CEK SUPPORT GPS
    // ========================================

    if (!navigator.geolocation) {

        status.textContent =
            "Browser tidak mendukung GPS.";

        status.className =
            "status status-error";

        return;

    }


    // ========================================
    // DISABLE BUTTON
    // ========================================

    button.disabled = true;


    status.textContent =
        "Mengambil lokasi GPS...";

    status.className =
        "status status-loading";


    // ========================================
    // GET CURRENT POSITION
    // ========================================

    navigator.geolocation.getCurrentPosition(

        function (position) {


            // ==================================
            // AMBIL DATA
            // ==================================

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


            // ==================================
            // DEBUG CONSOLE
            // ==================================

            console.log(
                "================================"
            );

            console.log(
                "GPS BERHASIL"
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

            console.log(
                "================================"
            );


            // ==================================
            // TAMPILKAN KE HALAMAN
            // ==================================

            document.getElementById(
                "latitude"
            ).value =
                latitude;


            document.getElementById(
                "longitude"
            ).value =
                longitude;


            document.getElementById(
                "accuracy"
            ).value =
                accuracy.toFixed(2) +
                " meter";


            document.getElementById(
                "waktu"
            ).value =
                waktu;


            status.textContent =
                "Lokasi berhasil diperoleh. Mengirim data...";

            status.className =
                "status status-loading";


            // ==================================
            // KIRIM DATA
            // ==================================

            kirimKeGoogleSheet(

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


            button.disabled = false;


            status.className =
                "status status-error";


            switch (
                error.code
            ) {

                case error.PERMISSION_DENIED:

                    status.textContent =
                        "Izin lokasi ditolak. Izinkan akses lokasi pada browser.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    status.textContent =
                        "Lokasi GPS tidak tersedia.";

                    break;


                case error.TIMEOUT:

                    status.textContent =
                        "GPS timeout. Silakan coba lagi.";

                    break;


                default:

                    status.textContent =
                        "Gagal mendapatkan lokasi.";

                    break;

            }

        },


        {

            enableHighAccuracy:
                true,

            timeout:
                30000,

            maximumAge:
                0

        }

    );

}


/**
 * ==========================================
 * KIRIM DATA KE GOOGLE APPS SCRIPT
 * ==========================================
 */

function kirimKeGoogleSheet(

    latitude,

    longitude,

    accuracy,

    waktu

) {


    // ========================================
    // BUAT QUERY STRING
    // ========================================

    const params =
        new URLSearchParams();


    params.append(
        "latitude",
        latitude
    );


    params.append(
        "longitude",
        longitude
    );


    params.append(
        "accuracy",
        accuracy.toFixed(2)
    );


    params.append(
        "waktu",
        waktu
    );


    // ========================================
    // BUAT URL FINAL
    // ========================================

    const url =
        GOOGLE_SCRIPT_URL +
        "?" +
        params.toString();


    console.log(
        "================================"
    );

    console.log(
        "MENGIRIM DATA"
    );

    console.log(
        url
    );

    console.log(
        "================================"
    );


    // ========================================
    // KIRIM REQUEST
    // ========================================

    fetch(

        url,

        {

            method:
                "GET",

            mode:
                "no-cors",

            cache:
                "no-store"

        }

    )

    .then(

        function () {


            console.log(
                "Request sudah dikirim ke Google Apps Script."
            );


            // ==================================
            // STATUS
            // ==================================

            const status =
                document.getElementById(
                    "status"
                );


            const button =
                document.getElementById(
                    "btnAmbilLokasi"
                );


            status.textContent =
                "Data lokasi berhasil dikirim.";

            status.className =
                "status status-success";


            button.disabled =
                false;

        }

    )

    .catch(

        function (error) {


            console.error(
                "ERROR MENGIRIM DATA:",
                error
            );


            const status =
                document.getElementById(
                    "status"
                );


            const button =
                document.getElementById(
                    "btnAmbilLokasi"
                );


            status.textContent =
                "Gagal mengirim data.";

            status.className =
                "status status-error";


            button.disabled =
                false;

        }

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
