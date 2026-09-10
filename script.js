// ======================================================
// TRAVEL LOG
// ======================================================


// ======================================================
// GOOGLE APPS SCRIPT
// ======================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


// ======================================================
// ELEMENT HTML
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

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "TRAVEL LOG START"
        );

        console.log(
            "===================================="
        );


        // Ambil element

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


        // Debug

        console.log(
            "Button:",
            btnAmbilLokasi
        );

        console.log(
            "Latitude:",
            latitudeInput
        );

        console.log(
            "Longitude:",
            longitudeInput
        );

        console.log(
            "Accuracy:",
            accuracyInput
        );

        console.log(
            "Waktu:",
            waktuInput
        );


        // Cek tombol

        if (!btnAmbilLokasi) {

            console.error(
                "ERROR: Tombol AMBIL LOKASI tidak ditemukan."
            );

            return;

        }


        // Pasang event

        btnAmbilLokasi.addEventListener(
            "click",
            function () {

                console.log(
                    "TOMBOL AMBIL LOKASI DIKLIK"
                );

                ambilLokasi();

            }
        );


        console.log(
            "Event tombol berhasil dipasang."
        );


        // Cek HTTPS

        console.log(
            "Protocol:",
            window.location.protocol
        );


        console.log(
            "Secure Context:",
            window.isSecureContext
        );


        // Cek Geolocation

        console.log(
            "Geolocation tersedia:",
            !!navigator.geolocation
        );


        setStatus(
            "Siap mengambil lokasi.",
            "idle"
        );

    }
);


// ======================================================
// AMBIL LOKASI
// ======================================================

function ambilLokasi() {

    console.log(
        "------------------------------------"
    );

    console.log(
        "FUNGSI AMBIL LOKASI"
    );

    console.log(
        "------------------------------------"
    );


    // Disable tombol

    btnAmbilLokasi.disabled = true;


    setStatus(
        "Meminta lokasi perangkat...",
        "loading"
    );


    // Cek HTTPS

    if (!window.isSecureContext) {

        console.error(
            "Website tidak berjalan pada Secure Context."
        );

        setStatus(
            "Website harus dibuka menggunakan HTTPS.",
            "error"
        );

        btnAmbilLokasi.disabled = false;

        return;

    }


    // Cek Geolocation

    if (!navigator.geolocation) {

        console.error(
            "Browser tidak mendukung Geolocation."
        );

        setStatus(
            "Browser tidak mendukung fitur lokasi.",
            "error"
        );

        btnAmbilLokasi.disabled = false;

        return;

    }


    console.log(
        "Memanggil navigator.geolocation.getCurrentPosition()"
    );


    navigator.geolocation.getCurrentPosition(

        // ==============================================
        // SUCCESS
        // ==============================================

        function (position) {

            console.log(
                "LOKASI BERHASIL DIDAPATKAN"
            );

            console.log(
                position
            );


            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            const accuracy =
                position.coords.accuracy;


            const timestamp =
                position.timestamp;


            const waktu =
                formatWaktu(timestamp);


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
                "Timestamp:",
                timestamp
            );

            console.log(
                "Waktu:",
                waktu
            );


            // ==========================================
            // TAMPILKAN DATA
            // ==========================================

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
                "Lokasi berhasil diperoleh. Menyimpan data...",
                "loading"
            );


            // ==========================================
            // KIRIM KE GOOGLE SHEET
            // ==========================================

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


        // ==============================================
        // ERROR
        // ==============================================

        function (error) {

            console.error(
                "ERROR GEOLOCATION"
            );

            console.error(
                error
            );


            let pesan =
                "Gagal mengambil lokasi.";


            switch (error.code) {

                case 1:

                    pesan =
                        "Izin lokasi ditolak. Aktifkan izin lokasi untuk website ini.";

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
                        "Terjadi kesalahan saat mengambil lokasi.";

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


        // ==============================================
        // OPTIONS
        // ==============================================

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
// FORMAT WAKTU
// ======================================================

function formatWaktu(timestamp) {

    const date =
        timestamp
            ? new Date(timestamp)
            : new Date();


    const options = {

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

    };


    return new Intl.DateTimeFormat(
        "id-ID",
        options
    ).format(date);

}


// ======================================================
// KIRIM KE GOOGLE SHEET
// ======================================================

function kirimKeGoogleSheet(data) {

    console.log(
        "------------------------------------"
    );

    console.log(
        "KIRIM KE GOOGLE SHEET"
    );

    console.log(
        "------------------------------------"
    );


    console.log(
        "URL:",
        GOOGLE_SCRIPT_URL
    );


    console.log(
        "DATA:",
        data
    );


    const payload =
        JSON.stringify({

            latitude:
                data.latitude,

            longitude:
                data.longitude,

            accuracy:
                data.accuracy,

            waktu:
                data.waktu

        });


    console.log(
        "PAYLOAD:",
        payload
    );


    fetch(
        GOOGLE_SCRIPT_URL,
        {

            method:
                "POST",

            headers:
                {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

            body:
                payload

        }
    )

    .then(
        function (response) {

            console.log(
                "HTTP STATUS:",
                response.status
            );


            return response.text();

        }
    )

    .then(
        function (result) {

            console.log(
                "GOOGLE SCRIPT RESPONSE:",
                result
            );


            let responseData;


            try {

                responseData =
                    JSON.parse(result);

            }

            catch (error) {

                console.warn(
                    "Response bukan JSON:",
                    result
                );

                responseData = null;

            }


            if (
                responseData &&
                responseData.success
            ) {

                setStatus(
                    "Lokasi berhasil disimpan ke Google Spreadsheet.",
                    "success"
                );

            }

            else {

                setStatus(
                    "Lokasi diperoleh, tetapi respons Google Spreadsheet tidak sesuai.",
                    "error"
                );

            }


            btnAmbilLokasi.disabled =
                false;

        }
    )

    .catch(
        function (error) {

            console.error(
                "ERROR FETCH GOOGLE SCRIPT:"
            );

            console.error(
                error
            );


            setStatus(
                "Lokasi berhasil diperoleh tetapi gagal mengirim ke Google Spreadsheet.",
                "error"
            );


            btnAmbilLokasi.disabled =
                false;

        }
    );

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