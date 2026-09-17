const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxAaabjNyiGoaJlllP85BaWnwNthj7F-Xt0wUNuzVqUVg5aodiiqa1fcu4xmfK_83-K/exec";


const taskInput =
    document.getElementById("task");

const locationButton =
    document.getElementById("locationButton");

const saveButton =
    document.getElementById("saveButton");

const statusElement =
    document.getElementById("status");

const resultElement =
    document.getElementById("result");

const resultTask =
    document.getElementById("resultTask");

const latitudeElement =
    document.getElementById("latitude");

const longitudeElement =
    document.getElementById("longitude");

const accuracyElement =
    document.getElementById("accuracy");

const waktuElement =
    document.getElementById("waktu");


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

locationButton.addEventListener("click", () => {

    const task =
        taskInput.value.trim();


    if (!task) {

        setStatus(
            "Task / kegiatan wajib diisi.",
            "error"
        );

        taskInput.focus();

        return;
    }


    if (!window.isSecureContext) {

        setStatus(
            "Aplikasi harus dibuka melalui HTTPS.",
            "error"
        );

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

        (position) => {

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

                latitude:
                    latitude.toFixed(8),

                longitude:
                    longitude.toFixed(8),

                accuracy:
                    accuracy.toFixed(2),

                waktu:
                    waktu
            };


            resultTask.textContent =
                locationData.task;

            latitudeElement.textContent =
                locationData.latitude;

            longitudeElement.textContent =
                locationData.longitude;

            accuracyElement.textContent =
                locationData.accuracy +
                " meter";

            waktuElement.textContent =
                locationData.waktu;


            resultElement.classList.remove(
                "hidden"
            );


            setStatus(
                "Lokasi berhasil diperoleh. Periksa data lalu klik SIMPAN LOG.",
                "success"
            );


            saveButton.disabled = false;
            locationButton.disabled = false;
        },


        (error) => {

            locationButton.disabled = false;
            saveButton.disabled = true;


            let message;


            switch (error.code) {

                case 1:

                    message =
                        "Izin lokasi ditolak. Aktifkan izin lokasi pada browser.";

                    break;


                case 2:

                    message =
                        "Informasi lokasi tidak tersedia. Pastikan GPS/lokasi perangkat aktif.";

                    break;


                case 3:

                    message =
                        "Pengambilan lokasi timeout. Coba kembali.";

                    break;


                default:

                    message =
                        "Terjadi kesalahan saat mengambil lokasi.";
            }


            console.error(
                "GEOLOCATION ERROR:",
                error
            );


            setStatus(
                message,
                "error"
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

saveButton.addEventListener("click", () => {

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


    const requestUrl =
        GOOGLE_SCRIPT_URL +
        "?" +
        params.toString();


    console.log(
        "REQUEST URL:",
        requestUrl
    );


    /*
     * Kirim langsung menggunakan iframe.
     * Tidak menggunakan fetch().
     * Tidak menggunakan JSON.parse().
     */

    let iframe =
        document.getElementById(
            "googleScriptFrame"
        );


    if (!iframe) {

        iframe =
            document.createElement("iframe");

        iframe.id =
            "googleScriptFrame";

        iframe.name =
            "googleScriptFrame";

        iframe.style.display =
            "none";

        document.body.appendChild(
            iframe
        );
    }


    iframe.onload = () => {

        setStatus(
            "Data berhasil dikirim ke Google Spreadsheet.",
            "success"
        );


        saveButton.disabled = true;
        locationButton.disabled = false;


        console.log(
            "Request Google Apps Script selesai."
        );
    };


    iframe.src =
        requestUrl;
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

function setStatus(
    message,
    type
) {

    statusElement.textContent =
        message;


    switch (type) {

        case "success":

            statusElement.style.background =
                "#dcfce7";

            statusElement.style.color =
                "#166534";

            break;


        case "error":

            statusElement.style.background =
                "#fee2e2";

            statusElement.style.color =
                "#991b1b";

            break;


        case "loading":

            statusElement.style.background =
                "#dbeafe";

            statusElement.style.color =
                "#1e40af";

            break;


        default:

            statusElement.style.background =
                "#f3f4f6";

            statusElement.style.color =
                "#374151";
    }
}
