import dayjs from 'dayjs';
import * as csv from 'postcss';


const getDistributionInfoFromSongData = (rowData) => {
  return {
    ClearedforKaraoke: rowData.ClearedforKaraoke,
    ClearedForTV: rowData.ClearedForTV,
    Kod: rowData.Kod,
    VirtualDj: rowData.VirtualDj,
    KaraokeCloudApi: rowData.KaraokeCloudApi,
  }
}

const getStatusInfoFromSongData = (rowData) => {
    return {
    SongNumber: rowData.SongNumber,
    Status: rowData.Status,
    Title: rowData.Title,
    Artist: rowData.Artist,
    ReleaseScheduledFor: dayjs(rowData.ReleaseScheduledFor),
    StatusUpdatedAt: dayjs(rowData.StatusUpdatedAt)
  }
}


const getBasicInfoFromSongData = (rowData) => {
  return {
    Title: rowData.Title,
    Artist: rowData.Artist,
    Genre: rowData.Genre,
    SongNumber: rowData.SongNumber,
    SubGenre: rowData.SubGenre,
    BarIntro: rowData.BarIntro,
    SongKey: rowData.SongKey,
    Duration: rowData.Duration,
    Mixes: rowData.Mixes,
    MixRendered: rowData.MixRendered,
    SongReleaseYear: rowData.SongReleaseYear,
    Description: rowData.Description,
    ReleaseScheduledFor: dayjs(rowData.ReleaseScheduledFor),
  }
}

const getLicensingInfoFromSongData = (rowData) => {
  return {
    ISRCCAMixVocal: rowData.ISRCCAMixVocal,
    ISRCCCMixKaraoke: rowData.ISRCCCMixKaraoke,
    ISRCCDMixInstrumental: rowData.ISRCCDMixInstrumental,
    ISRCAAMixVocal: rowData.ISRCAAMixVocal,
    ISRCACMixKaraoke: rowData.ISRCACMixKaraoke,
    ISRCADMixInstrumental: rowData.ISRCADMixInstrumental,
    HFALicenseNumber: rowData.HFALicenseNumber,
    HFASongCode: rowData.HFASongCode,
    ISWC: rowData.ISWC,
    MechanicalRegistrationNumberA: rowData.MechanicalRegistrationNumberA,
    MechanicalRegistrationNumberD: rowData.MechanicalRegistrationNumberD,
    MechanicalRegistrationNumberC: rowData.MechanicalRegistrationNumberC,
    Writer: rowData.Writer,
  }
}


const reduceCrossInfoForSong = (crossData) => {
  return {
    cleared: crossData.cleared,
    crossId: crossData.crossId,
    digitraxId: crossData.digitraxId,
    isrc: crossData.isrc,
    recordingType: crossData.recordingType,
    digitraxGroupId: crossData.digitraxGroupId,
    statusChangedAt: crossData.statusChangedAt
  }
}


function addIdForDataTable(data){
  return data.map((item, index) => {
    item.id = index
    return item
  })
}

function isWhiteSpace(value) {
  return /^\s*$/gm.test(value)
}

function upperCaseKey(field) {
  return field.slice(0, 1).toUpperCase() + field.slice(1)
}

function convertToJsonArray(filePath) {

// @ts-ignore
  return new Promise((resolve) => {
    const records = [];

    csv.parse(filePath.data, {columns: true, bom: true})
      // Use the readable stream api
      .on('readable', function () {
        let record;
        while ((record = this.read()) !== null) {
          records.push(record);
        }
      })
      .on('end', function () {
        resolve(records)
      })
  });
}

export {
  getDistributionInfoFromSongData,
  getStatusInfoFromSongData,
  getBasicInfoFromSongData,
  getLicensingInfoFromSongData,
  reduceCrossInfoForSong,
  isWhiteSpace,
  upperCaseKey,
  addIdForDataTable
}
