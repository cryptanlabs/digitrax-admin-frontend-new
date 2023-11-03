import { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SongDetailsContext } from "../context/SongDetailsContext";
import {FileAdd} from '../components/fileAdd.jsx';

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

const songPublisherHeaders = [
  // "Id",
  "PublisherAdmin",
  // "PublisherDatabaseId",
  // "SongNumber",
  "SubPublisherDetails",
  "Share",
];

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
  const { generatedSets, addSong, updateSong, uploadMediaFile, getDetailsForSong, createComment, getCommentsForSong } =
    useContext(SongDetailsContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState("");

  const fileInputRef = useRef(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState([])
  const [generatedMediaForUpload, setGeneratedMediaForUpload] = useState([]);

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
  // Top Section Upload Handlers

  const handleSongUpload = async () => {
    const newSongData = {
      ...basicInformation,
      ...licensingInformation
    }
    console.log('STM pages-CreateSong.jsx:121', newSongData); // todo remove dev item
    await addSong(newSongData)

    for(let i=0; i< generatedMediaForUpload.length; i++){
      console.log('STM pages-CreateSong.jsx:125', generatedMediaForUpload[i]); // todo remove dev item
      for(const thing of generatedMediaForUpload[i].entries()){
        console.log('STM components-fileAdd.jsx:23', thing); // todo remove dev item
      }
      try {
        await uploadMediaFile(generatedMediaForUpload[i]);
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
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Basic Song Information
          </Typography>
          <Typography>Fill out available song Metadata below</Typography>
        </div>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Catalogue ID #</Typography>
          <TextField
            name="SongNumber"
            type="number"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.SongNumber}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Song Title</Typography>
          <TextField
            name="Title"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.Title}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
          <TextField
            name="Artist"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.Artist}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Genre"
            value={basicInformation.Genre}
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>SubGenre</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="SubGenre"
            onChange={handleChange}
            value={basicInformation.SubGenre}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-[90%] flex flex-row mt-10 flex">
        <div className="flex flex-col  w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Bar Intro</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            name="BarIntro"
            hiddenLabel
            onChange={handleChange}
            value={basicInformation.BarIntro}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Key</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.SongKey}
            name="SongKey"
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Duration</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Duration"
            onChange={handleChange}
            value={basicInformation.Duration}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mixes</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Mixes"
            onChange={handleChange}
            value={basicInformation.Mixes}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mix Rendered</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="MixRendered"
            onChange={handleChange}
            value={basicInformation.MixRendered}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Release Year</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            type="number"
            name="SongReleaseYear"
            onChange={handleChange}
            value={basicInformation.SongReleaseYear}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col w-[90%] ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Song Description</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            multiline
            rows={4}
            name="Description"
            onChange={handleChange}
            value={basicInformation.Description}
            variant="outlined"
          />
        </div>
      </div>
      {/* LICENSING INFORMATION VIEW/EDIT */}
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Publishing Information
          </Typography>
          <Typography>Update the publishing information here</Typography>
        </div>
      </div>
      <div className="w-[90%] mt-10 flex flex-col border-2 border-black rounded-lg border-gray-300">
        <div className="w-full h-10 border-b flex border-gray-300">
          {publishingHeaders.map((header, index) => (
            <div
              key={index}
              className="w-[20%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
            >
              <Typography sx={{ fontSize: 14 }}>{header}</Typography>
            </div>
          ))}
        </div>
        <div className="w-full h-20 flex">
          {/* publishingHeadersMappedToColumn */}
          {licensingInfoDisplay.map((header, index) => (
            <div
              key={index}
              className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 "
            >
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                name={header.key}
                onChange={handleChange}
                value={basicInformation[header.key]}
                variant="outlined"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Edit Publisher Details
          </Typography>
        </div>
      </div>
      <div className="w-[90%] mt-10 flex flex-col border-2 border-black rounded-lg border-gray-300">
        <div className="w-full h-10 border-b flex border-gray-300">
          {songPublisherHeaders.map((header, index) => (
            <div
              key={index}
              className="w-[33%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
            >
              <Typography sx={{ fontSize: 14 }}>{header}</Typography>
            </div>
          ))}
        </div>
        <div className="w-full border-b flex border-gray-300 h-20">
          <div className="w-[33%] h-full flex items-center justify-center ">
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            ></TextField>
          </div>
          <div className="w-[33%] h-full flex items-center justify-center">
            {" "}
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            ></TextField>
          </div>
          <div className="w-[33%] h-full flex items-center justify-center">
            {" "}
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            ></TextField>
          </div>
        </div>
      </div>
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
