


export const booleanOptions = ['true', 'false']


export const statusOptions = ['started', 'collected', 'cleared', 'prepped For Distribution', 'In Distribution']

export const dropDownOptionSets = {
  booleanOptions,
  statusOptions
}
export const dropDownColumns = ["ClearedforKaraoke", "ClearedForTV", "Kod", "Vevo", "VirtualDj", "KaraokeCloudApi", "Status"]


export const dropDownOptionMap = {
  ClearedforKaraoke: "booleanOptions",
  ClearedForTV: "booleanOptions",
  Kod: "booleanOptions",
  Vevo: "booleanOptions",
  VirtualDj: "booleanOptions",
  KaraokeCloudApi: "booleanOptions",
  Status: "statusOptions"

}

export const statusInformationDefault = {
  ClearedforKaraoke: false,
  ClearedForTV: false,
  Kod: false,
  Vevo: false,
  VirtualDj: false,
  KaraokeCloudApi: false,
  Status: ''

}

export const licensingInformationDefault = {
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: ""
}

export const basicInformationDefault = {
  Title: "",
  Artist: "",
  Genre: "",
  SongNumber: "",
  SubGenre: "",
  BarIntro: "",
  SongKey: "",
  Duration: "",
  Mixes: "",
  MixRendered: "",
  SongReleaseYear: "",
  Description: "",
}
