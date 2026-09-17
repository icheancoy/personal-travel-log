// =====================================================
// KONFIGURASI
// PENTING: URL ini harus sama persis dengan URL "exec"
// dari deployment Google Apps Script kamu.
// =====================================================
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwSWoLtiBHjBeyps5rWEOpT2TLHg0eOwVw0_ssExrXrnPba1Hfyey-vsG7TkRWWYD1M/exec";

// =====================================================
// ELEMENT REFERENCES
// =====================================================
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

// iframe target sudah ada di index.html, tidak perlu dibuat lagi di JS
const targetFrame = document.getElementById("googleScriptFrame");

let locationData = null;

// =====================================================
// HELPERS
// =====================================================

function setStatus(message) {
    statusBox.textContent = message;
}

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
    return new Intl.DateTimeFormat("id-ID", options).format(date);
}

function resetForm() {
    taskInput.value = "";
    locationData = null;
    resultBox.classList.add("hidden");
    saveButton.disabled = true;
}

// =====================================================
// AMBIL LOKASI
// =====================================================

locationButton.addEventListener("click", function () {
    const task = taskInput.value.trim();

    if (!task) {
        setStatus("Silakan isi Task / Kegiatan terlebih dahulu.");
        taskInput.focus();
        return;
    }

    if (!navigator.geolocation) {
        setStatus("Browser tidak mendukung GPS / Geolocation.");
        return;
    }

    locationButton.disabled = true;
    saveButton.disabled = true;
    setStatus("Sedang mengambil lokasi...");

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            const waktu = formatDateTime(new Date());

            locationData = { task, latitude, longitude, accuracy, waktu };

            resultTask.textContent = task;
            latitudeBox.textContent = latitude.toFixed(6);
            longitudeBox.textContent = longitude.toFixed(6);
            accuracyBox.textContent = accuracy.toFixed(2) + " meter";
            waktuBox.textContent = waktu;

            resultBox.classList.remove("hidden");
            saveButton.disabled = false;
            locationButton.disabled = false;

            setStatus("Lokasi berhasil diperoleh. Silakan klik SIMPAN LOG.");
        },
        function (error) {
            locationButton.disabled = false;
            saveButton.disabled = true;

            let message = "Gagal mendapatkan lokasi.";
            switch (error.code) {
                case 1:
                    message = "Izin lokasi ditolak. Silakan izinkan akses lokasi pada browser.";
                    break;
                case 2:
                    message = "Lokasi tidak tersedia.";
                    break;
                case 3:
                    message = "Waktu pengambilan lokasi habis.";
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
// SIMPAN LOG (kirim via hidden form -> iframe agar tidak
// terkena batasan CORS dari Google Apps Script)
// =====================================================

saveButton.addEventListener("click", function () {
    if (!locationData) {
        setStatus("Lokasi belum tersedia.");
        return;
    }

    saveButton.disabled = true;
    locationButton.disabled = true;
    setStatus("Mengirim data ke Google Spreadsheet...");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = GOOGLE_SCRIPT_URL;
    form.target = "googleScriptFrame";
    form.style.display = "none";

    const fields = {
        task: locationData.task,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
        waktu: locationData.waktu
    };

    Object.keys(fields).forEach(function (key) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Karena request dikirim ke iframe cross-origin, kita tidak bisa
    // membaca respons JSON-nya langsung dari browser. Kita anggap
    // berhasil setelah beberapa saat, lalu bersihkan form.
    setTimeout(function () {
        setStatus("Data terkirim. Silakan cek Google Spreadsheet (sheet \"Log\") untuk memastikan.");
        locationButton.disabled = false;
        resetForm();

        if (form.parentNode) {
            form.parentNode.removeChild(form);
        }
    }, 2500);
});
