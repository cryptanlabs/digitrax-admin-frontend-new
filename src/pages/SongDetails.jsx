import {useEffect, useState, useRef, useContext} from 'react';
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {SongDetailsContext} from '../context/SongDetailsContext';
import {  TextFields40Pct, TextFields15Pct} from '../components/textFields'
import { FileUpload } from '../components/fileUpload'
import {FileAdd} from '../components/fileAdd.jsx';
import {InfoDisplayRow} from '../components/InfoDisplayRow.jsx';
import {PublisherInfoDisplay} from '../components/PublisherInfoDisplay.jsx';
import {BasicSongInfoDisplay} from '../components/BasicSongInfoDisplay.jsx';
import {CommentDisplay} from '../components/CommentDisplay.jsx';
import {
  getBasicInfoFromSongData,
  getLicensingInfoFromSongData,
  getStatusInfoFromSongData, reduceCrossInfoForSong
} from '../helpers/utils.js';
import {
  basicInformationDefault,
  licensingInformationDefault,
  statusInformationDefault
} from '../helpers/constants.js';

const publishingHeaders = [
  "ISRC",
  "HFA Song Code",
  "HFA-Mechanical-A Mix",
  "HFA-Mechanical-D Mix",
  "Territories",
  "Writer",
];

const publishingHeadersMappedToColumn = {
  "ISRC": "ISRCCAMixVocal",
  "HFA Song Code": "HFASongCode",
  "HFA-Mechanical-A Mix": "MechanicalRegistrationNumberA",
  "HFA-Mechanical-D Mix": "MechanicalRegistrationNumberD",
  "Territories": "Territories",
  "Writer": "Writer"
}

const publishingColumnMappedToHeaders = {
  "ISRCCAMixVocal": "ISRC",
  "HFASongCode": "HFA Song Code",
  "MechanicalRegistrationNumberA": "HFA-Mechanical-A Mix",
  "MechanicalRegistrationNumberD": "HFA-Mechanical-D Mix",
  "Territories": "Territories",
  "Writer": "Writer"
}

const songPublisherHeaders = [
  // "Id",
  "PublisherAdmin",
  // "PublisherDatabaseId",
  // "SongNumber",
  "SubPublisherDetails",
  "Share",
];

const democomment = {
  UserName: "Tory Flenniken",
  date: "9/6/2023 2:20pm",
  Content: `I've uploaded all of the files and they are ready for Quality Assurance`,
};

const democomment2 = {
  UserName: "Tory Flenniken",
  date: "9/6/2023 2:20pm",
  Content: `I've uploaded all of the files and they are ready for Quality Assurance`,
};
const demoComments = [democomment, democomment2];

