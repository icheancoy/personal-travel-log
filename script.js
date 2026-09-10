// ======================================================
// TRAVEL LOG
// ======================================================

// URL GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


// ======================================================
// ELEMENT
// ======================================================

let btnAmbilLokasi;
let latitudeInput;
let longitudeInput;
let accuracyInput;
let waktuInput;
let statusElement;


// ======================================================
// INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Travel Log initialized.");

    btnAmbilLokasi =
        document.getElementById("btnAmbilLokasi");

    latitudeInput =
        document.getElementById("latitude");

    longitudeInput =
        document.getElementById("longitude");

    accuracyInput =
        document.getElementById("accuracy");

    waktuInput =
        document.getElementById("waktu");

    statusElement =
        document.getElementById("status");


    if (!btnAmbilLokasi) {

        console.error(
            "Tombol AMBIL LOKASI tidak ditemukan."
        );

        return;
    }


    btnAmbilLokasi.addEventListener(
        "click",
        ambilLokasi
    );


    setStatus(
        "Siap mengambil lokasi.",
        "idle"
    );

});


// ======================================================
// AMBIL LOKASI
// ======================================================

function ambilLokasi() {

    console.log(
        "AMBIL LOKASI diklik."
    );


    if (!navigator.geolocation) {

        setStatus(
            "Browser tidak mendukung GPS.",
            "error"
        );

        return;
    }


    if (!window.isSecureContext) {

        setStatus(
            "Website harus menggunakan HTTPS.",
            "error"
        );

        return;
    }


    btnAmbilLokasi.disabled = true;


    setStatus(
        "Mengambil lokasi perangkat...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            console.log(
                "GPS berhasil."
            );


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


            // TAMPILKAN DATA

            latitudeInput.value =
                latitude;


            longitudeInput.value =
                longitude;


            accuracyInput.value =
                accuracy.toFixed(2) +
                " meter";


            waktuInput.value =
                waktu;


            setStatus(
                "Lokasi berhasil diperoleh. Menyimpan ke Google Spreadsheet...",
                "loading"
            );


            // KIRIM DATA

            kirimKeGoogleSheet({

                latitude:
                    latitude,

                longitude:
                    longitude,

                accuracy:
                    accuracy,

                waktu:
                    waktu

            });

        },


        function (error) {

            console.error(
                "GPS ERROR:",
                error
            );


            let pesan;


            switch (error.code) {

                case 1:

                    pesan =
                        "Izin lokasi ditolak.";

                    break;


                case 2:

                    pesan =
                        "Lokasi perangkat tidak tersedia.";

                    break;


                case 3:

                    pesan =
                        "Pengambilan lokasi timeout.";

                    break;


                default:

                    pesan =
                        "Gagal mengambil lokasi.";

            }


            setStatus(
                pesan,
                "error"
            );


            alert(
                pesan
            );


            btnAmbilLokasi.disabled =
                false;

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


// ======================================================
// KIRIM GOOGLE SHEET
// ======================================================

function kirimKeGoogleSheet(data) {

    console.log(
        "Mengirim data ke Google Apps Script..."
    );


    const params =
        new URLSearchParams();


    params.append(
        "latitude",
        data.latitude
    );


    params.append(
        "longitude",
        data.longitude
    );


    params.append(
        "accuracy",
        data.accuracy
    );


    params.append(
        "waktu",
        data.waktu
    );


    console.log(
        "DATA:",
        params.toString()
    );


    fetch(
        GOOGLE_SCRIPT_URL,
        {

            method:
                "POST",

            mode:
                "no-cors",

            headers:
                {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8"
                },

            body:
                params.toString()

        }
    )

    .then(
        function () {

            console.log(
                "Request berhasil dikirim."
            );


            setStatus(
                "Lokasi berhasil disimpan ke Google Spreadsheet.",
                "success"
            );


            btnAmbilLokasi.disabled =
                false;

        }
    )

    .catch(
        function (error) {

            console.error(
                "GAGAL MENGIRIM:",
                error
            );


            setStatus(
                "Gagal mengirim lokasi ke Google Spreadsheet.",
                "error"
            );


            btnAmbilLokasi.disabled =
                false;

        }
    );

}


// ======================================================
// FORMAT WAKTU
// ======================================================

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


// ======================================================
// STATUS
// ======================================================

function setStatus(
    message,
    type
) {

    if (!statusElement) {

        console.log(
            message
        );

        return;
    }


    statusElement.textContent =
        message;


    statusElement.className =
        "status status-" +
        type;

}
