import React, {useEffect, useState, useContext} from 'react';
import {useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import {SongDetailsContext} from '../context/SongDetailsContext';
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
  statusInformationDefault,
  publishingColumnMappedToHeaders
} from '../helpers/constants.js';
import StatusDisplayEdit from '../components/StatusDisplayEdit.jsx';
import DisplayMediaListing from '../components/DisplayMediaListing.jsx';
import {Thumbnail} from '../components/Thumbnail.jsx';
import JSZip from 'jszip'
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import { saveAs } from 'file-saver';
import {SimpleDialog} from '../components/SimpleDialog.jsx';
import dayjs from 'dayjs';
import {UserContext} from '../context/UserContext.jsx';

console.log('STM pages-SongDetails.jsx:29', JSZip); // todo remove dev item
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
  const routeParams = useParams();
  const navigate = useNavigate();
  const {adminDashToken} = useContext(UserContext);
  const {
    generatedSets,
    bucketList,
    getBuckets,
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
    removeGeneratedMediaEntry,
    uploadThumbnail,
    handleNotifyOfError,
    addStatusChange,
    genres,
    addGenre,
    deleteSong
  } = useContext(SongDetailsContext);
  const [comments, setComments] = useState([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState([]);

  const [songPublishers, setSongPublishers] = useState([]);

  const [statusData, setStatusData] = useState({});

  const [distributionInformation, setDistributionInformation] = useState(statusInformationDefault);

  const [licensingInformation, setLicensingInformation] = useState(licensingInformationDefault);

  const [basicInformation, setBasicInformation] = useState(basicInformationDefault);

  const [thumbnailInformation, setThumbnailInformation] = useState({});

  const [crossClearEntries, setCrossClearEntries] = useState([]);
  const [songNumberLookup, setSongNumberLookup] = useState(true);
  const [disableLookupRequestButton, setDisableLookupRequestButton] = useState(true);
  const [noSongFoundForCatalogNumber, setNoSongFoundForCatalogNumber] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [buildingExport, setBuildingExport] = useState(false);

  const [generatedGroups, setGeneratedGroups] = useState({});
  const [displayBuckets, setDisplayBuckets] = useState([]);
  const [bucketTypeMap, setBucketTypeMap] = useState({});
  const [generatedCount, setGeneratedCount] = useState(0);

  const [openGenreDialog, setOpenGenreDialog] = useState(false);
  const [openGenreDialogType, setOpenGenreDialogType] = useState(null);
  const [newGenreOrSub, setNewGenreOrSub] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmationCheck, setDeleteConfirmationCheck] = useState('');


  const handleDialogOpen = async (val) => {
    if(!val){
      setOpenGenreDialog(!openGenreDialog)
    }
    if(val === 'Primary' || val === 'Subgenre'){
      setOpenGenreDialogType(val)
      setOpenGenreDialog(!openGenreDialog)
      return;
    }

    console.log('STM pages-SongDetails.jsx:145', val); // todo remove dev item
    setOpenGenreDialog(!openGenreDialog)
    if(newGenreOrSub !== '' && openGenreDialogType !== ''){
      await addGenre({Genre: newGenreOrSub, Type: openGenreDialogType})
      setOpenGenreDialogType('')
      setNewGenreOrSub('')
    }

  }

  const regenerateMediaMap = async (generatedMedia) => {
    if(generatedMedia){
      console.log('STM pages-SongDetails.jsx:139', generatedMedia); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:173', bucketList); // todo remove dev item
      let localBucketList = bucketList



      // generatedMedia = generatedMedia.map(item => {
      //   if(item?.bucket === '720all'){
      //     item.bucket = '720-motion-background-mp4-video'
      //     item.generatedSet = '720-motion-background-mp4-video'
      //   }
      //   if(item?.bucket === '720-blk-background'){
      //     item.bucket = '720-no-background-mp4-video'
      //     item.generatedSet = '720-no-background-mp4-video'
      //   }
      //   return item
      // })


      if(localBucketList?.folder?.length === 0 || localBucketList?.bucket?.length === 0){
        localBucketList = await getBuckets()
      }
      // setIsLoading(true)
      // if(bucketList?.folder)
      const assignedBucketFolders = (localBucketList?.folder || []).reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
      }, {});

      const assignedBucketBuckets = (localBucketList?.bucket || []).reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {});



      setBucketTypeMap({...assignedBucketBuckets, ...assignedBucketFolders})
      // console.log('STM components-DisplayMediaListing.jsx:36', assignedBuckets.bucketType); // todo remove dev item
      const localDisplayBuckets = [...generatedSets, ...Object.keys({...assignedBucketBuckets, ...assignedBucketFolders})]

      setDisplayBuckets(localDisplayBuckets)


      const bucketGroups = generatedMedia.reduce((acc, cur) => {
        acc[cur['bucket']] = [];
        return acc;
      }, {});


      const generatedGroupsLocal = generatedMedia.reduce((acc, cur) => {
        if (bucketGroups[cur?.bucket]) {
          bucketGroups[cur?.bucket].push(cur);
          setGeneratedCount(1 + generatedCount);
        }
        return bucketGroups;
      }, bucketGroups);

      console.log('STM pages-SongDetails.jsx:152', generatedGroupsLocal); // todo remove dev item
      setGeneratedGroups(generatedGroupsLocal);
      setLoadingMedia(false)
    }

  };

  const reset = () => {
    setDistributionInformation(() => ({
      statusInformationDefault
    }));

    setStatusData(() => ({
      ...{...statusInformationDefault, Status: 'Status1', StatusComment: ''}
    }));

    setLicensingInformation(() => ({
      ...licensingInformationDefault
    }));

    setBasicInformation(() => ({
      ...basicInformationDefault
    }));

    setThumbnailInformation({})
    setComments([])
  }
  const setup = async (rowData) => {
    if(!rowData){
      setErrorMessage(true);
      return;
    }
    setGeneratedMedia(rowData.GeneratedMedia);


    setDistributionInformation(() => ({
      ...getDistributionInfoFromSongData(rowData)
    }));

    setStatusData(() => ({
      ...getStatusInfoFromSongData(rowData)
    }));

    setLicensingInformation(() => ({
      ...getLicensingInfoFromSongData(rowData)
    }));

    setBasicInformation(() => ({
      ...getBasicInfoFromSongData(rowData)
    }));

    setThumbnailInformation(rowData?.Thumbnail ?? {})

    setSongPublishers(rowData.SongPublisher ?? []);

    const retrievedComments = await getCommentsForSong(rowData.SongNumber);
    setComments(retrievedComments)
    await regenerateMediaMap(rowData.GeneratedMedia)

    console.log('STM pages-SongDetails.jsx:204', distributionInformation); // todo remove dev item
  };

  const setupBySongNumber = (songNumber) => {
    console.log('STM pages-SongDetails.jsx:298', songNumber); // todo remove dev item
    if(!songNumber){
      setErrorMessage(true);
      throw Error("No Song Number in setupBySongNumber")
    }
    setLoadingDetails(true)
    getDetailsForSong(songNumber)
      .then(songDetails => {
        if(!songDetails){
          setNoSongFoundForCatalogNumber(true)
        }
        setup(songDetails);
        location.state.rowData = songDetails;
        setLoadingDetails(false)
      });
    getCrossClearForSong(songNumber)
      .then(crossRecords => {
        setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)));
      })
      .catch(console.error);
  }

  useEffect(() => {
    if (location.state.rowData) {
      setup(location.state.rowData);
      getCrossClearForSong(location.state.rowData.SongNumber)
        .then(crossRecords => {
          setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)));
        })
        .catch(console.error);
    }

    if (location.state.SongNumber) {
      setupBySongNumber(location.state.SongNumber)
    }
  }, []);

  useEffect(() => {
    reset()
    setupBySongNumber(routeParams.SongNumber)
  }, [location])


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

  const handleRefreshData = () => {
    reset()
    setupBySongNumber(routeParams.SongNumber)
  }

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
    console.log('STM pages-SongDetails.jsx:393', value); // todo remove dev item
    setSongNumberLookup(value)
    setDisableLookupRequestButton(value?.length !== 5)
    setNoSongFoundForCatalogNumber(false)
  }

  const handleSongLookup = () => {
    setErrorMessage(false)
    console.log('STM pages-SongDetails.jsx:401', songNumberLookup); // todo remove dev item
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
    setBasicInformation(() => ({
      ...getBasicInfoFromSongData(updatedDetails)
    }));
    console.log(basicInformation);
  };

  const handleLicensingEdit = async () => {
    const withSongNumber = {...licensingInformation, SongNumber: basicInformation.SongNumber};

    const updatedDetails = await updateSong(withSongNumber);
    setLicensingInformation(
    (prev) => ({
      ...prev,
      ...getLicensingInfoFromSongData(updatedDetails)
    }))
    console.log(basicInformation);
  };

  const handleDistributionEdit = async () => {
    const withSongNumber = {...distributionInformation, SongNumber: basicInformation.SongNumber};

    console.log('STM pages-SongDetails.jsx:341', withSongNumber); // todo remove dev item
    const updatedDetails = await updateSong(withSongNumber);
    setDistributionInformation((prev) => ({
      ...prev,
      ...getDistributionInfoFromSongData(updatedDetails)
    }));
    console.log(updatedDetails);
  };

  const handleStatusEdit = async () => {
    const withSongNumber =
      {
        ...statusData,
        SongNumber: basicInformation.SongNumber,
        StatusUpdatedAt: dayjs()
      };
    try {


      console.log('STM pages-SongDetails.jsx:389', withSongNumber); // todo remove dev item
      const updatedDetails = await updateSong(withSongNumber);
      setStatusData((prev) => ({
        ...prev,
        ...getStatusInfoFromSongData(updatedDetails)
      }));
      console.log(updatedDetails);
    } catch (e) {
      console.error(e)
    }

    addStatusChange(withSongNumber)

  };

  const handleSaveNewPublisher = async (data) => {
    const newPublisher = await addPublisher(data);
    setSongPublishers((prev) => ([
      ...prev,
      newPublisher
    ]));
  };

  const handleRemovePublisher = async (data) => {
    await removePublisher(data);
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
      return ([...prev]);
    });
  };

  const handleExportAllMedia = async () => {
    setBuildingExport(true)
    try {
      const zip = new JSZip();
      console.log('STM pages-SongDetails.jsx:359', JSZip); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:359', generatedMedia); // todo remove dev item
      const promises = [];
      for (let entry of generatedMedia) {
        console.log('STM pages-SongDetails.jsx:373', entry); // todo remove dev item
        // (`${base_url}/fileGetInternal/${entry.requestString}`, {headers: {'x-access-token': adminDashToken}})
        const res1 = await axiosBaseWithKey(adminDashToken)(`${base_url}/fileGetPresigned/${entry.requestString}`)
            .then((res) => {
              console.log('STM pages-SongDetails.jsx:509', res.data.redirect); // todo remove dev item
              return fetch(res.data.redirect)
            })

        const tempPromise = [
          entry,
          res1
        ];

        promises.push(tempPromise);
        // promises.push(Promise.all(tempPromise));
      }

      const image = await fetch(`${base_url}/thumbnail/${basicInformation.SongNumber}?x-access-token=${adminDashToken}`)

      promises.push([{location: 'thumbnail.jpg'}, image]);
      const results = promises //await Promise.all(promises);

      console.log('STM pages-SongDetails.jsx:381', results); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:382', results[0]); // todo remove dev item

      for (let result of results) {
        console.log('STM pages-SongDetails.jsx:391', result, result[1]?.ok); // todo remove dev item
        if(result[1]?.status === 200){

          zip.file(result[0].location, result[1].arrayBuffer());
        } else {
          handleNotifyOfError({message: `Error requesting media file ${result[0].location}`})
        }
      }

      zip.generateAsync({type: 'blob'})
        .then(function (blob) {
          saveAs(blob, `${basicInformation.SongNumber}_All_Media.zip`);
          setBuildingExport(false);
        });
    } catch (e) {
      console.error(e)
      setBuildingExport(false)
      handleNotifyOfError(e)
    }
    // fetch(`${base_url}/fileGetInternal/${mediaItem.requestString}`)
  }
  // const handleUploadThumbnail = async (data) => {
  //
  // }
  // File Upload Handlers

  const refreshMedia = async () => {
    const songData = await getDetailsForSong(basicInformation.SongNumber);
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia)
  }
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

  const deleteSongHandler = async (requestString) => {
    await deleteSong({SongNumber: requestString, Title: basicInformation.Title, InTheStyleOfArtist: basicInformation.InTheStyleOfArtist})
    navigate("/dashboard")
  }

  const handleDeleteDialogOpen = () => {
    setDeleteConfirmationCheck("")
    setDeleteConfirmOpen(!deleteConfirmOpen)
  }

  if(errorMessage){
    return (
      <div className="w-[90%] mt-4 ml-20 flex flex-col items-center justify-between">
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl font-medium">Song Data</h1>
          {loadingDetails && (<div>
            <CircularProgress />
          </div>)}
          {errorMessage && (<div>
            <Typography sx={{ fontWeight: "bold", color: 'red' }}>No song data received to view </Typography>
          </div>)}
        </div>
      </div>
    )
  }

  // handleSongLookupChange

  return (
    <div className="w-[90%] mt-4 ml-20 flex flex-col items-center justify-between">
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl font-medium">Song Data</h1>
        {loadingDetails && (<div>
          <CircularProgress />
        </div>)}
        {errorMessage && (<div>
          <Typography sx={{ fontWeight: "bold", color: 'red' }}>No song data received to view </Typography>
        </div>)}
        <Button
          variant="outlined"
          startIcon={<RefreshIcon/>}
          onClick={handleRefreshData}
          sx={{
            marginTop: 1,
            borderColor: 'gray',
            // backgroundColor: '#00b00e',
            marginLeft: '15px',
            color: 'gray',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          Refresh
        </Button>
        <div className="flex w-1/3  justify-center">
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
        genres={genres}
        handleDialogOpen={handleDialogOpen}
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
        <div className="flex flex-col">
          <Typography sx={{ fontWeight: "bold" }}>
            Licensing Information
          </Typography>
          <Typography>Update the licensing information here</Typography>
        </div>
      </div>
      <div className="w-full mt-10 flex flex-row flex-wrap">
        {Object.keys(licensingInformation).map((header, index) => (
          <div key={index} className="flex flex-col ml-5 w-[20%]">
            <Typography sx={{ fontWeight: "bold" }}>{publishingColumnMappedToHeaders[header]}</Typography>

            <TextField
              size="small"
              hiddenLabel
              name={header}
              onChange={handleLicensingChange}
              value={licensingInformation[header]}
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

      <div className="w-full border border-gray-300 mt-1">
      </div>
      <StatusDisplayEdit
          statusData={statusData}
          handleChange={handleStatusChange}
          handleSave={handleStatusEdit}
      />
      <div className="w-full border border-gray-300 mt-1">
      </div>
      <CommentDisplay
          comments={comments}
          handleCreateComment={handleCreateComment}
          handleRemoveComment={handleRemoveComment}
      />

      {/* PUBLISHER INFORMATION*/}
      <div className="w-full border border-gray-300 mt-1">
      </div>
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
      <div className="w-full border border-gray-300 mt-1">
      </div>
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

      {/* THUMBNAIL UPLOAD */}
      <div className="w-full border border-gray-300 mt-10">
      </div>
      <div className="w-full mb-10">
        <Thumbnail thumbnailObject={thumbnailInformation} uploadFile={uploadThumbnail} songNumber={basicInformation.SongNumber}/>
      </div>

      {/* MEDIA */}
      <div className="w-full border border-gray-300 mt-1">
      </div>
      <div className="w-full flex">
        <div className="flex flex-col">
          <Typography sx={{fontWeight: 'bold', fontSize: '30px'}}>Media</Typography>
        </div>
        <div className="w-1/3">
          {loadingMedia && <CircularProgress />}
        </div>
        <div className="w-1/3 mt-3">
          <Button
              disabled={buildingExport}
            variant="outlined"
            onClick={handleExportAllMedia}
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
            Export Media
          </Button>
          {buildingExport && <CircularProgress />}
        {/*  BuildingExport */}
        </div>
{/*        <div className="w-1/3 mt-3">
          <Button
            variant="outlined"
            onClick={() => {
              refreshMedia()
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
            ReFetch Media
          </Button>
        </div>*/}
      </div>

      <div className="w-full flex flex-row justify-start">

        <FileAdd
          buttonOnly
          songNumber={basicInformation.SongNumber}
          submit={uploadMediaFileAndRefresh}
          buckets={bucketList?.folder || []}
          hideHandler={() => {
            setShowFileUpload(false);
          }}
        ></FileAdd>

      </div>

      <div className="w-full  mb-20">

      <DisplayMediaListing
        updateGeneratedMediaMetadata={uploadMediaMetadataAndRefresh}
        submit={uploadMediaFileAndRefresh}
        songNumber={basicInformation.SongNumber}
        generatedSets={generatedSets}
        generatedMedia={generatedMedia}
        handleRequestDeleteMediaEntry={deleteMediaFileAndRefresh}
        setIsLoading={setLoadingMedia}
        generatedGroupsExternal={generatedGroups}
        displayBucketsExternal={displayBuckets}
        bucketTypeMapExternal={bucketTypeMap}
      />
      </div>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon/>}
        onClick={handleDeleteDialogOpen}
        sx={{
          marginTop: 1,
          borderColor: 'gray',
          backgroundColor: 'red',
          marginLeft: '15px',
          color: 'white',
          '&:hover': {
            borderColor: '#F1EFEF',
            backgroundColor: '#86A789',
          },
        }}
      >
        Delete
      </Button>
      <SimpleDialog open={openGenreDialog} onClose={handleDialogOpen} title={`${openGenreDialogType === 'SubGenre' ? 'Add SubGenre' : 'Add Genre'}`}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New Genre"
          type="text"
          value={newGenreOrSub}
          onChange={(e) => {setNewGenreOrSub(e.target.value)}}
          fullWidth
          variant="standard"
        />
      </SimpleDialog>
      <div>
        <Dialog
          open={deleteConfirmOpen}
        >
          <DialogTitle>
            <b style={{color: 'red'}}>Confirm Delete Song Entry.</b>
          </DialogTitle>
          <DialogContent>
            <p style={{color: 'red'}}><b>Note That This Cannot Be Undone</b></p>
            <p>Catalog Number: <b>{basicInformation.SongNumber}</b></p>
            <p>In The Style Of Artist: <b>{basicInformation.InTheStyleOfArtist}</b></p>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter Song Title of song to delete"
              type="text"
              value={deleteConfirmationCheck}
              onChange={(e) => {
                setDeleteConfirmationCheck(e.target.value);
              }}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleDeleteDialogOpen}>
              Cancel
            </Button>
            <Button
              disabled={deleteConfirmationCheck !== basicInformation.Title}
              sx={{
                borderColor: 'gray',
                backgroundColor: 'red',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#7e2121',
                },
              }}
              onClick={() => deleteSongHandler(basicInformation.SongNumber)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
};

export default SongDetails;
