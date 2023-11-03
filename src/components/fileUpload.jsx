import {Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import {useEffect, useRef, useState} from 'react';


export function FileUpload({mediaObject, returnUploadFile}){
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedMedia, setGeneratedMedia] = useState({});

  useEffect(() => {
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
      <div className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-lg border-gray-300 p-5">
        <Typography sx={{ fontWeight: "bold" }}>{generatedMedia.generatedSet || '720-blk-background'}</Typography>
      </div>
      <div className="w-[90%] mt-10 flex flex-row justify-between">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="video/mp4,audio/mpeg"
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
            <Typography
              sx={{ fontWeight: "bold", padding: 2, color: "dark-gray" }}
            >
              Song Added
            </Typography>
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
  )
}
