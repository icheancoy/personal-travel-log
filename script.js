const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxAaabjNyiGoaJlllP85BaWnwNthj7F-Xt0wUNuzVqUVg5aodiiqa1fcu4xmfK_83-K/exec";


console.log(
    "SCRIPT VERSION: 2026-09-17-FIX-01"
);


// =====================================================
// ELEMENT
// =====================================================

const taskInput =
    document.getElementById("task");

const locationButton =
    document.getElementById("locationButton");

const saveButton =
    document.getElementById("saveButton");

const statusBox =
    document.getElementById("status");

const resultBox =
    document.getElementById("result");

const resultTask =
    document.getElementById("resultTask");

const latitudeBox =
    document.getElementById("latitude");

const longitudeBox =
    document.getElementById("longitude");

const accuracyBox =
    document.getElementById("accuracy");

const waktuBox =
    document.getElementById("waktu");


let locationData = null;


// =====================================================
// STATUS
// =====================================================

function setStatus(message) {

    statusBox.textContent =
        message;

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

locationButton.addEventListener(
    "click",
    function () {

        const task =
            taskInput.value.trim();


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
                    formatDateTime(
                        new Date()
                    );


                // =====================================
                // SIMPAN DATA
                // =====================================

                locationData = {

                    task:
                        task,

                    latitude:
                        latitude,

                    longitude:
                        longitude,

                    accuracy:
                        accuracy,

                    waktu:
                        waktu

                };


                // =====================================
                // TAMPILKAN DATA
                // =====================================

                resultTask.textContent =
                    task;

                latitudeBox.textContent =
                    latitude.toFixed(6);

                longitudeBox.textContent =
                    longitude.toFixed(6);

                accuracyBox.textContent =
                    accuracy.toFixed(2) +
                    " meter";

                waktuBox.textContent =
                    waktu;


                resultBox.classList.remove(
                    "hidden"
                );


                locationButton.disabled =
                    false;

                saveButton.disabled =
                    false;


                setStatus(
                    "Lokasi berhasil diperoleh. Silakan klik SIMPAN LOG."
                );

            },


            function (error) {

                locationButton.disabled =
                    false;

                saveButton.disabled =
                    true;


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


                setStatus(
                    message
                );

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
);


// =====================================================
// SIMPAN LOG
// =====================================================

saveButton.addEventListener(
    "click",
    function () {

        if (!locationData) {

            setStatus(
                "Lokasi belum tersedia."
            );

            return;
        }


        saveButton.disabled =
            true;

        locationButton.disabled =
            true;


        setStatus(
            "Mengirim data ke Google Spreadsheet..."
        );


        console.log(
            "DATA YANG DIKIRIM:",
            locationData
        );


        // =============================================
        // BUAT / AMBIL IFRAME
        // =============================================

        let iframe =
            document.getElementById(
                "googlePostFrame"
            );


        if (!iframe) {

            iframe =
                document.createElement(
                    "iframe"
                );

            iframe.id =
                "googlePostFrame";

            iframe.name =
                "googlePostFrame";

            iframe.style.display =
                "none";

            document.body.appendChild(
                iframe
            );

        }


        // =============================================
        // BUAT FORM
        // =============================================

        const form =
            document.createElement(
                "form"
            );


        form.method =
            "POST";

        form.action =
            GOOGLE_SCRIPT_URL;

        form.target =
            "googlePostFrame";

        form.style.display =
            "none";


        // =============================================
        // DATA
        // =============================================

        const fields = {

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

        };


        Object.keys(fields).forEach(
            function (key) {

                const input =
                    document.createElement(
                        "input"
                    );

                input.type =
                    "hidden";

                input.name =
                    key;

                input.value =
                    fields[key];

                form.appendChild(
                    input
                );

            }
        );


        // =============================================
        // SUBMIT
        // =============================================

        document.body.appendChild(
            form
        );


        console.log(
            "POST KE GOOGLE APPS SCRIPT"
        );


        form.submit();


        // =============================================
        // SELESAI
        // =============================================

        setTimeout(
            function () {

                setStatus(
                    "Data telah dikirim. Silakan cek Google Spreadsheet."
                );


                saveButton.disabled =
                    true;

                locationButton.disabled =
                    false;


                if (form.parentNode) {

                    form.parentNode.removeChild(
                        form
                    );

                }

            },
            3000
        );

    }
);
