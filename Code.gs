/**
 * Google Apps Script Backend — Portal Persuratan & BA Subdit 5 (2026)
 * Subdirektorat Sistem Penyelenggaraan dan Pengusahaan Bandar Udara
 * Direktorat Bandar Udara, Direktorat Jenderal Perhubungan Udara, Kementerian Perhubungan RI
 */

const SHEET_SURAT_KELUAR = 'Surat Keluar 2026';
const SHEET_BA_JASA = 'BA DOC Jasa Terkait 2026';
const SHEET_MASTER_BANDARA = 'Master Bandara';

// ID Folder Google Drive (Disesuaikan dengan folder Drive dinas Anda)
const PARENT_FOLDER_ND_ID = '1-PARENT_FOLDER_ND_KASUBDIT';
const PARENT_FOLDER_SURAT_ID = '1-PARENT_FOLDER_SURAT_DIREKTUR';
const PARENT_FOLDER_BA_ID = '1-PARENT_FOLDER_DOKUMEN_BA';

/**
 * Inisialisasi Sheet Master Bandara jika belum tersedia
 */
function getOrCreateMasterBandaraSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_MASTER_BANDARA);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_MASTER_BANDARA);
    const headers = ['Kode Bandara', 'Nama Lengkap Bandara'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    // Seed data master bandara awal
    const defaultBandara = [
      ['CGK', 'Soekarno-Hatta (Tangerang)'],
      ['HLP', 'Halim Perdanakusuma (Jakarta)'],
      ['GTO', 'Djalaluddin (Gorontalo)'],
      ['TIM', 'Mozes Kilangin (Timika)'],
      ['BDO', 'Husein Sastranegara (Bandung)'],
      ['TRK', 'Juwata (Tarakan)'],
      ['BWX', 'Banyuwangi'],
      ['PLM', 'Sultan Mahmud Badaruddin II (Palembang)'],
      ['SRG', 'Jenderal Ahmad Yani (Semarang)'],
      ['LBJ', 'Komodo (Labuan Bajo)'],
      ['UPG', 'Sultan Hasanuddin (Makassar)'],
      ['KNO', 'Kualanamu (Medan)'],
      ['BIK', 'Frans Kaisiepo (Biak)']
    ];
    defaultBandara.forEach(row => sheet.appendRow(row));
  }
  return sheet;
}

/**
 * Menambahkan bandara baru ke Master Bandara bila belum terdaftar
 */
function registerBandaraIfNew(ss, kodeBandara, namaBandara) {
  if (!kodeBandara) return;
  const kodeClean = String(kodeBandara).trim().toUpperCase();
  const namaClean = String(namaBandara || kodeClean).trim();

  const sheet = getOrCreateMasterBandaraSheet(ss);
  const data = sheet.getDataRange().getValues();
  
  let exists = false;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === kodeClean) {
      exists = true;
      break;
    }
  }

  if (!exists) {
    sheet.appendRow([kodeClean, namaClean]);
  }
}

/**
 * Endpoint GET: Mengambil data persuratan, BA, dan Master Bandara
 */
