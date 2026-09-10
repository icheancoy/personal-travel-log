// ======================================================
// TRAVEL LOG GOOGLE APPS SCRIPT
// ======================================================


// ID GOOGLE SPREADSHEET
const SPREADSHEET_ID =
    "1AVgGfJP9T-E_4DqGK9LEiW58HqGg7Hz";


// NAMA TAB SHEET
const SHEET_NAME =
    "Sheet1";


// ======================================================
// GET
// ======================================================

function doGet(e) {

    return ContentService
        .createTextOutput(
            JSON.stringify({
                success: true,
                message: "Travel Log API aktif."
            })
        )
        .setMimeType(
            ContentService.MimeType.JSON
        );

}


// ======================================================
// POST
// ======================================================

function doPost(e) {

    try {

        console.log(
            "================================"
        );

        console.log(
            "DO POST"
        );

        console.log(
            "================================"
        );


        // ==============================================
        // CEK EVENT
        // ==============================================

        if (!e) {

            throw new Error(
                "Event tidak tersedia."
            );

        }


        console.log(
            "Parameter:",
            JSON.stringify(e.parameter)
        );


        // ==============================================
        // AMBIL DATA
        // ==============================================

        const latitude =
            e.parameter.latitude;


        const longitude =
            e.parameter.longitude;


        const accuracy =
            e.parameter.accuracy;


        const waktu =
            e.parameter.waktu;


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


        // ==============================================
        // VALIDASI
        // ==============================================

        if (!latitude) {

            throw new Error(
                "Latitude kosong."
            );

        }


        if (!longitude) {

            throw new Error(
                "Longitude kosong."
            );

        }


        // ==============================================
        // BUKA SPREADSHEET
        // ==============================================

        const spreadsheet =
            SpreadsheetApp.openById(
                SPREADSHEET_ID
            );


        // ==============================================
        // AMBIL SHEET
        // ==============================================

        let sheet =
            spreadsheet.getSheetByName(
                SHEET_NAME
            );


        // ==============================================
        // BUAT SHEET JIKA BELUM ADA
        // ==============================================

        if (!sheet) {

            sheet =
                spreadsheet.insertSheet(
                    SHEET_NAME
                );

        }


        // ==============================================
        // HEADER
        // ==============================================

        if (
            sheet.getLastRow() === 0
        ) {

            sheet.appendRow([

                "Timestamp",

                "Latitude",

                "Longitude",

                "Accuracy",

                "Waktu"

            ]);

        }


        // ==============================================
        // TIMESTAMP SERVER
        // ==============================================

        const timestamp =
            new Date();


        // ==============================================
        // SIMPAN
        // ==============================================

        sheet.appendRow([

            timestamp,

            latitude,

            longitude,

            accuracy,

            waktu

        ]);


        // ==============================================
        // RESPONSE
        // ==============================================

        return ContentService

            .createTextOutput(
                JSON.stringify({

                    success:
                        true,

                    message:
                        "Lokasi berhasil disimpan."

                })
            )

            .setMimeType(
                ContentService.MimeType.JSON
            );


    }

    catch (error) {

        console.error(
            "ERROR:",
            error
        );


        return ContentService

            .createTextOutput(
                JSON.stringify({

                    success:
                        false,

                    message:
                        error.message

                })
            )

            .setMimeType(
                ContentService.MimeType.JSON
            );

    }

}
