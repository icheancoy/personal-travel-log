const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


let btnAmbilLokasi;
let latitudeInput;
let longitudeInput;
let accuracyInput;
let waktuInput;
let statusElement;


document.addEventListener(
  "DOMContentLoaded",
  function () {

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

  }
);


/**
 * ==========================================
 * AMBIL LOKASI
 * ==========================================
 */
function ambilLokasi() {

  console.log(
    "AMBIL LOKASI diklik"
  );


  if (!navigator.geolocation) {

    setStatus(
      "Browser tidak mendukung GPS.",
      "error"
    );

    return;
  }


  btnAmbilLokasi.disabled = true;


  setStatus(
    "Mengambil lokasi...",
    "loading"
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


      // ==========================
      // Tampilkan ke halaman
      // ==========================

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
        "Lokasi berhasil diperoleh. Mengirim data...",
        "loading"
      );


      // ==========================
      // Kirim ke Spreadsheet
      // ==========================

      kirimKeGoogleSheet(
        latitude,
        longitude,
        accuracy,
        waktu
      );

    },


    function (error) {

      console.error(
        "GPS ERROR:",
        error
      );


      let message =
        "Gagal mengambil lokasi.";


      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {

        message =
          "Izin lokasi ditolak.";

      }


      else if (
        error.code ===
        error.POSITION_UNAVAILABLE
      ) {

        message =
          "Lokasi tidak tersedia.";

      }


      else if (
        error.code ===
        error.TIMEOUT
      ) {

        message =
          "Pengambilan lokasi timeout.";

      }


      setStatus(
        message,
        "error"
      );


      btnAmbilLokasi.disabled =
        false;

    },


    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }

  );

}


/**
 * ==========================================
 * KIRIM KE GOOGLE SHEET
 * ==========================================
 */
function kirimKeGoogleSheet(
  latitude,
  longitude,
  accuracy,
  waktu
) {

  console.log(
    "Mengirim data ke Google Spreadsheet..."
  );


  const url =
    GOOGLE_SCRIPT_URL +
    "?latitude=" +
    encodeURIComponent(
      latitude
    ) +
    "&longitude=" +
    encodeURIComponent(
      longitude
    ) +
    "&accuracy=" +
    encodeURIComponent(
      accuracy
    ) +
    "&waktu=" +
    encodeURIComponent(
      waktu
    );


  console.log(
    "URL:",
    url
  );


  /*
   * Menggunakan GET.
   *
   * Image request tidak terkena masalah
   * CORS seperti fetch POST.
   */
  const request =
    new Image();


  request.onload =
    function () {

      console.log(
        "Request selesai."
      );

    };


  request.onerror =
    function () {

      console.log(
        "Request dikirim ke Apps Script."
      );

    };


  request.src =
    url;


  /*
   * Jangan langsung menganggap response
   * sebagai bukti spreadsheet sudah tersimpan.
   *
   * Status ini menunjukkan request sudah
   * dikirim ke endpoint Apps Script.
   */
  setStatus(
    "Data lokasi sedang disimpan ke Spreadsheet...",
    "loading"
  );


  /*
   * Beri sedikit waktu untuk Apps Script
   * memproses request.
   */
  setTimeout(
    function () {

      setStatus(
        "Data lokasi telah dikirim.",
        "success"
      );


      btnAmbilLokasi.disabled =
        false;

    },
    1500
  );

}


/**
 * ==========================================
 * FORMAT WAKTU
 * ==========================================
 */
function formatWaktu(timestamp) {

  const date =
    timestamp
      ? new Date(timestamp)
      : new Date();


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      timeZone: "Asia/Jakarta",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",

      hour12: false
    }
  ).format(date);

}


/**
 * ==========================================
 * STATUS
 * ==========================================
 */
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
