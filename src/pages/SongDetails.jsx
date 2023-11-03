import {useEffect, useState, useRef, useContext} from 'react';
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {SongDetailsContext} from '../context/SongDetailsContext';
import {  TextFields40Pct, TextFields15Pct} from '../components/textFields'
import { FileUpload } from '../components/fileUpload'
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
  "ISRC": "ISRCCAMixVocal",
  "HFA Song Code": "HFASongCode",
  "HFA-Mechanical-A Mix": "MechanicalRegistrationNumberA",
  "HFA-Mechanical-D Mix": "MechanicalRegistrationNumberD",
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
  const {generatedSets, uploadMediaFile, updateSong, createComment, getCommentsForSong} = useContext(SongDetailsContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesForUpload, setFilesForUpload] = useState({});
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(demoComments)
  const [showFileUpload, setShowFileUpload] = useState(false);
  const fileInputRef = useRef(null);


  const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);
  const [licensingInformation, setLicensingInformation] = useState({
    ISRCCAMixVocal: "",
    HFASongCode: "",
    MechanicalRegistrationNumberA: "",
    MechanicalRegistrationNumberD: "",
    Writer: ""
  });

  const [basicInformation, setBasicInformation] = useState({
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
  });

  useEffect(() => {
    if (location.state) {
      console.log('STM pages-SongDetails.jsx:92', location.state.rowData); // todo remove dev item
      setLicensingInformation((prev) => ({
        ...prev,
        ISRCCAMixVocal: location.state.rowData.ISRCCAMixVocal,
        HFASongCode: location.state.rowData.HFASongCode,
        MechanicalRegistrationNumberA: location.state.rowData.MechanicalRegistrationNumberA,
        MechanicalRegistrationNumberD: location.state.rowData.MechanicalRegistrationNumberD,
        Writer: location.state.rowData.Writer,
      }));

      setBasicInformation((prev) => ({
        ...prev,
        Title: location.state.rowData.Title,
        Artist: location.state.rowData.Artist,
        Genre: location.state.rowData.Genre,
        SongNumber: location.state.rowData.SongNumber,
        SubGenre: location.state.rowData.SubGenre,
        BarIntro: location.state.rowData.BarIntro,
        SongKey: location.state.rowData.SongKey,
        Duration: location.state.rowData.Duration,
        Mixes: location.state.rowData.Mixes,
        MixRendered: location.state.rowData.MixRendered,
        SongReleaseYear: location.state.rowData.SongReleaseYear,
        Description: location.state.rowData.Description,
      }));

      getCommentsForSong()

      console.log('STM pages-SongDetails.jsx:105', licensingInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:108', basicInformation); // todo remove dev item
      console.log('STM pages-SongDetails.jsx:114', location); // todo remove dev item
    }
  }, []);


  useEffect(() => {
      const getComments = async () => {
        if (location.state && location.state?.rowData?.SongNumber) {
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


  const handleSongUpload = () => {
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
            name="Id"
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
      <div className="w-full mt-10 flex items-center justify-center">
        {!location.state ? (
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
        ) : (
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
            Edit
          </Button>
        )}
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
            <div key={index} className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
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
      </div>
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
              className="w-[30%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
            >
              <Typography sx={{ fontSize: 14 }}>{header}</Typography>
            </div>
          ))}
        </div>
        {location.state &&
          location.state.rowData.SongPublisher.map((publisher, index) => (
            <div
              key={index}
              className="w-full border-b flex border-gray-300 h-20"
            >
              {songPublisherHeaders.map((header, index) => (
                <div key={header} className="w-[30%] h-full flex items-center justify-center">
                  {" "}
                  <TextField
                    sx={{ marginTop: 1, width: "90%" }}
                    size="small"
                    hiddenLabel
                    variant="outlined"
                    defaultValue={publisher[header] ?? ''}
                  ></TextField>
                </div>
              ))}
            </div>
          ))}
        {location.state &&
          location.state.rowData.SongPublisher.length === 0 && (
            <div className="w-full border-b flex border-gray-300 h-20">
              <div className="w-[20%] h-full flex items-center justify-center ">
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                ></TextField>
              </div>
            </div>
          )}
        {!location.state && (
          <div className="w-full border-b flex border-gray-300 h-20">
            <div className="w-[20%] h-full flex items-center justify-center ">
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center">
              {" "}
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center">
              {" "}
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center">
              {" "}
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center ">
              {" "}
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
            <div className="w-[20%] h-full flex items-center justify-center  ">
              {" "}
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              ></TextField>
            </div>
          </div>
        )}
      </div>
      <div className="w-[90%] mt-5 flex items-center justify-end">
        {!location.state ? (
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
        ) : (
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
        )}
      </div>
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Comments</Typography>
        </div>
      </div>
      <div className="w-[90%] mt-10 flex overflow-x-scroll">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col ml-10 mb-10">
            <div className="flex flex-row items-center p-5">
              <Typography variant="body1">{comment.UserName}</Typography>
              <Typography sx={{ marginLeft: 10 }} variant="body2">
                {comment.date}
              </Typography>
            </div>
            <div className="bg-gray-300 w-80 ml-5 p-2 rounded-md rounded-tl-none">
              <Typography>{comment.Content}</Typography>
            </div>
          </div>
        ))}
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
          submit={uploadMediaFile}
          buckets={generatedSets}
          hideHandler = {() => {setShowFileUpload(false)}}
        ></FileAdd>
      )}



      {location?.state?.rowData?.GeneratedMedia?.length > 0 ? (location.state.rowData.GeneratedMedia.map((entry, index) => (
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
