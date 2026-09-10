const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxi5VRkmIWTsKyLhoqg4t6gpSvBwrqwY82i1OprwJ1w_Z/exec";


document.addEventListener(
  "DOMContentLoaded",
  function () {

    const button =
      document.getElementById(
        "btnAmbilLokasi"
      );

    if (!button) {

      console.error(
        "btnAmbilLokasi tidak ditemukan"
      );

      return;

    }


    button.addEventListener(
      "click",
      ambilLokasi
    );

  }
);


function ambilLokasi() {

  const button =
    document.getElementById(
      "btnAmbilLokasi"
    );


  const status =
    document.getElementById(
      "status"
    );


  if (!navigator.geolocation) {

    status.textContent =
      "Browser tidak mendukung GPS.";

    return;

  }


  button.disabled = true;

  status.textContent =
    "Mengambil lokasi...";


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


      // =====================================
      // TAMPILKAN DATA
      // =====================================

      document.getElementById(
        "latitude"
      ).value =
        latitude.toFixed(7);


      document.getElementById(
        "longitude"
      ).value =
        longitude.toFixed(7);


      document.getElementById(
        "accuracy"
      ).value =
        accuracy.toFixed(2) +
        " meter";


      document.getElementById(
        "waktu"
      ).value =
        waktu;


      status.textContent =
        "Lokasi diperoleh. Mengirim data...";


      // =====================================
      // KIRIM
      // =====================================

      kirimData(
        latitude,
        longitude,
        accuracy,
        waktu
      );

    },


    function (error) {

      console.error(error);


      status.textContent =
        "Gagal mendapatkan lokasi.";


      button.disabled = false;

    },


    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    }

  );

}


function kirimData(
  latitude,
  longitude,
  accuracy,
  waktu
) {


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
    "URL Google Apps Script:"
  );

  console.log(url);


  const status =
    document.getElementById(
      "status"
    );


  /*
   * Buat iframe tersembunyi.
   *
   * Browser akan melakukan GET request
   * langsung ke Apps Script.
   */

  const iframe =
    document.createElement(
      "iframe"
    );


  iframe.style.display =
    "none";


  iframe.src =
    url;


  document.body.appendChild(
    iframe
  );


  /*
   * Jangan langsung menyatakan berhasil.
   *
   * Tunggu sebentar agar Apps Script
   * mempunyai waktu untuk appendRow().
   */

  setTimeout(
    function () {

      status.textContent =
        "Data lokasi sudah dikirim.";

      status.className =
        "status status-success";


      buttonAktifkan();

    },
    3000
  );

}


function buttonAktifkan() {

  const button =
    document.getElementById(
      "btnAmbilLokasi"
    );

  if (button) {

    button.disabled =
      false;

  }

}


function formatWaktu(timestamp) {

  const date =
    timestamp
      ? new Date(timestamp)
      : new Date();


  return new Intl.DateTimeFormat(
    "id-ID",
    {

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

    }
  ).format(date);

}
