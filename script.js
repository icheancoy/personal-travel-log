const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxAaabjNyiGoaJlllP85BaWnwNthj7F-Xt0wUNuzVqUVg5aodiiqa1fcu4xmfK_83-K/exec";


const taskInput = document.getElementById("task");
const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");
const statusElement = document.getElementById("status");
const resultElement = document.getElementById("result");
const resultTask = document.getElementById("resultTask");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const accuracyElement = document.getElementById("accuracy");
const waktuElement = document.getElementById("waktu");


let locationData = {
    task: "",
    latitude: "",
    longitude: "",
    accuracy: "",
    waktu: ""
};


/* ==========================================
   AMBIL LOKASI
   ========================================== */

locationButton.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (!task) {
        setStatus(
            "Task / kegiatan wajib diisi.",
            "error"
        );

        taskInput.focus();
        return;
    }

    if (!navigator.geolocation) {
        setStatus(
            "Browser tidak mendukung Geolocation.",
            "error"
        );

        return;
    }

    setStatus(
        "Sedang mengambil lokasi...",
        "loading"
    );

    locationButton.disabled = true;
    saveButton.disabled = true;


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
                latitude: latitude.toFixed(8),
                longitude: longitude.toFixed(8),
                accuracy: accuracy.toFixed(2),
                waktu: waktu
            };


            resultTask.textContent =
                locationData.task;

            latitudeElement.textContent =
                locationData.latitude;

            longitudeElement.textContent =
                locationData.longitude;

            accuracyElement.textContent =
                locationData.accuracy + " meter";

            waktuElement.textContent =
                locationData.waktu;


            resultElement.classList.remove(
                "hidden"
            );


            setStatus(
                "Lokasi berhasil diperoleh. Klik SIMPAN LOG.",
                "success"
            );


            saveButton.disabled = false;
            locationButton.disabled = false;
        },


        function (error) {

            locationButton.disabled = false;
            saveButton.disabled = true;


            let message =
                "Gagal mengambil lokasi.";


            if (error.code === 1) {
                message =
                    "Izin lokasi ditolak.";
            }

            else if (error.code === 2) {
                message =
                    "Lokasi tidak tersedia.";
            }

            else if (error.code === 3) {
                message =
                    "Pengambilan lokasi timeout.";
            }


            setStatus(
                message,
                "error"
            );


            console.error(
                "GEOLOCATION ERROR:",
                error
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }
    );
});


/* ==========================================
   SIMPAN LOG
   ========================================== */

saveButton.addEventListener("click", function () {

    if (
        !locationData.task ||
        !locationData.latitude ||
        !locationData.longitude
    ) {

        setStatus(
            "Data lokasi belum tersedia.",
            "error"
        );

        return;
    }


    saveButton.disabled = true;
    locationButton.disabled = true;


    setStatus(
        "Mengirim data ke Google Spreadsheet...",
        "loading"
    );


    const params =
        new URLSearchParams();


    params.set(
        "task",
        locationData.task
    );


    params.set(
        "latitude",
        locationData.latitude
    );


    params.set(
        "longitude",
        locationData.longitude
    );


    params.set(
        "accuracy",
        locationData.accuracy
    );


    params.set(
        "waktu",
        locationData.waktu
    );


    const requestUrl =
        GOOGLE_SCRIPT_URL +
        "?" +
        params.toString();


    console.log(
        "GOOGLE SCRIPT URL:",
        requestUrl
    );


    /*
     * Buat iframe baru.
     */

    const iframe =
        document.createElement("iframe");


    iframe.style.display =
        "none";


    iframe.src =
        requestUrl;


    document.body.appendChild(
        iframe
    );


    /*
     * Apps Script akan menerima GET
     * dan menjalankan doGet().
     */

    setTimeout(function () {

        setStatus(
            "Data telah dikirim. Periksa Google Spreadsheet.",
            "success"
        );


        saveButton.disabled = true;
        locationButton.disabled = false;


    }, 2500);
});


/* ==========================================
   FORMAT WAKTU
   ========================================== */

function formatDateTime(date) {

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const year =
        date.getFullYear();


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    return (
        day +
        "/" +
        month +
        "/" +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}


/* ==========================================
   STATUS
   ========================================== */

function setStatus(message, type) {

    statusElement.textContent =
        message;


    if (type === "success") {

        statusElement.style.background =
            "#dcfce7";

        statusElement.style.color =
            "#166534";
    }

    else if (type === "error") {

        statusElement.style.background =
            "#fee2e2";

        statusElement.style.color =
            "#991b1b";
    }

    else if (type === "loading") {

        statusElement.style.background =
            "#dbeafe";

        statusElement.style.color =
            "#1e40af";
    }

    else {

        statusElement.style.background =
            "#f3f4f6";

        statusElement.style.color =
            "#374151";
    }
}
