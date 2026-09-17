const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzex8Fm438xhtKQ-BtHqUBS4bEufrlf_PC4MLfAl99k7JW_-BdWLmrlW7PIr39J5Vg1/exec";


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

locationButton.addEventListener(
    "click",
    function () {

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


        if (!navigator.geolocation) {

            setStatus(
                "Browser tidak mendukung GPS / Geolocation.",
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


                const now =
                    new Date();


                const waktu =
                    formatDateTime(now);


                locationData = {

                    task:
                        task,

                    latitude:
                        latitude.toFixed(8),

                    longitude:
                        longitude.toFixed(8),

                    accuracy:
                        accuracy.toFixed(2),

                    waktu:
                        waktu
                };


                /* ==========================
                   TAMPILKAN HASIL
                   ========================== */

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


            function (error) {

                locationButton.disabled = false;

                saveButton.disabled = true;


                let message =
                    "Gagal mendapatkan lokasi.";


                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        message =
                            "Izin lokasi ditolak. Aktifkan izin lokasi pada browser.";

                        break;


                    case error.POSITION_UNAVAILABLE:

                        message =
                            "Informasi lokasi tidak tersedia.";

                        break;


                    case error.TIMEOUT:

                        message =
                            "Pengambilan lokasi timeout.";

                        break;


                    default:

                        message =
                            "Terjadi kesalahan saat mengambil lokasi.";
                }


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
    }
);


/* ==========================================
   SIMPAN LOG
   ========================================== */

saveButton.addEventListener(
    "click",
    async function () {

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
            new URLSearchParams({

                task:
                    locationData.task,

                latitude:
                    locationData.latitude,

                longitude:
                    locationData.longitude,

                accuracy:
                    locationData.accuracy,

                waktu:
                    locationData.waktu

            });


        const requestUrl =
            GOOGLE_SCRIPT_URL +
            "?" +
            params.toString();


        console.log(
            "REQUEST URL:",
            requestUrl
        );


        try {

            const response =
                await fetch(
                    requestUrl,
                    {
                        method: "GET",

                        cache: "no-cache"
                    }
                );


            const text =
                await response.text();


            console.log(
                "SERVER RESPONSE:",
                text
            );


            let result;


            try {

                result =
                    JSON.parse(text);

            }
            catch (jsonError) {

                throw new Error(
                    "Response Google Apps Script bukan JSON: " +
                    text
                );
            }


            if (
                result.status !==
                "success"
            ) {

                throw new Error(
                    result.message ||
                    "Google Apps Script gagal menyimpan data."
                );
            }


            setStatus(
                "Data berhasil disimpan ke Google Spreadsheet.",
                "success"
            );


            saveButton.disabled = true;

            locationButton.disabled = false;


        }
        catch (error) {

            console.error(
                "SAVE ERROR:",
                error
            );


            setStatus(
                "Gagal mengirim data: " +
                error.message,
                "error"
            );


            saveButton.disabled = false;

            locationButton.disabled = false;
        }
    }
);


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
