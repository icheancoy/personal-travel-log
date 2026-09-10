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
        "Tombol tidak ditemukan"
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


  button.disabled =
    true;


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


      console.log(
        "LATITUDE:",
        latitude
      );


      console.log(
        "LONGITUDE:",
        longitude
      );


      console.log(
        "ACCURACY:",
        accuracy
      );


      console.log(
        "WAKTU:",
        waktu
      );


      // ======================================
      // TAMPILKAN KE WEB
      // ======================================

      document.getElementById(
        "latitude"
      ).value =
        latitude;


      document.getElementById(
        "longitude"
      ).value =
        longitude;


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
        "Lokasi berhasil diperoleh. Menyimpan...";


      // ======================================
      // KIRIM
      // ======================================

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


      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {

        status.textContent =
          "Izin lokasi ditolak.";

      }

      else if (
        error.code ===
        error.POSITION_UNAVAILABLE
      ) {

        status.textContent =
          "Lokasi tidak tersedia.";

      }

      else if (
        error.code ===
        error.TIMEOUT
      ) {

        status.textContent =
          "GPS timeout.";

      }

      else {

        status.textContent =
          "Gagal mendapatkan lokasi.";

      }


      button.disabled =
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
 * KIRIM DATA DENGAN FORM GET
 * ==========================================
 */

function kirimKeGoogleSheet(
  latitude,
  longitude,
  accuracy,
  waktu
) {

  console.log(
    "Mempersiapkan pengiriman..."
  );


  /*
   * Buat form HTML.
   */

  const form =
    document.createElement(
      "form"
    );


  form.method =
    "GET";


  form.action =
    GOOGLE_SCRIPT_URL;


  form.target =
    "googleScriptFrame";


  /*
   * Latitude
   */

  const inputLatitude =
    document.createElement(
      "input"
    );


  inputLatitude.type =
    "hidden";


  inputLatitude.name =
    "latitude";


  inputLatitude.value =
    latitude;


  form.appendChild(
    inputLatitude
  );


  /*
   * Longitude
   */

  const inputLongitude =
    document.createElement(
      "input"
    );


  inputLongitude.type =
    "hidden";


  inputLongitude.name =
    "longitude";


  inputLongitude.value =
    longitude;


  form.appendChild(
    inputLongitude
  );


  /*
   * Accuracy
   */

  const inputAccuracy =
    document.createElement(
      "input"
    );


  inputAccuracy.type =
    "hidden";


  inputAccuracy.name =
    "accuracy";


  inputAccuracy.value =
    accuracy;


  form.appendChild(
    inputAccuracy
  );


  /*
   * Waktu
   */

  const inputWaktu =
    document.createElement(
      "input"
    );


  inputWaktu.type =
    "hidden";


  inputWaktu.name =
    "waktu";


  inputWaktu.value =
    waktu;


  form.appendChild(
    inputWaktu
  );


  /*
   * Masukkan form ke halaman
   */

  document.body.appendChild(
    form
  );


  console.log(
    "Mengirim form GET..."
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


  /*
   * Kirim form
   */

  form.submit();


  /*
   * Hapus form setelah submit
   */

  setTimeout(
    function () {

      form.remove();

    },
    3000
  );


  /*
   * Tampilkan status
   */

  setTimeout(
    function () {

      document.getElementById(
        "status"
      ).textContent =
        "Data lokasi berhasil dikirim.";

      document.getElementById(
        "status"
      ).className =
        "status status-success";


      document.getElementById(
        "btnAmbilLokasi"
      ).disabled =
        false;

    },
    3000
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