const SongDetails = () => {
  const location = useLocation();
  const {generatedSets, addPublisher, removePublisher, getCrossClearForSong, getDetailsForSong, uploadMediaFile, updateSong, createComment, getCommentsForSong} = useContext(SongDetailsContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesForUpload, setFilesForUpload] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(demoComments)
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef(null);
  const [generatedMedia, setGeneratedMedia] = useState([])

 const [songPublishers, setSongPublishers] = useState([])

  const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);

  const [statusInformation, setStatusInformation] = useState(statusInformationDefault);

  const [licensingInformation, setLicensingInformation] = useState(licensingInformationDefault);

  const [basicInformation, setBasicInformation] = useState(basicInformationDefault);

  const [crossClearEntries, setCrossClearEntries] = useState([]);

  const setup = async (rowData) => {
    setGeneratedMedia(rowData.GeneratedMedia)

    setStatusInformation((prev) => ({
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


    setSongPublishers(rowData.SongPublisher ?? [])
    getCommentsForSong()
  }

  useEffect(() => {
    if (location.state.rowData) {
      console.log('STM pages-SongDetails.jsx:92', location.state.rowData); // todo remove dev item
      setup(location.state.rowData)
      getCrossClearForSong(location.state.rowData.SongNumber)
        .then(crossRecords => {
          setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)))
        })
        .catch(console.error)

      console.log('STM pages-SongDetails.jsx:105', licensingInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:108', basicInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:114', location); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:122', location.state.rowData.GeneratedMedia); // todo remove dev item
    }
    if(location.state.SongNumber){
      getDetailsForSong(location.state.SongNumber)
        .then(songDetails => {
          setup(songDetails)
          location.state.rowData = songDetails
        })
      getCrossClearForSong(location.state.SongNumber)
        .then(crossRecords => {
          setCrossClearEntries(crossRecords.map(entry => reduceCrossInfoForSong(entry)))
        })
        .catch(console.error)


    }
  }, []);


  useEffect(() => {
      const getComments = async () => {
        if (location.state.rowData && location.state?.rowData?.SongNumber) {
          const results = await getCommentsForSong(location.state?.rowData?.SongNumber)
          console.log('STM pages-SongDetails.jsx:119', results); // todo remove dev item
          setComments((prev) => ([
            ...results,
            ...prev,
          ]))
        }
      }

    getComments()

  }, [setBasicInformation])

  useEffect(() => {
    return () => {
      const detailsInOrder = publishingHeaders.map(val => {
        return {key: publishingHeadersMappedToColumn[val], value:licensingInformation[publishingHeadersMappedToColumn[val]]}
      })

      console.log('STM pages-SongDetails.jsx:118', detailsInOrder); // todo remove dev item
      setLicensingInfoDisplay(detailsInOrder)
    };

  }, [licensingInformation]);

  const checkButton = async () => {
    const songData = await getDetailsForSong(basicInformation.SongNumber)
    console.log('STM pages-SongDetails.jsx:180', songData); // todo remove dev item
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLicensingChange = (e) => {
    const { name, value } = e.target;
    setLicensingInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setStatusInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadMediaFileAndRefresh = async (data) => {
    await uploadMediaFile(data)
    const songData = await getDetailsForSong(basicInformation.SongNumber)
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia)
    //
  }

 // Top Section Upload Handlers

  const handleSongEdit = async () => {
   const updatedDetails =  await updateSong(basicInformation)
    setBasicInformation(updatedDetails)
    console.log(basicInformation)
  }

  const handleLicensingEdit = async () => {
    const withSongNumber = {...licensingInformation, SongNumber: basicInformation.SongNumber}

    const updatedDetails =  await updateSong(withSongNumber)
    setLicensingInformation(updatedDetails)
    console.log(basicInformation)
  }

  const handleStatusEdit = async () => {
    const withSongNumber = {...statusInformation, SongNumber: basicInformation.SongNumber}

    const updatedDetails =  await updateSong(withSongNumber)
    setStatusInformation((prev) => ({
      ...prev,
      ...getStatusInfoFromSongData(updatedDetails)
    }));
    console.log(updatedDetails)
  }

  const handleSaveNewPublisher = async (data) => {
    console.log('STM pages-SongDetails.jsx:279', data); // todo remove dev item
    const newPublisher = await addPublisher(data)
    setSongPublishers((prev) => ([
      ...prev,
      newPublisher
    ]))
  }

  const handleRemovePublisher = async (data) => {
    console.log('STM pages-SongDetails.jsx:279', data); // todo remove dev item
    const removed = await removePublisher(data)
    console.log('STM pages-SongDetails.jsx:286', removed); // todo remove dev item
    setSongPublishers((prev) => {
      const idx = prev.findIndex(item => item.PublisherDatabaseId === data.PublisherDatabaseId)
      prev.splice(idx, 1)
      return prev
    })
  }


  const handleSongUpload = async () => {
    console.log(basicInformation)
  }

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setNewComment(value);
  };
  const handleCreateComment = async () => {
    const copyComment = {
      SongNumber: basicInformation.SongNumber,
      Content: newComment,
      UserName: 'DTE'
    }
    await createComment(copyComment)
    setComments((prev) => ([
      copyComment,
      ...prev,
    ]))
    setNewComment('')
  }


  // File Upload Handlers

  const returnUploadFile = (fileDataToAdd) => {
    console.log('STM pages-SongDetails.jsx:209', fileDataToAdd); // todo remove dev item
    if(Object.keys(filesForUpload).includes(fileDataToAdd.generatedSet)){

    }
    setFilesForUpload((prevState) => {

    })
  }
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };


  return (
    <div className="w-full mt-4 flex flex-col items-center justify-between">
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-20 font-medium">Song Data</h1>
        <div className="flex w-1/3  mr-3 justify-center">
          <Button
            variant="outlined"
            // onClick={checkButton}
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Upload Another Song
          </Button>

          <Button
            variant="outlined"
            startIcon={<StarBorderIcon />}
            sx={{
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              marginLeft: "15px",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
              },
            }}
          >
            Export
          </Button>
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
              marginRight: "15px",
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
              },
            }}
          >
            Save Changes
          </Button>
      </div>
      {/* CROSS CLEAR */}
      <InfoDisplayRow
        title="Cross Clear Information"
        subTitle="Information recieved from crossClear"
        infoToDisplay={crossClearEntries}
        multiRow
      />
      {/* STATUSES */}
      <InfoDisplayRow
        title="Status Information"
        subTitle="Update the status information here"
        infoToDisplay={statusInformation}
        handleChange={handleStatusChange}
        useDropDown
      />
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={handleStatusEdit}
          sx={{
            marginRight: "15px",
            borderColor: "#00b00e",
            backgroundColor: "#00b00e",
            color: "white",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#86A789",
            },
          }}
        >
          Save Changes
        </Button>
      </div>
      {/* LICENSING INFORMATION VIEW/EDIT */}
      <InfoDisplayRow
        title="Publishing Information"
        subTitle="Update the publishing information here"
        infoToDisplay={licensingInformation}
        headerMap={publishingColumnMappedToHeaders}
        handleChange={handleLicensingChange}
      />
      <div className="w-[90%] mt-5 flex items-center justify-end">
          <Button
            variant="outlined"
            onClick={handleLicensingEdit}
            sx={{
              marginRight: "15px",
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
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
              marginRight: "15px",
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
              },
            }}
          >
            Save Changes
          </Button>
      </div>
      <CommentDisplay
        comments={comments}
      />
      {/* MEDIA */}
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold", fontSize: '30px' }}>Media</Typography>
        </div>
      </div>
      {!showFileUpload ? (
        <div className="w-[90%] mt-5 flex items-center justify-start">
          <Button
            variant="outlined"
            onClick={() => {setShowFileUpload(true)}}
            sx={{
              marginRight: "15px",
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
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
          hideHandler = {() => {setShowFileUpload(false)}}
        ></FileAdd>
      )}



      {generatedMedia?.length > 0 ? (generatedMedia.map((entry, index) => (
                <FileUpload
                  mediaObject={entry}
                  returnUploadFile={returnUploadFile}
                />
            ))) : (
        <>
          <div className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-lg border-gray-300 p-5">
            <Typography sx={{ fontWeight: "bold" }}>720-blk-background</Typography>
          </div>
          <div className="w-[90%] mt-10 flex flex-row justify-between">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/svg+xml,image/png,image/jpeg"
            />
            <div
              className="w-[33%] h-60 border border-green-600 border-2 rounded-lg flex flex-col justify-center items-center cursor-pointer"
              onClick={handleFileUploadClick}
            >
              <CloudUploadIcon sx={{ height: 40, width: 40 }} />
              <Typography sx={{ marginTop: 1 }}>Click to Replace</Typography>

            </div>
            <div className="w-[33%] h-60 border border-gray-300 border-2 rounded-lg">
              {selectedFile && (
                <img
                  src={selectedFile}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {!selectedFile && (
                <Typography
                  sx={{ fontWeight: "bold", padding: 2, color: "dark-gray" }}
                >
                  Song title no background
                </Typography>
              )}
            </div>
            <div className="w-[33%] h-60 border border-gray-300 border-2 rounded-lg"></div>
          </div>
        </>
      )}

      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          sx={{
            marginRight: "15px",
            borderColor: "#FF6969",
            backgroundColor: "#FF6969",
            color: "white",
            "&:hover": {
              borderColor: "#FF6969",
              backgroundColor: "#white",
              color: "#FF6969",
            },
          }}
          onClick={() => setSelectedFile(null)}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          sx={{
            marginRight: "15px",
            borderColor: "#00b00e",
            backgroundColor: "#00b00e",
            color: "white",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#86A789",
            },
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SongDetails;
