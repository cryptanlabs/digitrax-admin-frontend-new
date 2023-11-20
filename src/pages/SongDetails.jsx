import {useEffect, useState, useRef, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {Button, Typography, TextField} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {SongDetailsContext} from '../context/SongDetailsContext';
import {TextFields40Pct, TextFields15Pct} from '../components/textFields';
import {FileUpload} from '../components/fileUpload';
import {FileAdd} from '../components/fileAdd.jsx';
import {InfoDisplayRow} from '../components/InfoDisplayRow.jsx';
import {PublisherInfoDisplay} from '../components/PublisherInfoDisplay.jsx';
import {BasicSongInfoDisplay} from '../components/BasicSongInfoDisplay.jsx';
import {CommentDisplay} from '../components/CommentDisplay.jsx';
import {
  getBasicInfoFromSongData,
  getLicensingInfoFromSongData,
  getDistributionInfoFromSongData,
  reduceCrossInfoForSong,
  getStatusInfoFromSongData
} from '../helpers/utils.js';
import {
  basicInformationDefault,
  licensingInformationDefault,
  statusInformationDefault
} from '../helpers/constants.js';
import dayjs from 'dayjs';
import StatusDisplayEdit from '../components/StatusDisplayEdit.jsx';
import DisplayMediaListing from '../components/DisplayMediaListing.jsx';

const publishingHeaders = [
  'ISRC',
  'HFA Song Code',
  'HFA-Mechanical-A Mix',
  'HFA-Mechanical-D Mix',
  'Territories',
  'Writer',
  "ISRC CA Mix Vocal",
  "ISRC CC Mix Karaoke",
  "ISRC CD MixInstrumental",
  "ISRC AA MixVocal",
  "ISRC AC MixKaraoke",
  "ISRC AD MixInstrumental",
  "HFA License Number",
  "ISWC",
  "Mechanical Registration Number C",
];

const publishingHeadersMappedToColumn = {
  'ISRC': 'ISRCCAMixVocal',
  'HFA Song Code': 'HFASongCode',
  'HFA-Mechanical-A Mix': 'MechanicalRegistrationNumberA',
  'HFA-Mechanical-D Mix': 'MechanicalRegistrationNumberD',
  'Territories': 'Territories',
  'Writer': 'Writer',
  "ISRC CA Mix Vocal": "ISRCCAMixVocalISRCCAMixVocal",
  "ISRC CC Mix Karaoke": "ISRCCCMixKaraoke",
  "ISRC CD MixInstrumental": "ISRCCDMixInstrumental",
  "ISRC AA MixVocal": "ISRCAAMixVocal",
  "ISRC AC MixKaraoke": "ISRCACMixKaraoke",
  "ISRC AD MixInstrumental": "ISRCADMixInstrumental",
  "HFA License Number": "HFALicenseNumber",
  "ISWC": "ISWC",
  "Mechanical Registration Number C": "MechanicalRegistrationNumberC",
};

const publishingColumnMappedToHeaders = {
  'ISRCCAMixVocal': 'ISRC',
  'HFASongCode': 'HFA Song Code',
  'MechanicalRegistrationNumberA': 'HFA-Mechanical-A Mix',
  'MechanicalRegistrationNumberD': 'HFA-Mechanical-D Mix',
  'Territories': 'Territories',
  'Writer': 'Writer'
};

const songPublisherHeaders = [
  // "Id",
  'PublisherAdmin',
  // "PublisherDatabaseId",
  // "SongNumber",
  'SubPublisherDetails',
  'Share',
];

const democomment = {
  UserName: 'Tory Flenniken',
  CreatedAt: '9/6/2023 2:20pm',
  Content: `I've uploaded all of the files and they are ready for Quality Assurance`,
};

const democomment2 = {
  UserName: 'Tory Flenniken',
  CreatedAt: '9/6/2023 2:20pm',
  Content: `I've uploaded all of the files and they are ready for Quality Assurance`,
};
const demoComments = [democomment, democomment2];

const SongDetails = () => {
  const location = useLocation();
  const {
    generatedSets,
    addPublisher,
    removePublisher,
    getCrossClearForSong,
    getDetailsForSong,
    uploadMediaFile,
    updateSong,
    createComment,
    getCommentsForSong,
    markCommentRemoved,
    updateMediaMetadata,
    removeGeneratedMediaEntry
  } = useContext(SongDetailsContext);
  const [comments, setComments] = useState(demoComments);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState([]);

  const [songPublishers, setSongPublishers] = useState([]);

  const [statusData, setStatusData] = useState({});
  const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);

  const [distributionInformation, setDistributionInformation] = useState(statusInformationDefault);

  const [licensingInformation, setLicensingInformation] = useState(licensingInformationDefault);

  const [basicInformation, setBasicInformation] = useState(basicInformationDefault);

  const [crossClearEntries, setCrossClearEntries] = useState([]);
  const [songNumberLookup, setSongNumberLookup] = useState(true);
  const [disableLookupRequestButton, setDisableLookupRequestButton] = useState(true);
  const [noSongFoundForCatalogNumber, setNoSongFoundForCatalogNumber] = useState(false);

  const setup = async (rowData) => {
    console.log('STM pages-SongDetails.jsx:115', rowData.GeneratedMedia); // todo remove dev item
    setGeneratedMedia(rowData.GeneratedMedia);

    setDistributionInformation((prev) => ({
      ...prev,
      ...getDistributionInfoFromSongData(rowData)
    }));

    setStatusData((prev) => ({
      ...prev,
      ...getStatusInfoFromSongData(rowData)
    }));

    setLicensingInformation((prev) => ({
      ...prev,
      ...getLicensingInfoFromSongData(rowData)
    }));

    setBasicInformation((prev) => ({
      ...prev,
      ...getBasicInfoFromSongData(rowData)
    }));

    // localStorage.setItem('items', JSON.stringify(items));


    setSongPublishers(rowData.SongPublisher ?? []);
    getCommentsForSong();
  };

  const setupBySongNumber = (songNumber) => {
    getDetailsForSong(songNumber)
      .then(songDetails => {
        if(!songDetails){
          setNoSongFoundForCatalogNumber(true)
        }
        setup(songDetails);
        location.state.rowData = songDetails;
      });
    getCrossClearForSong(songNumber)
      .then(crossRecords => {
        setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)));
      })
      .catch(console.error);
  }

  useEffect(() => {
    if (location.state.rowData) {
      console.log('STM pages-SongDetails.jsx:92', location.state.rowData); // todo remove dev item
      setup(location.state.rowData);
      getCrossClearForSong(location.state.rowData.SongNumber)
        .then(crossRecords => {
          setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)));
        })
        .catch(console.error);

      console.log('STM pages-SongDetails.jsx:105', licensingInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:108', basicInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:114', location); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:122', location.state.rowData.GeneratedMedia); // todo remove dev item
    }
    if (location.state.SongNumber) {
      setupBySongNumber(location.state.SongNumber)


    }
  }, []);


  useEffect(() => {
    const getComments = async () => {
      if (location.state.rowData && location.state?.rowData?.SongNumber) {
        const results = await getCommentsForSong(location.state?.rowData?.SongNumber);
        setComments((prev) => ([
          ...results,
        ]));
      }
    };

    getComments();

  }, [setBasicInformation]);

  useEffect(() => {
    return () => {
      const detailsInOrder = publishingHeaders.map(val => {
        return {
          key: publishingHeadersMappedToColumn[val],
          value: licensingInformation[publishingHeadersMappedToColumn[val]]
        };
      });

      console.log('STM pages-SongDetails.jsx:118', detailsInOrder); // todo remove dev item
      setLicensingInfoDisplay(detailsInOrder);
    };

  }, [licensingInformation]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setBasicInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicensingChange = (e) => {
    const {name, value} = e.target;
    setLicensingInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistributionChange = (e) => {
    const {name, value} = e.target;
    setDistributionInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const {name, value} = e.target;
    setStatusData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSongLookupChange = (e) => {
    const {value} = e.target
    setSongNumberLookup(value)
    setDisableLookupRequestButton(value?.length !== 5)
    setNoSongFoundForCatalogNumber(false)
  }

  const handleSongLookup = () => {
    setupBySongNumber(songNumberLookup)
  }

  const uploadMediaFileAndRefresh = async (data) => {
    await uploadMediaFile(data);
    const songData = await getDetailsForSong(basicInformation.SongNumber);
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia);
    //
  };

  // Top Section Upload Handlers


  const handleSongEdit = async () => {
    const updatedDetails = await updateSong(basicInformation);
    setBasicInformation(updatedDetails);
    console.log(basicInformation);
  };

  const handleLicensingEdit = async () => {
    const withSongNumber = {...licensingInformation, SongNumber: basicInformation.SongNumber};

    const updatedDetails = await updateSong(withSongNumber);
    setLicensingInformation(updatedDetails);
    console.log(basicInformation);
  };

  const handleDistributionEdit = async () => {
    const withSongNumber = {...distributionInformation, SongNumber: basicInformation.SongNumber};

    const updatedDetails = await updateSong(withSongNumber);
    setDistributionInformation((prev) => ({
      ...prev,
      ...getDistributionInfoFromSongData(updatedDetails)
    }));
    console.log(updatedDetails);
  };

  const handleStatusEdit = async () => {
    const withSongNumber = {...statusData};

    const updatedDetails = await updateSong(withSongNumber);
    setStatusData((prev) => ({
      ...prev,
      ...getStatusInfoFromSongData(updatedDetails)
    }));
    console.log(updatedDetails);
  };

  const handleSaveNewPublisher = async (data) => {
    console.log('STM pages-SongDetails.jsx:279', data); // todo remove dev item
    const newPublisher = await addPublisher(data);
    setSongPublishers((prev) => ([
      ...prev,
      newPublisher
    ]));
  };

  const handleRemovePublisher = async (data) => {
    console.log('STM pages-SongDetails.jsx:279', data); // todo remove dev item
    const removed = await removePublisher(data);
    console.log('STM pages-SongDetails.jsx:286', removed); // todo remove dev item
    setSongPublishers((prev) => {
      const idx = prev.findIndex(item => item.PublisherDatabaseId === data.PublisherDatabaseId);
      prev.splice(idx, 1);
      return prev;
    });
  };

  const handleCreateComment = async (newComment) => {
    const copyComment = {
      SongNumber: basicInformation.SongNumber,
      Content: newComment,
    };
    const createdComment = await createComment(copyComment);
    console.log('STM pages-SongDetails.jsx:281', createdComment); // todo remove dev item
    setComments((prev) => ([
      createdComment,
      ...prev,
    ]));
  };

  const handleRemoveComment = async (CommentId) => {
    markCommentRemoved(CommentId);
    setComments((prev) => {
      const idx = prev?.findIndex(item => item.CommentId === CommentId);
      prev.splice(idx, 1);
      return prev;
    });
  };


  // File Upload Handlers

  const uploadMediaMetadataAndRefresh = async (data) => {
    await updateMediaMetadata(data);
    const songData = await getDetailsForSong(basicInformation.SongNumber);
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia);
    //
  };

  const deleteMediaFileAndRefresh = async (requestString) => {
    await removeGeneratedMediaEntry(requestString)
    const songData = await getDetailsForSong(basicInformation.SongNumber);
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia);
  }

  // handleSongLookupChange

  return (
    <div className="w-full mt-4 flex flex-col items-center justify-between">
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-20 font-medium">Song Data</h1>
        <div className="flex w-1/3  mr-3 justify-center">
          <div className="flex flex-col ml-20">
            <Typography sx={{ fontWeight: "bold" }}>Lookup Catalog ID #</Typography>
            <div className="flex flex-row justify-betweenml-20">
              <TextField
                name="SongNumber"
                type="number"
                onChange={handleSongLookupChange}
                sx={{ marginTop: 1 }}
                hiddenLabel
                value={songNumberLookup}
                variant="outlined"
              />
              <Button
                disabled={disableLookupRequestButton}
                variant="outlined"
                startIcon={<StarBorderIcon/>}
                onClick={handleSongLookup}
                sx={{
                  marginTop: 1,
                  borderColor: '#00b00e',
                  backgroundColor: '#00b00e',
                  marginLeft: '15px',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#86A789',
                  },
                }}
              >
              Lookup
              </Button>
            </div>
            {noSongFoundForCatalogNumber && <span>{`No Song Found For Catalog #${songNumberLookup}`}</span>}

          </div>


        </div>
      </div>
      <BasicSongInfoDisplay
        handleChange={handleChange}
        basicInformation={basicInformation}
      />

      <div className="w-full mt-10 flex items-center justify-center">
        <Button
          variant="outlined"
          onClick={handleSongEdit}
          sx={{
            marginRight: '15px',
            borderColor: '#00b00e',
            backgroundColor: '#00b00e',
            color: 'white',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          Save Changes
        </Button>
      </div>

      {/* LICENSING INFORMATION VIEW/EDIT */}
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Publishing Information
          </Typography>
          <Typography>Update the publishing information here</Typography>
        </div>
      </div>
      <div className="w-[90%] mt-10 flex flex-row flex-wrap">
        {Object.keys(licensingInformation).map((header, index) => (
          <div key={index} className="flex flex-col ml-10 w-[20%]">
            <Typography sx={{ fontWeight: "bold" }}>{header}</Typography>
            <TextField
              size="small"
              hiddenLabel
              name={header.key}
              onChange={handleLicensingChange}
              value={licensingInformation[header.key]}
              variant="outlined"
            />
          </div>
        ))}
      </div>
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={handleLicensingEdit}
          sx={{
            marginRight: '15px',
            borderColor: '#00b00e',
            backgroundColor: '#00b00e',
            color: 'white',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          Save Changes
        </Button>
      </div>
      {/* PUBLISHER INFORMATION*/}
      <PublisherInfoDisplay
        songNumber={basicInformation.SongNumber}
        setSongPublishers={setSongPublishers}
        songPublishers={songPublishers}
        saveNewPublisher={handleSaveNewPublisher}
        removePublisher={handleRemovePublisher}
      />
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          sx={{
            marginRight: '15px',
            borderColor: '#00b00e',
            backgroundColor: '#00b00e',
            color: 'white',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          Save Changes
        </Button>
      </div>

      {/* CROSS CLEAR */}
      {crossClearEntries?.length === 0 && (
        <div className="w-full mt-20 flex">
          <div className="w-full flex flex-col ml-20">
            <Typography sx={{ fontWeight: "bold" }}>
              Cross Clear Information
            </Typography>
            <Typography>Information received from crossClear</Typography>
            <div className="w-full items-center ml-80">
              <Typography>No Cross Clear Information Found</Typography>
            </div>
          </div>

        </div>
      )}
      {crossClearEntries?.length > 0 && (
        <InfoDisplayRow
          title="Cross Clear Information"
          subTitle="Information received from crossClear"
          infoToDisplay={crossClearEntries}
          multiRow
        />
      )}
      {/* STATUSES */}
      <InfoDisplayRow
        title="Status Information"
        subTitle="Update the status information here"
        infoToDisplay={distributionInformation}
        handleChange={handleDistributionChange}
        useDropDown
      />
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={handleDistributionEdit}
          sx={{
            marginRight: '15px',
            borderColor: '#00b00e',
            backgroundColor: '#00b00e',
            color: 'white',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          Save Changes
        </Button>
      </div>

      <StatusDisplayEdit
        statusData={statusData}
        handleChange={handleStatusChange}
        handleSave={handleStatusEdit}
      />
      <CommentDisplay
        comments={comments}
        handleCreateComment={handleCreateComment}
        handleRemoveComment={handleRemoveComment}
      />
      {/* MEDIA */}
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{fontWeight: 'bold', fontSize: '30px'}}>Media</Typography>
        </div>
      </div>
      {!showFileUpload ? (
        <div className="w-[90%] mt-5 flex items-center justify-start">
          <Button
            variant="outlined"
            onClick={() => {
              setShowFileUpload(true);
            }}
            sx={{
              marginRight: '15px',
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Add Media
          </Button>
        </div>
      ) : (
        <FileAdd
          songNumber={basicInformation.SongNumber}
          submit={uploadMediaFileAndRefresh}
          buckets={generatedSets}
          hideHandler={() => {
            setShowFileUpload(false);
          }}
        ></FileAdd>
      )}

      <div className="w-full mt-10 ml-40 mb-20">
      <DisplayMediaListing
        updateGeneratedMediaMetadata={uploadMediaMetadataAndRefresh}
        uploadMediaFileAndRefresh={uploadMediaFileAndRefresh}
        songNumber={basicInformation.SongNumber}
        generatedSets={generatedSets}
        generatedMedia={generatedMedia}
        handleRequestDeleteMediaEntry={deleteMediaFileAndRefresh}
      />
      </div>
    </div>
  );
};

export default SongDetails;
