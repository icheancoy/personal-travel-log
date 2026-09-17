/**
 * ==========================================
 * GOOGLE APPS SCRIPT URL
 * ==========================================
 *
 * PENTING:
 * GANTI URL DI BAWAH DENGAN URL
 * WEB APP TERBARU HASIL DEPLOYMENT.
 */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzex8Fm438xhtKQ-BtHqUBS4bEufrlf_PC4MLfAl99k7JW_-BdWLmrlW7PIr39J5Vg1/exec";


/**
 * ==========================================
 * HALAMAN SELESAI DIMUAT
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
                "Tombol AMBIL LOKASI tidak ditemukan."
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
 * FUNGSI AMBIL LOKASI
 * ==========================================
 */

function ambilLokasi() {

    const taskInput =
        document.getElementById(
            "task"
        );


    const button =
        document.getElementById(
            "btnAmbilLokasi"
        );


    const status =
        document.getElementById(
            "status"
        );


    // ========================================
    // AMBIL TASK
    // ========================================

    const task =
        taskInput.value.trim();


    // ========================================
    // VALIDASI TASK
    // ========================================

    if (task === "") {

        status.textContent =
            "Task wajib diisi sebelum mengambil lokasi.";

        status.className =
            "status status-error";


        taskInput.focus();


        return;

    }


    // ========================================
    // CEK GPS
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

    button.disabled =
        true;


    status.textContent =
        "Mengambil lokasi GPS...";

    status.className =
        "status status-loading";


    // ========================================
    // AMBIL POSISI
    // ========================================

    navigator.geolocation.getCurrentPosition(

        function (position) {

            // ==================================
            // DATA GPS
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


            // ==================================
            // STATUS
            // ==================================

            status.textContent =
                "Lokasi berhasil diperoleh. Mengirim data...";

            status.className =
                "status status-loading";


            // ==================================
            // KIRIM KE GOOGLE SHEET
            // ==================================

            kirimKeGoogleSheet(

                task,

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


            button.disabled =
                false;


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

    task,

    latitude,

    longitude,

    accuracy,

    waktu

) {


    // ========================================
    // BUAT PARAMETER
    // ========================================

    const params =
        new URLSearchParams();


    params.append(
        "task",
        task
    );


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
    // URL REQUEST
    // ========================================

    const url =
        GOOGLE_SCRIPT_URL +
        "?" +
        params.toString();


    console.log(
        "================================"
    );

    console.log(
        "MENGIRIM DATA KE GOOGLE SHEET"
    );

    console.log(
        "Task:",
        task
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
        "URL:",
        url
    );

    console.log(
        "================================"
    );


    // ========================================
    // REQUEST
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
                "Request berhasil dikirim."
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
 * FORMAT WAKTU
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
