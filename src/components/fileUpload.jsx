import {Button, TextField, Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import {useEffect, useRef, useState} from 'react';
import {base_url} from '../helpers/requests.js';


export function FileUpload({mediaObject = {}, returnUploadFile = () => {}, handleMetadataChange = () => {}}){
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedMedia, setGeneratedMedia] = useState({});

  useEffect(() => {
    console.log('STM components-fileUpload.jsx:12', mediaObject); // todo remove dev item
    setGeneratedMedia(mediaObject)
  }, [mediaObject]);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      try {
        if (file.name.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() === generatedMedia.SongNumber){
          console.log('STM components-fileUpload.jsx:23', file.name); // todo remove dev item
          returnUploadFile({mediaFile: file, ...generatedMedia});
        }

      } catch (e) {
        console.error(e)
      }
    }
  };

  return (
    <>
      <div className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-t-lg border-gray-300 p-5">
        <Typography sx={{ fontWeight: "bold" }}>{generatedMedia.generatedSet || '720-blk-background'}</Typography>
      </div>
      <div className="w-[90%] flex flex-row  justify-between items-center border-b-2 border-x-2 rounded-b-lg border-gray-300 p-5">
        <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Digitrax Id</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={generatedMedia.digitraxId}
              onChange={handleMetadataChange}
              variant="outlined"
            />
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Filename</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={generatedMedia.fullFilename}
              onChange={handleMetadataChange}
              variant="outlined"
            />
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>videoDimension</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={generatedMedia.videoDimension}
              onChange={handleMetadataChange}
              variant="outlined"
            />
          </div>
        </div>
        <div className="flex-none ml-8">
          <a href={`${base_url}/fileGetInternal/${generatedMedia.requestString}`} target="_blank" download>
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
              Download File:  {generatedMedia.fullFilename}
            </Button>
          </a>
        </div>
      </div>

    </>
  )
}
