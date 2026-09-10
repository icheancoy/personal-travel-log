// ============================================================
// PERSONAL TRAVEL LOG
// ============================================================


// ============================================================
// GOOGLE APPS SCRIPT WEB APP
// ============================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


// ============================================================
// ELEMENT HTML
// ============================================================

const userGmail =
    document.getElementById("userGmail");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const accuracy =
    document.getElementById("accuracy");

const timestamp =
    document.getElementById("timestamp");

const locationButton =
    document.getElementById("locationButton");

const saveButton =
    document.getElementById("saveButton");

const statusBox =
    document.getElementById("status");


// ============================================================
// STATUS MESSAGE
// ============================================================

function showStatus(message, type = "info") {

    statusBox.textContent = message;

    statusBox.className =
        "status " + type;
}


// ============================================================
// FORMAT WAKTU ASIA/JAKARTA
// ============================================================

function formatJakartaTime(date = new Date()) {

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            timeZone: "Asia/Jakarta",

            year: "numeric",

            month: "2-digit",

            day: "2-digit",

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",

            hour12: false
        }
    ).format(date);
}


// ============================================================
// AMBIL LOKASI
// ============================================================

function getLocation() {

    if (!navigator.geolocation) {

        showStatus(
            "Browser tidak mendukung fitur lokasi.",
            "error"
        );

        return;
    }


    locationButton.disabled = true;

    locationButton.textContent =
        "MENGAMBIL LOKASI...";


    showStatus(
        "Meminta lokasi GPS dari perangkat...",
        "info"
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            // ================================================
            // LATITUDE
            // ================================================

            latitude.value =
                position.coords.latitude
                    .toFixed(7);


            // ================================================
            // LONGITUDE
            // ================================================

            longitude.value =
                position.coords.longitude
                    .toFixed(7);


            // ================================================
            // ACCURACY
            // ================================================

            accuracy.value =
                position.coords.accuracy
                    .toFixed(2);


            // ================================================
            // TIMESTAMP
            // ================================================

            timestamp.value =
                formatJakartaTime();


            // ================================================
            // ENABLE SAVE
            // ================================================

            saveButton.disabled = false;


            locationButton.disabled = false;

            locationButton.textContent =
                "AMBIL LOKASI LAGI";


            showStatus(
                "Lokasi berhasil diperoleh. Data siap disimpan.",
                "success-msg"
            );

        },


        function(error) {

            locationButton.disabled = false;

            locationButton.textContent =
                "AMBIL LOKASI";

            saveButton.disabled = true;


            let message =
                "Gagal mendapatkan lokasi.";


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Izin lokasi ditolak. Aktifkan izin lokasi untuk website ini.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    message =
                        "Informasi lokasi tidak tersedia.";

                    break;


                case error.TIMEOUT:

                    message =
                        "Permintaan lokasi timeout. Silakan coba lagi.";

                    break;


                default:

                    message =
                        "Terjadi kesalahan saat mengambil lokasi.";
            }


            showStatus(
                message,
                "error"
            );

        },


        {
            enableHighAccuracy: true,

            timeout: 20000,

            maximumAge: 0
        }
    );
}


// ============================================================
// SIMPAN LOG
// ============================================================

async function saveLog() {

    // ================================================
    // VALIDASI LOKASI
    // ================================================

    if (
        !latitude.value ||
        !longitude.value
    ) {

        showStatus(
            "Ambil lokasi terlebih dahulu.",
            "error"
        );

        return;
    }


    // ================================================
    // BUTTON LOADING
    // ================================================

    saveButton.disabled = true;

    saveButton.textContent =
        "MENYIMPAN...";


    showStatus(
        "Mengirim data ke Google Sheet...",
        "info"
    );


    // ================================================
    // GOOGLE MAPS LINK
    // ================================================

    const googleMapsLink =
        "https://www.google.com/maps?q=" +
        latitude.value +
        "," +
        longitude.value;


    // ================================================
    // DATA
    // ================================================

    const formData =
        new URLSearchParams();


    formData.append(
        "user_gmail",
        userGmail.value
    );


    formData.append(
        "timestamp",
        timestamp.value
    );


    formData.append(
        "latitude",
        latitude.value
    );


    formData.append(
        "longitude",
        longitude.value
    );


    formData.append(
        "accuracy",
        accuracy.value
    );


    formData.append(
        "link_gmap",
        googleMapsLink
    );


    // ================================================
    // SEND TO GOOGLE APPS SCRIPT
    // ================================================

    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8"
                },

                body:
                    formData.toString()
            }
        );


        // ============================================
        // SUCCESS
        // ============================================

        showStatus(
            "Log berhasil dikirim ke Google Sheet.",
            "success-msg"
        );


        saveButton.textContent =
            "LOG TERSIMPAN";


        setTimeout(
            function() {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "SIMPAN LOG";

            },
            2500
        );


    } catch (error) {

        console.error(
            "Save error:",
            error
        );


        showStatus(
            "Gagal mengirim data ke Google Sheet.",
            "error"
        );


        saveButton.disabled =
            false;

        saveButton.textContent =
            "SIMPAN LOG";
    }
}


// ============================================================
// EVENT BUTTON
// ============================================================

locationButton.addEventListener(
    "click",
    getLocation
);


saveButton.addEventListener(
    "click",
    saveLog
);


// ============================================================
// INFO USER
// ============================================================
//
// GitHub Pages tidak dapat membaca Gmail user secara langsung.
// Gmail akan dicoba diambil oleh Google Apps Script.
//
// Field ini dikosongkan di client dan akan diisi oleh Code.gs
// apabila Google memberikan informasi akun pengguna.
//
// ============================================================

userGmail.value = "";