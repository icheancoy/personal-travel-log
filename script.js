const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxAaabjNyiGoaJlllP85BaWnwNthj7F-Xt0wUNuzVqUVg5aodiiqa1fcu4xmfK_83-K/exec";

console.log("SCRIPT VERSION: 2026-09-17-02");

const taskInput = document.getElementById("task");
const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");

const statusBox = document.getElementById("status");
const resultBox = document.getElementById("result");

const resultTask = document.getElementById("resultTask");
const latitudeBox = document.getElementById("latitude");
const longitudeBox = document.getElementById("longitude");
const accuracyBox = document.getElementById("accuracy");
const waktuBox = document.getElementById("waktu");

let locationData = null;


// =====================================================
// STATUS
// =====================================================

function setStatus(message) {
    statusBox.textContent = message;
}


// =====================================================
// FORMAT WAKTU
// =====================================================

function formatDateTime(date) {

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    return new Intl.DateTimeFormat(
        "id-ID",
        options
    ).format(date);
}


// =====================================================
// AMBIL LOKASI
// =====================================================

locationButton.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (!task) {

        setStatus(
            "Silakan isi Task / Kegiatan terlebih dahulu."
        );

        taskInput.focus();

        return;
    }


    if (!navigator.geolocation) {

        setStatus(
            "Browser tidak mendukung GPS / Geolocation."
        );

        return;
    }


    locationButton.disabled = true;
    saveButton.disabled = true;

    setStatus(
        "Sedang mengambil lokasi..."
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
                formatDateTime(new Date());


            locationData = {

                task: task,

                latitude: latitude,

                longitude: longitude,

                accuracy: accuracy,

                waktu: waktu

            };


            // =========================================
            // TAMPILKAN DATA
            // =========================================

            resultTask.textContent =
                task;

            latitudeBox.textContent =
                latitude.toFixed(6);

            longitudeBox.textContent =
                longitude.toFixed(6);

            accuracyBox.textContent =
                accuracy.toFixed(2) + " meter";

            waktuBox.textContent =
                waktu;


            resultBox.classList.remove("hidden");


            saveButton.disabled = false;
            locationButton.disabled = false;


            setStatus(
                "Lokasi berhasil diperoleh. Silakan klik SIMPAN LOG."
            );

        },


        function (error) {

            locationButton.disabled = false;
            saveButton.disabled = true;


            let message =
                "Gagal mendapatkan lokasi.";


            switch (error.code) {

                case 1:

                    message =
                        "Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser.";

                    break;

                case 2:

                    message =
                        "Lokasi tidak tersedia.";

                    break;

                case 3:

                    message =
                        "Waktu pengambilan lokasi habis.";

                    break;

            }


            setStatus(message);

        },


        {

            enableHighAccuracy: true,

            timeout: 30000,

            maximumAge: 0

        }

    );

});


// =====================================================
// SIMPAN LOG
// =====================================================

saveButton.addEventListener("click", function () {

    if (!locationData) {

        setStatus(
            "Lokasi belum tersedia."
        );

        return;
    }


    saveButton.disabled = true;
    locationButton.disabled = true;


    setStatus(
        "Mengirim data ke Google Spreadsheet..."
    );


    // =================================================
    // BUAT URL
    // =================================================

    const params = new URLSearchParams();

    params.append(
        "task",
        locationData.task
    );

    params.append(
        "latitude",
        locationData.latitude
    );

    params.append(
        "longitude",
        locationData.longitude
    );

    params.append(
        "accuracy",
        locationData.accuracy
    );

    params.append(
        "waktu",
        locationData.waktu
    );


    // Cache buster
    params.append(
        "_",
        Date.now()
    );


    const requestUrl =
        GOOGLE_SCRIPT_URL +
        "?" +
        params.toString();


    console.log(
        "REQUEST URL:",
        requestUrl
    );


    console.log(
        "DATA YANG DIKIRIM:",
        {
            task: locationData.task,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            accuracy: locationData.accuracy,
            waktu: locationData.waktu
        }
    );


    // =================================================
    // KIRIM GET REQUEST
    // MENGGUNAKAN IMAGE BEACON
    // =================================================

    const beacon =
        new Image();

    beacon.onload = function () {

        console.log(
            "Google Apps Script request selesai."
        );

    };


    beacon.onerror = function () {

        console.log(
            "Response tidak dapat dibaca browser, tetapi request sudah dikirim."
        );

    };


    beacon.src =
        requestUrl;


    // =================================================
    // TUNGGU REQUEST
    // =================================================

    setTimeout(function () {

        setStatus(
            "Data telah dikirim ke Google Spreadsheet."
        );


        saveButton.disabled = true;

        locationButton.disabled = false;


        console.log(
            "SELESAI MENGIRIM DATA"
        );

    }, 3000);

});
