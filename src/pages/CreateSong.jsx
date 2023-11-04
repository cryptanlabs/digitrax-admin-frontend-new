import { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SongDetailsContext } from "../context/SongDetailsContext";
import {FileAdd} from '../components/fileAdd.jsx';
import {BasicSongInfoDisplay} from '../components/BasicSongInfoDisplay.jsx';
import {LicensingInfoDisplay} from '../components/LicensingInfoDisplay.jsx';
import {PublisherInfoDisplay} from '../components/PublisherInfoDisplay.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';

const publishingHeaders = [
  "ISRC",
  "HFA Song Code",
  "HFA-Mechanical-A Mix",
  "HFA-Mechanical-D Mix",
  "Territories",
  "Writer",
];

const publishingHeadersMappedToColumn = {
  ISRC: "ISRCCAMixVocal",
  "HFA Song Code": "HFASongCode",
  "HFA-Mechanical-A Mix": "MechanicalRegistrationNumberA",
  "HFA-Mechanical-D Mix": "MechanicalRegistrationNumberD",
  Territories: "Territories",
  Writer: "Writer",
};



const defaultLicensingInformationState = {
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const defaultBasicInfoState = {
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
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const CreateSong = () => {
  const location = useLocation();
  const { generatedSets, addSong, addPublisher, uploadMediaFile, getDetailsForSong, createComment, getCommentsForSong } =
    useContext(SongDetailsContext);
  const { addToRecentSongs } = useContext(DataTableData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState("");

  const fileInputRef = useRef(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState([])
  const [generatedMediaForUpload, setGeneratedMediaForUpload] = useState([]);
  const [publishersForUpload, setPublishersForUpload] = useState([]);

  const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);
  const [licensingInformation, setLicensingInformation] = useState(defaultLicensingInformationState);

  const [basicInformation, setBasicInformation] = useState(defaultBasicInfoState);

  useEffect(() => {
    return () => {
      const detailsInOrder = publishingHeaders.map((val) => {
        return {
          key: publishingHeadersMappedToColumn[val],
          value: licensingInformation[publishingHeadersMappedToColumn[val]],
        };
      });

      console.log("STM pages-SongDetails.jsx:118", detailsInOrder); // todo remove dev item
      setLicensingInfoDisplay(detailsInOrder);
    };
  }, [licensingInformation]);

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

  const uploadMediaFileAndForCreateSong = async (data) => {
    for(const thing of data.entries()){
      if(thing[0] === 'bucketName'){

      }
      console.log('STM components-fileAdd.jsx:23', thing); // todo remove dev item
    }
    setGeneratedMediaForUpload([...generatedMediaForUpload, data])
    // await uploadMediaFile(data)
    // const songData = await getDetailsForSong(basicInformation.SongNumber)
    // setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia)
    //
  }


  const savePublisher = (data) => {
    setPublishersForUpload([...publishersForUpload, data])
  }
  // Top Section Upload Handlers

  const handleSongUpload = async () => {
    const SongNumber = basicInformation.SongNumber

    if(!SongNumber){
      return;
    }
    const newSongData = {
      ...basicInformation,
      ...licensingInformation
    }
    await addSong(newSongData)

    addToRecentSongs(SongNumber)
    for(let i=0; i< generatedMediaForUpload.length; i++){
      for(const thing of generatedMediaForUpload[i].entries()){
      }
      try {
        await uploadMediaFile(generatedMediaForUpload[i]);
      } catch (e) {
        console.error(e)
      }
    }

    for(let i=0; i< publishersForUpload.length; i++){

      try {
        publishersForUpload[i].SongNumber = SongNumber
        await addPublisher(publishersForUpload[i]);
      } catch (e) {
        console.error(e)
      }
    }

    setLicensingInformation(defaultLicensingInformationState)
    setBasicInformation(defaultBasicInfoState)
    console.log(basicInformation);
  };

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setNewComment(value);
  };
  const handleCreateComment = async () => {
    const copyComment = {
      SongNumber: basicInformation.SongNumber,
      Content: newComment,
      UserName: "DTE",
    };
    await createComment(copyComment);
    setComments((prev) => [copyComment, ...prev]);
    setNewComment("");
  };

  // File Upload Handlers

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    console.log(basicInformation);
  }, [basicInformation]);

  return (
    <div className="w-full mt-4 flex flex-col items-center justify-between">
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-20 font-medium">Create Song Entry</h1>
        <div className="flex w-1/3  mr-3 justify-center">
          <Button
            variant="outlined"
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
      {/* LICENSING INFORMATION VIEW/EDIT */}
      <LicensingInfoDisplay
        publishingHeaders={publishingHeaders}
        licensingInfoDisplay={licensingInfoDisplay}
        handleChange={handleLicensingChange}
        basicInformation={basicInformation}
      />

      <PublisherInfoDisplay
        songNumber={basicInformation.SongNumber}
        saveNewPublisher={savePublisher}
        songPublishers={publishersForUpload}
        setSongPublishers={setPublishersForUpload}
      />
      <div className="w-full mt-10 flex items-center justify-center">
        <Button
          variant="outlined"
          onClick={handleSongUpload}
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
          UPLOAD
        </Button>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col w-[90%] ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Add a Comment</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              multiline
              rows={4}
              value={newComment}
              onChange={handleCommentChange}
              variant="outlined"
            />
          ) : (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              multiline
              rows={4}
              variant="outlined"
            />
          )}
        </div>
      </div>
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={handleCreateComment}
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
          Save Comment
        </Button>
      </div>

      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold", fontSize: '30px' }}>Media</Typography>
        </div>
      </div>

      <FileAdd
        songNumber={basicInformation.SongNumber}
        submit={uploadMediaFileAndForCreateSong}
        buckets={generatedSets}
        hideHandler = {() => {setShowFileUpload(false)}}
      ></FileAdd>

      {generatedSets.map((generatedSet, index) => (
          <>
            <div className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-lg border-gray-300 p-5">
              <Typography sx={{ fontWeight: "bold" }}>{generatedSet}</Typography>
            </div>
            <FileAdd
              songNumber={basicInformation.SongNumber}
              submit={uploadMediaFileAndForCreateSong}
              preSetBucketTo={generatedSet}
              hideHandler = {() => {setShowFileUpload(false)}}
            ></FileAdd>
          </>
      ))}
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
          <Typography sx={{ marginTop: 1 }}>Click to Upload</Typography>
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
          onClick={handleSongUpload}
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

export default CreateSong;
