const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzKgf_oH5Uc9WzrkTugYNjGaVwGujnlcAsL35m_cjcpltrHk0NumqgovIn7s6vM8dv8/exec";


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


    if (!navigator.geolocation) {

        status.textContent =
            "Browser tidak mendukung GPS.";

        status.className =
            "status status-error";

        return;

    }


    button.disabled = true;


    status.textContent =
        "Mengambil lokasi GPS...";


    status.className =
        "status status-loading";


    navigator.geolocation.getCurrentPosition(

        function (position) {


            // ==================================
            // AMBIL DATA GPS
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


            console.log(
                "================================"
            );

            console.log(
                "DATA GPS"
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
            // TAMPILKAN DATA
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
            // KIRIM KE GOOGLE SHEET
            // ==================================

            kirimKeGoogleSheet(

                latitude,

                longitude,

                accuracy.toFixed(2),

                waktu

            );

        },


        function (error) {


            console.error(
                "GPS ERROR:",
                error
            );


            button.disabled = false;


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                status.textContent =
                    "Izin lokasi ditolak. Silakan izinkan akses lokasi.";

            }

            else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                status.textContent =
                    "Lokasi GPS tidak tersedia.";

            }

            else if (
                error.code ===
                error.TIMEOUT
            ) {

                status.textContent =
                    "GPS timeout. Silakan coba lagi.";

            }

            else {

                status.textContent =
                    "Gagal mendapatkan lokasi.";

            }


            status.className =
                "status status-error";

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
 * MENGGUNAKAN FORM GET
 * ==========================================
 */

function kirimKeGoogleSheet(

    latitude,

    longitude,

    accuracy,

    waktu

) {


    console.log(
        "Mempersiapkan pengiriman ke Google Apps Script..."
    );


    // ==========================================
    // BUAT FORM
    // ==========================================

    const form =
        document.createElement(
            "form"
        );


    form.method =
        "GET";


    form.action =
        GOOGLE_SCRIPT_URL;


    form.target =
        "googleScriptFrame";


    // ==========================================
    // LATITUDE
    // ==========================================

    const inputLatitude =
        document.createElement(
            "input"
        );


    inputLatitude.type =
        "hidden";


    inputLatitude.name =
        "latitude";


    inputLatitude.value =
        latitude;


    form.appendChild(
        inputLatitude
    );


    // ==========================================
    // LONGITUDE
    // ==========================================

    const inputLongitude =
        document.createElement(
            "input"
        );


    inputLongitude.type =
        "hidden";


    inputLongitude.name =
        "longitude";


    inputLongitude.value =
        longitude;


    form.appendChild(
        inputLongitude
    );


    // ==========================================
    // ACCURACY
    // ==========================================

    const inputAccuracy =
        document.createElement(
            "input"
        );


    inputAccuracy.type =
        "hidden";


    inputAccuracy.name =
        "accuracy";


    inputAccuracy.value =
        accuracy;


    form.appendChild(
        inputAccuracy
    );


    // ==========================================
    // WAKTU
    // ==========================================

    const inputWaktu =
        document.createElement(
            "input"
        );


    inputWaktu.type =
        "hidden";


    inputWaktu.name =
        "waktu";


    inputWaktu.value =
        waktu;


    form.appendChild(
        inputWaktu
    );


    // ==========================================
    // MASUKKAN FORM KE BODY
    // ==========================================

    document.body.appendChild(
        form
    );


    console.log(
        "Mengirim data:"
    );

    console.log(
        "Latitude =",
        latitude
    );

    console.log(
        "Longitude =",
        longitude
    );

    console.log(
        "Accuracy =",
        accuracy
    );

    console.log(
        "Waktu =",
        waktu
    );


    // ==========================================
    // SUBMIT
    // ==========================================

    form.submit();


    // ==========================================
    // STATUS
    // ==========================================

    setTimeout(
        function () {

            statusBerhasil();

            form.remove();

        },
        2000
    );

}


/**
 * ==========================================
 * STATUS BERHASIL
 * ==========================================
 */

function statusBerhasil() {

    const status =
        document.getElementById(
            "status"
        );


    const button =
        document.getElementById(
            "btnAmbilLokasi"
        );


    status.textContent =
        "Data lokasi berhasil dikirim ke Google Spreadsheet.";


    status.className =
        "status status-success";


    button.disabled =
        false;

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
