function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Data Kredit Debitur - BRI")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getData() {
  try {
    console.log("Getting data from sheet...");
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    
    if (!sheet) {
      throw new Error("Sheet 'Sheet1' tidak ditemukan");
    }
    
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();
    
    console.log("Raw data:", data);
    
    if (data.length === 0) {
      return [];
    }
    
    // Jika hanya ada header tanpa data
    if (data.length === 1) {
      return [];
    }
    
    // Urutan kolom yang benar sesuai sheet
    const EXPECTED_HEADERS = [
      'No', 'KodeBranch', 'NamaDebitur', 'CIF', 'NoRekFasilitas', 
      'FasilitasKredit', 'JatuhTempoFasilitas', 'Plafond', 'NoPerjanjian', 
      'TanggalPerjanjian', 'JenisDokAgunan', 'NoDokAgunan', 'TglJatuhTempoAgunan', 
      'NilaiAgunan', 'PenyimpananAgunan', 'KetAgunan', 'NoCoverNote1', 
      'TglCoverNote1', 'JenisPengikatan', 'NoDokPengikatan', 'NilaiPengikatan', 
      'PenyimpananPengikatan', 'KetPengikatan', 'NoCoverNote2', 'TglCoverNote2', 
      'Ruang', 'Lemari', 'Rak', 'Baris'
    ];
    
    const headers = data[0].map(h => String(h).trim());
    const rows = data.slice(1);
    
    console.log("Headers from sheet:", headers);
    console.log("Expected headers:", EXPECTED_HEADERS);
    console.log("Rows count:", rows.length);
    
    // Buat array of objects dengan urutan yang benar
    const result = rows.map((row, index) => {
      let obj = {};
      
      // Gunakan urutan header yang diharapkan, ambil data sesuai posisi di sheet
      EXPECTED_HEADERS.forEach((expectedHeader, i) => {
        if (i < headers.length && i < row.length) {
          obj[expectedHeader] = row[i] !== undefined && row[i] !== null ? String(row[i]).trim() : "";
        } else {
          obj[expectedHeader] = "";
        }
      });
      
      return obj;
    }).filter(obj => {
      // Filter out completely empty rows
      return Object.values(obj).some(value => value !== "");
    });
    
    console.log("Processed result:", result);
    return result;
    
  } catch (error) {
    console.error("Error in getData:", error);
    throw new Error("Gagal mengambil data: " + error.message);
  }
}

function simpanData(data) {
  try {
    console.log("Saving data:", data);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    
    if (!sheet) {
      throw new Error("Sheet 'Sheet1' tidak ditemukan");
    }
    
    // Urutan kolom yang benar sesuai sheet
    const COLUMN_ORDER = [
      'No', 'KodeBranch', 'NamaDebitur', 'CIF', 'NoRekFasilitas', 
      'FasilitasKredit', 'JatuhTempoFasilitas', 'Plafond', 'NoPerjanjian', 
      'TanggalPerjanjian', 'JenisDokAgunan', 'NoDokAgunan', 'TglJatuhTempoAgunan', 
      'NilaiAgunan', 'PenyimpananAgunan', 'KetAgunan', 'NoCoverNote1', 
      'TglCoverNote1', 'JenisPengikatan', 'NoDokPengikatan', 'NilaiPengikatan', 
      'PenyimpananPengikatan', 'KetPengikatan', 'NoCoverNote2', 'TglCoverNote2', 
      'Ruang', 'Lemari', 'Rak', 'Baris'
    ];
    
    console.log("Column order:", COLUMN_ORDER);
    
    // Buat array nilai baru sesuai urutan kolom yang benar
    const newRow = COLUMN_ORDER.map(column => {
      const value = data[column] || "";
      return String(value).trim();
    });
    
    console.log("New row to append:", newRow);
    
    // Tambahkan ke sheet
    sheet.appendRow(newRow);
    
    return {
      success: true,
      message: "Data berhasil disimpan ke database!",
      timestamp: new Date().toLocaleString()
    };
    
  } catch (error) {
    console.error("Error in simpanData:", error);
    return {
      success: false,
      message: "Gagal menyimpan data: " + error.message,
      timestamp: new Date().toLocaleString()
    };
  }
}

// Fungsi untuk debugging - bisa dihapus setelah selesai
function testGetData() {
  try {
    const result = getData();
    console.log("Test result:", result);
    return result;
  } catch (error) {
    console.error("Test error:", error);
    return error.message;
  }
}

// Fungsi untuk melihat struktur sheet - bisa dihapus setelah selesai
function debugSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();
  
  console.log("Sheet name:", sheet.getName());
  console.log("Last row:", sheet.getLastRow());
  console.log("Last column:", sheet.getLastColumn());
  console.log("All data:", data);
  
  return {
    sheetName: sheet.getName(),
    lastRow: sheet.getLastRow(),
    lastColumn: sheet.getLastColumn(),
    data: data
  };
}
