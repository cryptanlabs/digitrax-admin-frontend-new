import {Button, Checkbox, TextField, Typography, Select, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useRef, useState} from 'react';
import {FileUpload} from './fileUpload.jsx';
import {TextFields15Pct} from './textFields.jsx';


export function FileAdd({buckets = [], submit, hideHandler = () => {}}){
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bucketName, setBucketName] = useState('');
  const [createBucket, setCreateBucket] = useState(false);
  const [resolution, setResolution] = useState('');
  const [mix, setMix] = useState('');
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('Select File');
  const formData = new FormData();
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const submitFile = async () => {
    console.log('STM components-fileAdd.jsx:19', selectedFile); // todo remove dev item
    formData.append(
      bucketName,
      selectedFile
    );
    formData.append(
      'bucketName',
      bucketName
    );
    for(const thing of formData.entries()){
      console.log('STM components-fileAdd.jsx:23', thing); // todo remove dev item
    }

    submit(formData)
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCurrentFileName(file.name)
      setUploadEnabled(true)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBucketName(value)
  };

  const handleChckboxChange = (e) => {
    console.log('STM components-fileAdd.jsx:51', buckets); // todo remove dev item
    const { checked } = e.target;
    setCreateBucket(checked)
    console.log('STM components-fileAdd.jsx:49', e); // todo remove dev item
  }

  return (
    <div className="w-[90%] mt-5 flex flex-row  border-2 border-black rounded-lg border-gray-300">
      <div className="w-[90%] m-2 flex flex-row mt-5 ">


        <div className="flex-1">
          <Button
            variant="outlined"
            onClick={submitFile}
            disabled={!uploadEnabled}
            sx={{
              marginTop: '30px',
              borderColor: "gray",
              color: "black",
              height: '60px',
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="video/mp4,audio/mpeg"
          />
        </div>
        <div className="flex-1">
          <Button
            variant="outlined"
            onClick={handleFileUploadClick}
            sx={{
              marginTop: '30px',
              borderColor: "gray",
              color: "black",
              height: '60px',
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            {currentFileName}
          </Button>
        </div>
        <div className="flex-none">

        </div>
        <div className="flex-none">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Bucket Name</Typography>
            {createBucket ? (
              <TextField
                sx={{ marginTop: 1 }}
                hiddenLabel
                name='addBucket'
                value={bucketName}
                onChange={handleChange}
                variant="outlined"
              />
            ) : (
              <Select
                sx={{ marginTop: 1 }}
                value={bucketName}
                label="selectBucket"
                onChange={handleChange}
              >
                {buckets.map((value, index) => (
                  <MenuItem key={index} value={value}>{value}</MenuItem>
                ))}
              </Select>
            )}

          </div>
          <div className="flex flex-row  w-52">
            <Checkbox onChange={handleChckboxChange}  />
            <span style={{paddingTop: '9px'}}>Create Bucket</span>
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Resolution</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              variant="outlined"
            />
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Mix</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={mix}
              onChange={e => setMix(e.target.value)}
              variant="outlined"
            />
          </div>
        </div>

      </div>
      <div className="flex-none ml-20 content-start">
        <Button
          onClick={hideHandler}
          sx={{

            borderColor: "gray",
            color: "black",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#F5F7F8",
            },
          }}
        >
          <CloseIcon></CloseIcon>
        </Button>
      </div>
  </div>
  )
}
