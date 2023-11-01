import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const SongDetails = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const publishingHeaders = [
    "ISRC",
    "HFA Song Code",
    "HFA-Mechanical-A Mix",
    "HFA-Mechanical-D Mix",
    "Territories",
    "Writer",
  ];

  const songPublisherHeaders = [
    "Id",
    "PublisherAdmin",
    "PublisherDatabaseId",
    "Share",
    "SongNumber",
    "SubPublisherDetails",
  ];

  const democomment = {
    name: "Tory Flenniken",
    date: "9/6/2023 2:20pm",
    text: `I've uploaded all of the files and they are ready for Quality Assurance`,
  };

  const democomment2 = {
    name: "Tory Flenniken",
    date: "9/6/2023 2:20pm",
    text: `I've uploaded all of the files and they are ready for Quality Assurance`,
  };
  const demoComments = [democomment, democomment2];

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
    console.log(location);
    if (location.state) {
      setData(location.state.rowData);
      console.log(location.state.rowData);
    }
  }, []);

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
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Id}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Song Title</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Title}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Artist}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Genre}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>SubGenre</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.SubGenre}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
      </div>
      <div className="w-[90%] flex flex-row mt-10 flex">
        <div className="flex flex-col  w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Bar Intro</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.BarIntro}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Key</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.SongKey}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Duration</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Duration}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mixes</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.Mixes}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mix Rendered</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.MixRendered}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Release Year</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              defaultValue={location.state.rowData.SongReleaseYear.toString()}
              variant="outlined"
            />
          ) : (
            <TextField sx={{ marginTop: 1 }} hiddenLabel variant="outlined" />
          )}
        </div>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col w-[90%] ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Song Description</Typography>
          {location.state ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              multiline
              rows={4}
              defaultValue={location.state.rowData.Description}
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
      <div className="w-full mt-10 flex items-center justify-center">
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
            UPLOAD
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
            Edit
          </Button>
        )}
      </div>
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
          <div className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
            {location.state ? (
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                defaultValue={location.state.rowData.ISRCAAMixVocal}
                variant="outlined"
              />
            ) : (
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              />
            )}
          </div>
          <div className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
            {location.state ? (
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                defaultValue={location.state.rowData.HFASongCode}
                variant="outlined"
              />
            ) : (
              <TextField
                sx={{ marginTop: 1, width: "90%" }}
                size="small"
                hiddenLabel
                variant="outlined"
              />
            )}
          </div>
          <div className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            />
          </div>
          <div className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            />
          </div>
          <div className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 ">
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            />
          </div>
          <div className="w-[20%] h-full flex items-center justify-center">
            <TextField
              sx={{ marginTop: 1, width: "90%" }}
              size="small"
              hiddenLabel
              variant="outlined"
            />
          </div>
        </div>
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
            UPLOAD
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
          {location.state && location.state.rowData.SongPublisher.length > 0 ? (
            <Typography sx={{ fontWeight: "bold" }}>
              Edit Publisher Details
            </Typography>
          ) : (
            <Typography sx={{ fontWeight: "bold" }}>
              Add Publisher Details
            </Typography>
          )}
        </div>
      </div>
      <div className="w-[90%] mt-10 flex flex-col border-2 border-black rounded-lg border-gray-300">
        <div className="w-full h-10 border-b flex border-gray-300">
          {songPublisherHeaders.map((header, index) => (
            <div
              key={index}
              className="w-[20%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
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
              <div className="w-[20%] h-full flex items-center justify-center ">
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.Id}
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.PublisherAdmin}
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.PublisherDatabaseId}
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.Share}
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center ">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.SongNumber}
                ></TextField>
              </div>
              <div className="w-[20%] h-full flex items-center justify-center  ">
                {" "}
                <TextField
                  sx={{ marginTop: 1, width: "90%" }}
                  size="small"
                  hiddenLabel
                  variant="outlined"
                  defaultValue={publisher.SubPublisherDetails}
                ></TextField>
              </div>
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
        {demoComments.map((comment) => (
          <div key={comment.id} className="flex flex-col ml-10 mb-10">
            <div className="flex flex-row items-center p-5">
              <Typography variant="body1">{comment.name}</Typography>
              <Typography sx={{ marginLeft: 10 }} variant="body2">
                {comment.date}
              </Typography>
            </div>
            <div className="bg-gray-300 w-80 ml-5 p-2 rounded-md rounded-tl-none">
              <Typography>{comment.text}</Typography>
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
              defaultValue={location.state.rowData.Description}
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
      <div className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-lg border-gray-300 p-5">
        <Typography sx={{ fontWeight: "bold" }}>Example Song 720p</Typography>
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
          <Typography>SVG, PNG, or JPG</Typography>
        </div>
        <div className="w-[33%] h-60 border border-gray-300 border-2 rounded-lg">
          {selectedFile && (
            <img
              src={selectedFile}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          {!selectedFile && <Typography sx={{fontWeight: 'bold', padding: 2, color: 'gray'}}>Song title no background</Typography>}
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
              color: "#FF6969"
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