function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === 'getSuratKeluar') {
      const sheet = ss.getSheetByName(SHEET_SURAT_KELUAR);
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheet.getDataRange().getValues();
      const rows = data.length > 1 ? data.slice(1) : [];
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getBAJasaTerkait') {
      const sheet = ss.getSheetByName(SHEET_BA_JASA);
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheet.getDataRange().getValues();
      const rows = data.length > 1 ? data.slice(1) : [];
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getBandara') {
      const sheet = getOrCreateMasterBandaraSheet(ss);
      const data = sheet.getDataRange().getValues();
      const rows = data.length > 1 ? data.slice(1) : [];
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: rows }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Aksi GET tidak valid' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Endpoint POST: Menangani mutasi data dan unggahan berkas Base64
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Batas tunggu concurrency 30 detik
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Tambah Surat Keluar
    if (action === 'addSuratKeluar') {
      const sheet = ss.getSheetByName(SHEET_SURAT_KELUAR);
      const lastRow = sheet.getLastRow();
      const noUrut = lastRow; // Asumsi header pada baris 1
      const tahun = new Date().getFullYear();
      const nomorSurat = `ND.${noUrut}/DBU.5/${tahun}`;

      let linkND = '';
      let linkSurat = '';

      if (payload.fileNotaKasubdit) {
        linkND = saveBase64File(payload.fileNotaKasubdit, PARENT_FOLDER_ND_ID, `ND_${noUrut}_${payload.konseptor}.pdf`);
      }
      if (payload.fileSuratDirektur) {
        linkSurat = saveBase64File(payload.fileSuratDirektur, PARENT_FOLDER_SURAT_ID, `Surat_${noUrut}_${payload.konseptor}.pdf`);
      }

      sheet.appendRow([
        noUrut,
        payload.tanggal,
        nomorSurat,
        payload.konseptor,
        payload.perihal,
        payload.tujuan || 'Direktur Bandar Udara',
        payload.keterangan || '-',
        linkND,
        linkSurat
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Surat Keluar berhasil disimpan.',
        nomorSurat: nomorSurat
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Pembaruan Surat Keluar (Upload Susulan)
    if (action === 'updateSuratKeluar') {
      const sheet = ss.getSheetByName(SHEET_SURAT_KELUAR);
      const data = sheet.getDataRange().getValues();
      let targetRowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(payload.noUrut) || String(data[i][2]) === String(payload.nomorSurat)) {
          targetRowIndex = i + 1;
          break;
        }
      }

      if (targetRowIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Surat tidak ditemukan.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      if (payload.fileNotaKasubdit) {
        const linkND = saveBase64File(payload.fileNotaKasubdit, PARENT_FOLDER_ND_ID, `ND_${payload.noUrut}_update.pdf`);
        sheet.getRange(targetRowIndex, 8).setValue(linkND);
      }
      if (payload.fileSuratDirektur) {
        const linkSurat = saveBase64File(payload.fileSuratDirektur, PARENT_FOLDER_SURAT_ID, `Surat_${payload.noUrut}_update.pdf`);
        sheet.getRange(targetRowIndex, 9).setValue(linkSurat);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dokumen surat berhasil diperbarui.',
        nomorSurat: payload.nomorSurat
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Tambah Berita Acara (BA DOC Jasa Terkait)
    if (action === 'addBAJasaTerkait') {
      const sheet = ss.getSheetByName(SHEET_BA_JASA);
      const lastRow = sheet.getLastRow();
      const noUrut = lastRow;
      const tahun = new Date().getFullYear();
      
      const kodeBandara = String(payload.kodeBandara || 'SUB').trim().toUpperCase();
      const lokasiBandara = payload.lokasiBandara || kodeBandara;

      // Otomatis daftarkan bandara baru bila flag isManualBandara aktif
      if (payload.isManualBandara) {
        registerBandaraIfNew(ss, kodeBandara, payload.namaBandaraBaru || lokasiBandara);
      }

      // Format Nomor BA otomatis kedinasan
      const nomorBA = Utilities.formatString("BA.%03d/DBU.5/BA.SS/DOK-%s/%s", noUrut, kodeBandara, tahun);

      let linkBA = '';
      if (payload.fileBA) {
        linkBA = saveBase64File(payload.fileBA, PARENT_FOLDER_BA_ID, `BA_${noUrut}_${kodeBandara}_${payload.namaPT}.pdf`);
      }

      sheet.appendRow([
        noUrut,
        payload.tanggal,
        nomorBA,
        payload.namaPT,
        lokasiBandara,
        linkBA,
        payload.picList
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Berita Acara berhasil disimpan.',
        nomorBA: nomorBA
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Pembaruan Berita Acara (Update Data & Upload Susulan)
    if (action === 'updateBAJasaTerkait') {
      const sheet = ss.getSheetByName(SHEET_BA_JASA);
      const data = sheet.getDataRange().getValues();
      let targetRowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(payload.noUrut) || String(data[i][2]) === String(payload.nomorBA)) {
          targetRowIndex = i + 1;
          break;
        }
      }

      if (targetRowIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Data Berita Acara tidak ditemukan.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      const kodeBandara = String(payload.kodeBandara || '').trim().toUpperCase();
      const lokasiBandara = payload.lokasiBandara || '';

      if (payload.isManualBandara && kodeBandara) {
        registerBandaraIfNew(ss, kodeBandara, payload.namaBandaraBaru || lokasiBandara);
      }

      if (payload.namaPT) sheet.getRange(targetRowIndex, 4).setValue(payload.namaPT);
      if (lokasiBandara) sheet.getRange(targetRowIndex, 5).setValue(lokasiBandara);
      if (payload.picList) sheet.getRange(targetRowIndex, 7).setValue(payload.picList);

      if (payload.fileBA) {
        const linkBA = saveBase64File(payload.fileBA, PARENT_FOLDER_BA_ID, `BA_${payload.noUrut}_update.pdf`);
        sheet.getRange(targetRowIndex, 6).setValue(linkBA);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data Berita Acara berhasil diperbarui.',
        nomorBA: payload.nomorBA
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Aksi POST tidak dikenali.' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Utilitas untuk menyimpan berkas Base64 ke folder Drive dan mengembalikan URL publik
 */
function saveBase64File(base64Data, parentFolderId, fileName) {
  try {
    const splitData = base64Data.split(',');
    const rawData = splitData.length > 1 ? splitData[1] : splitData[0];
    const decoded = Utilities.base64Decode(rawData);
    const blob = Utilities.newBlob(decoded, 'application/pdf', fileName);

    let folder;
    try {
      folder = DriveApp.getFolderById(parentFolderId);
    } catch (e) {
      folder = DriveApp.getRootFolder();
    }

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    Logger.log('Gagal menyimpan file: ' + err.toString());
    return '';
  }
}
