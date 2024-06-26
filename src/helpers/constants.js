import dayjs from 'dayjs';


export const booleanOptions = ['true', 'false']

export const statusOptionsText = {
  Status1: 'Initial Song Entry',
  Status2: 'Song Information Gathering',
  Status3: 'Song Media Creation In Progress',
  Status4: 'Song Quality Assurance',
  Status5: 'Live On API Only',
  Status6: 'Live On API and Third PArty Sites',
  Status7: 'In Queue to Remove From API Distribution',
  Status8: 'Removed from Cleared List Still Live',
  status9: 'Not Live Through Any Channels',
  status10: 'Question/Attention Needed'
}
export const statusOptions = ['Status1', 'Status2', 'Status3', 'Status4', 'Status5', 'Status6', 'Status7', 'Status8', 'status9', 'status10']

export const dropDownOptionSets = {
  booleanOptions,
  statusOptions
}
export const dropDownColumns = ["ClearedforKaraoke", "ClearedForKr38r", "ClearedForTV", "Kod", "Vevo", "VirtualDj", "KaraokeCloudApi", "Status"]


export const dropDownOptionMap = {
  ClearedforKaraoke: "booleanOptions",
  ClearedForKr38r:  "booleanOptions",
  ClearedForTV: "booleanOptions",
  Kod: "booleanOptions",
  Vevo: "booleanOptions",
  VirtualDj: "booleanOptions",
  KaraokeCloudApi: "booleanOptions",
  Status: "statusOptions"

}

// Mapping of table columns to display column names
export const ColumnHeadersMap = {
  Title: "Title",
  Artist: "Artist",
  Genre: "Genre",
  SongNumber: "Catalog Number",
  SubGenre: "Sub-Genre",
  BarIntro: "Bar Intro",
  SongKey: "Song Key",
  Duration: "Duration",
  Mixes: "Mixes",
  MixRendered: "Mix Rendered",
  SongReleaseYear: "Song Release Year",
  Description: "Description",
  ReleaseScheduledFor: "Release Scheduled For",
  MechanicalRegistrationNumberA: "Mech. Reg. Num. A",
  MechanicalRegistrationNumberC: "Mech. Reg. Num. C",
  MechanicalRegistrationNumberD: "Mech. Reg. Num. D"
}

// Mapping of column width based on db table name
export const ColumnWidthMap = {
  Title: 250,
  Artist: 100,
  Genre: 100,
  SongNumber: 150,
  SubGenre: 150,
  BarIntro: 100,
  SongKey: 100,
  Duration: 100,
  Mixes: 100,
  MixRendered: 50,
  SongReleaseYear: 150,
  Description: 100,
  Status: 450,
  DateAdded: 100,

}


// Dashboard Default states
export const statusInformationDefault = {
  ClearedforKaraoke: false,
  ClearedForKr38r: false,
  // ClearedForTV: false,
  // Kod: false,
  // Vevo: false,
  // VirtualDj: false,
  // KaraokeCloudApi: false,
}

export const licensingInformationDefault = {
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  // Writer: "",
  ISRCCCMixKaraoke: "",
  ISRCCDMixInstrumental: "",
  ISRCAAMixVocal: "",
  ISRCACMixKaraoke: "",
  ISRCADMixInstrumental: "",
  HFALicenseNumber: "",
  ISWC: "",
  MechanicalRegistrationNumberC: "",
}

export const basicInformationDefault = {
  Title: "",
  InTheStyleOfArtist: "",
  Genre: "",
  SongNumber: "",
  SubGenre: "",
  BarIntro: "",
  SongKey: "",
  Duration: "",
  Mixes: "",
  MixRendered: "",
  SongReleaseYear: undefined,
  Description: "",
  ReleaseScheduledFor: null,
  DateAdded: dayjs(),
  Writer: "",
}

// Fields hidden on Status Management Dashboard
export const statusDashboardFieldsHidden = [
  'Id',
  'id',
  'Writer',
  'Description',
  'Mixes',
  'MixRendered',
  'Territories',
  'SubGenre',
  'HFASongCode',
  'ISWC',
  'RecordingType',
  'RecordingArtist',
  'RecordingIdNumber',
  'RecordingTitle',
  'Label',
  'ISRCCAMixVocal',
  'ISRCCCMixKaraoke',
  'ISRCCDMixInstrumental',
  'ISRCAAMixVocal',
  'ISRCACMixKaraoke',
  'ISRCADMixInstrumental',
  'HFALicenseNumber',
  'MechanicalRegistrationNumberA',
  'MechanicalRegistrationNumberC',
  'MechanicalRegistrationNumberD',
  'SongCrossId',
  'CheckMixes',
  'CrossIdA',
  'CrossIdC',
  'CrossIdD',
  'CreatedAt',
  'UpdatedAt',
  'ClearedforKaraoke',
  'ClearedForTV',
  'Kod',
  'Vevo',
  'VirtualDj',
  'KaraokeCloudApi',
  'CatalogDescriptions',
  'SongPublisher',
  'GeneratedMedia',
  'CrossClear',
  'Comments'
];

export const statusDashboardFieldsShown = [
  'SongNumber',
  'Status',
  'ReleaseScheduledFor',
  'StatusUpdatedAt',
  'Title',
  'Artist',
  'Genre',
  'SongReleaseYear',
  'Duration',
  'BarIntro',
];

export const publishingColumnMappedToHeaders = {
  // 'ISRCCAMixVocal': 'ISRC',
  'HFASongCode': 'HFA Song Code',
  'MechanicalRegistrationNumberA': 'HFA-Mechanical-A Mix',
  'MechanicalRegistrationNumberD': 'HFA-Mechanical-D Mix',
  'Territories': 'Territories',
  'Writer': 'Writer',
  "ISRCCAMixVocal": "ISRC CA Mix Vocal",
  "ISRCCCMixKaraoke": "ISRC CC Mix Karaoke",
  "ISRCCDMixInstrumental": "ISRC CD MixInstrumental",
  "ISRCAAMixVocal": "ISRC AA MixVocal",
  "ISRCACMixKaraoke": "ISRC AC MixKaraoke",
  "ISRCADMixInstrumental": "ISRC AD MixInstrumental",
  "HFALicenseNumber": "HFA License Number",
  "ISWC": "ISWC",
  "MechanicalRegistrationNumberC": "HFA-Mechanical-C Mix",
};
