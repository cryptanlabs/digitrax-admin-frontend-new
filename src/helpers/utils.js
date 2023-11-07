


const getStatusInfoFromSongData = (rowData) => {
  return {
    ClearedforKaraoke: rowData.ClearedforKaraoke,
    ClearedForTV: rowData.ClearedForTV,
    Kod: rowData.Kod,
    VirtualDj: rowData.VirtualDj,
    KaraokeCloudApi: rowData.KaraokeCloudApi,
    Status: rowData.Status,
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
  }
}

const getLicensingInfoFromSongData = (rowData) => {
  return {
    ISRCCAMixVocal: rowData.ISRCCAMixVocal,
    HFASongCode: rowData.HFASongCode,
    MechanicalRegistrationNumberA: rowData.MechanicalRegistrationNumberA,
    MechanicalRegistrationNumberD: rowData.MechanicalRegistrationNumberD,
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


export {
  getStatusInfoFromSongData,
  getBasicInfoFromSongData,
  getLicensingInfoFromSongData,
  reduceCrossInfoForSong
}
