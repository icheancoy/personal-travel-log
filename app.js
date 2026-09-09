const API_URL =
    "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z8-COnR7IdSBrdhvn3odbXD/exec";

const barcodeInput = document.getElementById("barcode");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const accuracyInput = document.getElementById("accuracy");
const timestampInput = document.getElementById("timestamp");

const scanButton = document.getElementById("scanButton");
const stopScanButton = document.getElementById("stopScanButton");
const locationButton = document.getElementById("locationButton");
const saveButton = document.getElementById("saveButton");

const barcodeVideo = document.getElementById("barcodeVideo");
const statusElement = document.getElementById("status");

let barcodeReader = null;
let scannerControls = null;

scanButton.addEventListener("click", startScanner);
stopScanButton.addEventListener("click", stopScanner);
locationButton.addEventListener("click", getLocation);
saveButton.addEventListener("click", saveLog);

async function startScanner() {
    try {
        if (!window.ZXingBrowser) {
            throw new Error("Library barcode scanner belum termuat.");
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Browser tidak mendukung akses kamera.");
        }

        showStatus("Membuka kamera...", "info");

        barcodeReader = new ZXingBrowser.BrowserMultiFormatReader();

        barcodeVideo.style.display = "block";
        scanButton.style.display = "none";
        stopScanButton.style.display = "block";

        scannerControls = await barcodeReader.decodeFromConstraints(
            {
                video: {
                    facingMode: { ideal: "environment" }
                }
            },
            barcodeVideo,
            (result) => {
                if (!result) return;

                const barcode = result.getText().trim();

                if (!barcode) return;

                barcodeInput.value = barcode;
                stopScanner();

                showStatus(
                    "Barcode berhasil dibaca. Mengambil lokasi...",
                    "info"
                );

                getLocation();
            }
        );
    } catch (error) {
        console.error("Scanner Error:", error);
        showStatus(
            "Tidak dapat membuka kamera: " + error.message,
            "error"
        );
        stopScanner();
    }
}

function stopScanner() {
    try {
        if (scannerControls) {
            scannerControls.stop();
            scannerControls = null;
        }

        barcodeReader = null;

        barcodeVideo.style.display = "none";
        scanButton.style.display = "block";
        stopScanButton.style.display = "none";
    } catch (error) {
        console.error("Stop Scanner Error:", error);
    }
}

function getLocation() {
    if (!navigator.geolocation) {
        showStatus("Browser tidak mendukung GPS.", "error");
        return;
    }

    showStatus("Mengambil lokasi GPS...", "info");
    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            latitudeInput.value = latitude.toFixed(7);
            longitudeInput.value = longitude.toFixed(7);
            accuracyInput.value = accuracy.toFixed(2) + " meter";

            locationButton.disabled = false;

            showStatus("Lokasi berhasil diperoleh.", "success");
        },
        (error) => {
            console.error("GPS Error:", error);

            locationButton.disabled = false;

            let message = "Gagal mengambil lokasi.";

            if (error.code === 1) {
                message = "Izin lokasi ditolak. Aktifkan permission lokasi.";
            } else if (error.code === 2) {
                message = "Lokasi tidak tersedia.";
            } else if (error.code === 3) {
                message = "Waktu mengambil lokasi habis.";
            }

            showStatus(message, "error");
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

async function saveLog() {
    const barcode = barcodeInput.value.trim();
    const latitude = latitudeInput.value.trim();
    const longitude = longitudeInput.value.trim();
    const accuracy = accuracyInput.value.replace(" meter", "").trim();

    if (!barcode) {
        showStatus("Barcode belum tersedia.", "error");
        return;
    }

    if (!latitude || !longitude) {
        showStatus("Lokasi GPS belum tersedia.", "error");
        return;
    }

    if (!accuracy) {
        showStatus("Accuracy GPS belum tersedia.", "error");
        return;
    }

    saveButton.disabled = true;
    saveButton.innerText = "MENYIMPAN...";

    showStatus("Menyimpan data ke Google Sheets...", "info");

    const data = {
        barcode: barcode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: parseFloat(accuracy)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("API Response:", result);

        if (result.status !== "success") {
            throw new Error(result.message || "Gagal menyimpan data.");
        }

        timestampInput.value = result.timestamp || formatDateTime(new Date());

        showStatus(
            "Log berhasil disimpan. ID: " + result.id,
            "success"
        );

        barcodeInput.value = "";
        latitudeInput.value = "";
        longitudeInput.value = "";
        accuracyInput.value = "";

    } catch (error) {
        console.error("Save Error:", error);

        showStatus(
            "Gagal menyimpan log: " + error.message,
            "error"
        );
    } finally {
        saveButton.disabled = false;
        saveButton.innerText = "SIMPAN LOG";
    }
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function showStatus(message, type = "info") {
    statusElement.innerText = message;
    statusElement.className = "status " + type;
}
