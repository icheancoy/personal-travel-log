// ============================================
// KONFIGURASI
// ============================================

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";

// ============================================
// ELEMENT
// ============================================

const btnAmbilLokasi = document.getElementById("btnAmbilLokasi");

const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const accuracyInput = document.getElementById("accuracy");
const waktuInput = document.getElementById("waktu");

const statusElement = document.getElementById("status");

// ============================================
// CEK SAAT HALAMAN DIBUKA
// ============================================

console.log("JavaScript berhasil dimuat.");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM berhasil dimuat.");

    const button = document.getElementById("btnAmbilLokasi");

    if (!button) {
        console.error("ERROR: Tombol btnAmbilLokasi tidak ditemukan.");
        return;
    }

    console.log("Tombol AMBIL LOKASI ditemukan.");

    button.addEventListener("click", function () {

        console.log("Tombol AMBIL LOKASI diklik.");

        ambilLokasi();

    });

});


// ============================================
// FUNGSI AMBIL LOKASI
// ============================================

function ambilLokasi() {

    console.log("Fungsi ambilLokasi() dijalankan.");

    setStatus("Mengambil lokasi...", "loading");

    // Cek dukungan browser
    if (!navigator.geolocation) {

        console.error("Browser tidak mendukung Geolocation API.");

        setStatus(
            "Browser tidak mendukung fitur lokasi.",
            "error"
        );

        return;
    }

    console.log("Geolocation API tersedia.");

    // Request lokasi
    navigator.geolocation.getCurrentPosition(

        function (position) {

            console.log("Lokasi berhasil diperoleh.");
            console.log(position);

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;

            const waktu =
                new Date().toLocaleString(
                    "id-ID",
                    {
                        timeZone: "Asia/Jakarta"
                    }
                );

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Accuracy:", accuracy);
            console.log("Waktu:", waktu);

            // Masukkan ke form
            if (latitudeInput) {
                latitudeInput.value = latitude;
            }

            if (longitudeInput) {
                longitudeInput.value = longitude;
            }

            if (accuracyInput) {
                accuracyInput.value =
                    accuracy.toFixed(2);
            }

            if (waktuInput) {
                waktuInput.value = waktu;
            }

            setStatus(
                "Lokasi berhasil diambil.",
                "success"
            );

            // Kirim ke Google Spreadsheet
            kirimKeGoogleSheet(
                latitude,
                longitude,
                accuracy,
                waktu
            );

        },

        function (error) {

            console.error(
                "Gagal mengambil lokasi."
            );

            console.error(error);

            let pesan = "";

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    pesan =
                        "Izin lokasi ditolak. Izinkan akses lokasi pada browser.";

                    break;

                case error.POSITION_UNAVAILABLE:

                    pesan =
                        "Lokasi tidak tersedia.";

                    break;

                case error.TIMEOUT:

                    pesan =
                        "Permintaan lokasi timeout.";

                    break;

                default:

                    pesan =
                        "Terjadi kesalahan saat mengambil lokasi.";

            }

            setStatus(
                pesan,
                "error"
            );

            alert(pesan);

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}


// ============================================
// KIRIM KE GOOGLE SHEET
// ============================================

function kirimKeGoogleSheet(
    latitude,
    longitude,
    accuracy,
    waktu
) {

    console.log(
        "Mengirim data ke Google Spreadsheet..."
    );

    const data = {

        latitude: latitude,

        longitude: longitude,

        accuracy: accuracy,

        waktu: waktu

    };

    console.log("Data:", data);

    fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)

    })

    .then(function (response) {

        console.log(
            "Response Google Apps Script:",
            response
        );

        return response.text();

    })

    .then(function (result) {

        console.log(
            "Hasil Google Apps Script:",
            result
        );

        setStatus(
            "Lokasi berhasil disimpan.",
            "success"
        );

    })

    .catch(function (error) {

        console.error(
            "Gagal mengirim ke Google Sheet:",
            error
        );

        setStatus(
            "Lokasi diperoleh, tetapi gagal disimpan ke Google Sheet.",
            "error"
        );

    });

}


// ============================================
// STATUS
// ============================================

function setStatus(message, type) {

    if (!statusElement) {
        console.log(message);
        return;
    }

    statusElement.textContent = message;

    statusElement.className =
        "status " + type;

}