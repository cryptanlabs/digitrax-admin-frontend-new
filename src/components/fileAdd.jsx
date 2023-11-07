import {Button, Checkbox, TextField, Typography, Select, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useRef, useState} from 'react';
import {FileUpload} from './fileUpload.jsx';
import {TextFields15Pct} from './textFields.jsx';


export function FileAdd({songNumber, preSetBucketTo, buckets = [], submit = () => {}}){
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bucketName, setBucketName] = useState('');
  const [createBucket, setCreateBucket] = useState(false);
  const [changeFilename, setChangeFilename] = useState(false);
  const [differentFilename, setDifferentFilename] = useState(false);
  const [resolution, setResolution] = useState('');
  const [mix, setMix] = useState('');
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const formData = new FormData();

  useEffect(() => {
    if(preSetBucketTo){
      setBucketName(preSetBucketTo)
    }
  }, [])
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const submitFile = async () => {
    formData.append(
      bucketName,
      selectedFile
    );
    formData.append(
      'bucketName',
      bucketName
    );
    if(createBucket){
      formData.append(
        'force',
        true
      );
    }


    submit(formData)
    setSelectedFile(null)
    setBucketName('')
    setUploadEnabled(false)
    setCreateBucket(false)
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setDifferentFilename(file.name.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber)
      } catch (e) {
        console.error(e)
      }
      setSelectedFile(file);
      setCurrentFileName(file.name)
      if(bucketName !== ''){
        setUploadEnabled(true)
      }
    }
  };

  const handleBucketNameChange = (e) => {
    const { name, value } = e.target;
    setBucketName(value)
    setUploadEnabled(value !== '' && selectedFile)
  };

  const handleFileNameChange = (e) => {
    const { name, value } = e.target;
    setCurrentFileName(value)
    try {
      setDifferentFilename(value.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber)
    } catch (e) {
      console.error(e)
    }
  };

  const handleChckboxChange = (e) => {
    const { checked } = e.target;
    setCreateBucket(checked)
  }

  const handleDifferentFilenameCheckbox = (e) => {
    const { checked } = e.target;
    setChangeFilename(checked)
    if(!checked && selectedFile){
      setCurrentFileName(selectedFile?.name)
      setDifferentFilename(selectedFile?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber)
    }
  }

  const handleClosePanel = () => {
    if(!preSetBucketTo){
      submit(formData)
      setSelectedFile(null)
      setBucketName('')
      setUploadEnabled(false)
      setCreateBucket(false)
      setCurrentFileName('')
      setShowFileUpload(false)
      setDifferentFilename(false)
      setChangeFilename(false)
    }
    setShowFileUpload(false)
  }

  const bucketNameEnterSelectElem = () => {

    if(preSetBucketTo){

      return (
        <>
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>Bucket Name</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='addBucket'
              defaultValue={preSetBucketTo}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </div>
        </>
      )
    }

    return (
      <>
        <div className="flex flex-col  w-52">
          <Typography sx={{ fontWeight: "bold" }}>Bucket Name</Typography>
          {createBucket ? (
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='addBucket'
              value={bucketName}
              onChange={handleBucketNameChange}
              variant="outlined"
            />
          ) : (
            <Select
              sx={{ marginTop: 1 }}
              value={bucketName}
              onChange={handleBucketNameChange}
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
      </>
    )
  }

  if(!showFileUpload){
    return (
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
    )
  }

  return (
    <div className="w-[90%] mt-5 flex flex-row  border-2 border-black rounded-lg border-gray-300">
      <div className="w-[90%] m-2 flex flex-row mt-5 ">


        <div className="flex-1">
          <Button
            variant="outlined"
            onClick={submitFile}
            disabled={(!uploadEnabled || differentFilename)}
            sx={{
              marginTop: '30px',
              borderColor: "gray",
              color: uploadEnabled ? "white": "black",
              height: '60px',
              backgroundColor: uploadEnabled ? '#00b00e': "inherit",
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
        {changeFilename && <div className="flex-none ml-8">
          <div className="flex flex-col  w-52">
            <Typography sx={{ fontWeight: "bold" }}>New Filename</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name='add'
              value={currentFileName}
              onChange={handleFileNameChange}
              variant="outlined"
            />
          </div>
        </div>}
        <div className="flex-none mt-2">
          {differentFilename && <Typography
            sx={{
              color:"#af1a1a",
              width: '180px',
              overflowWrap: 'break-word',
              fontSize: '11px',
              marginTop: '5px'}}>File name doesn't match catalog #</Typography>}
          <Button
            variant="outlined"
            onClick={handleFileUploadClick}
            sx={{
              borderColor: differentFilename ? "#af1a1a" : "gray",
              color: differentFilename ? "#af1a1a" : "black",
              marginTop: differentFilename ? 'auto' : '25px',
              height: '60px',
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            {currentFileName !== '' ? currentFileName : 'Select File'}
          </Button>
          <div className="flex flex-row  w-52">
            <Checkbox onChange={handleDifferentFilenameCheckbox}  />
            <span style={{paddingTop: '9px'}}>Use Different Filename</span>
          </div>
        </div>
        <div className="flex-none ml-8">
          {bucketNameEnterSelectElem()}
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
          onClick={handleClosePanel}
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
