import {Button, Checkbox, TextField, Typography, Select, MenuItem} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect, useRef, useState} from 'react';
import {FileUpload} from './fileUpload.jsx';
import {TextFields15Pct} from './textFields.jsx';
import {base_url} from '../helpers/requests.js';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {isWhiteSpace} from '../helpers/utils.js';

export function FileAdd ({
                           newSong,
                           buttonOnly,
                           header,
                           songNumber,
                           preSetBucketTo,
                           buckets = [],
                           submit = () => {
                           },
                           handleMetadataChange = () => {
                           },
                           mediaObjects = [],
                           filesStagedForUpload = []
                         }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Bucket Name
  const [bucketName, setBucketName] = useState('');
  const [createBucket, setCreateBucket] = useState(false);
  const [localGeneratedSets, setLocalGeneratedSets] = useState([]);

  // File name
  const [changeFilename, setChangeFilename] = useState(false);
  const [differentFilename, setDifferentFilename] = useState(false);
  const [fileNameChanged, setFileNameChanged] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');

  // Proceed Permissions
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Extra Data
  const [digitraxId, setDigitraxId] = useState('');
  const [description, setDescription] = useState('');
  const [videoDimension, setVideoDimension] = useState('');

  // Form Data For Upload
  const formData = new FormData();

  useEffect(() => {
    if (preSetBucketTo) {
      setBucketName(preSetBucketTo);
    }
    if(localGeneratedSets.length === 0){
      console.log('STM components-fileAdd.jsx:55: buckets', buckets); // todo remove dev item
      setLocalGeneratedSets(buckets)
    }

  }, []);
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const addNewBucketToList = (bucketName) => {
    if(createBucket){
      if(!localGeneratedSets.includes(bucketName)){
        setLocalGeneratedSets([...localGeneratedSets, bucketName])
      }
    }
  }

  const submitFile = async () => {
    if(!songNumber) return
    addNewBucketToList(bucketName)

    if (fileNameChanged) {
      formData.append(
        bucketName,
        selectedFile,
        currentFileName
      );
    } else {
      formData.append(
        bucketName,
        selectedFile
      );
    }

    formData.append(
      'bucketName',
      bucketName
    );

    if (createBucket) {
      formData.append(
        'force',
        true
      );
    } else if(newSong && !preSetBucketTo){
      formData.append(
        'force',
        true
      );
    }

    if(!isWhiteSpace(description)){
      formData.append(
        'description',
        description
      );

    }


    if(!isWhiteSpace(videoDimension)){
      formData.append(
        'videoDimension',
        videoDimension
      );
    }



    submit(formData);
    addNewBucketToList(bucketName)
    setSelectedFile(null);
    setBucketName('');
    setUploadEnabled(false);
    setCreateBucket(false);
    setCurrentFileName('')
    setVideoDimension('')
    setDescription('')
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('STM components-fileAdd.jsx:130', selectedFile?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString(), songNumber); // todo remove dev item
        setDifferentFilename(file.name.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
      } catch (e) {
        console.error(e);
      }
      setSelectedFile(file);
      setCurrentFileName(file.name);
      if (bucketName !== '') {
        setUploadEnabled(true);
      }
    }
  };

  const handleBucketNameChange = (e) => {
    const {name, value} = e.target;
    setBucketName(value);
    setUploadEnabled(value !== '' && selectedFile);
  };

  const handleFileNameChange = (e) => {
    const {name, value} = e.target;
    setCurrentFileName(value);
    setFileNameChanged(true);
    try {
      console.log('STM components-fileAdd.jsx:153', selectedFile?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString(), songNumber); // todo remove dev item
      setDifferentFilename(value.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChckboxChange = (e) => {
    const {checked} = e.target;
    setCreateBucket(checked);
  };

  const handleDifferentFilenameCheckbox = (e) => {
    const {checked} = e.target;
    setChangeFilename(checked);
    if (!checked && selectedFile) {
      setCurrentFileName(selectedFile?.name);
      setDifferentFilename(selectedFile?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
    }
  };

  const handleClosePanel = () => {
    if (!preSetBucketTo) {
      submit(formData);
      setSelectedFile(null);
      setBucketName('');
      setUploadEnabled(false);
      setCreateBucket(false);
      setCurrentFileName('');
      setShowFileUpload(false);
      setDifferentFilename(false);
      setChangeFilename(false);
    }
    setShowFileUpload(false);
  };


  // if(buttonOnly){
  //   return (
  //     <Button
  //       variant="outlined"
  //       onClick={() => {
  //         setShowFileUpload(true);
  //       }}
  //       sx={{
  //         marginRight: '15px',
  //         borderColor: '#00b00e',
  //         backgroundColor: '#00b00e',
  //         color: 'white',
  //         '&:hover': {
  //           borderColor: '#F1EFEF',
  //           backgroundColor: '#86A789',
  //         },
  //       }}
  //     >
  //       Add Media
  //     </Button>
  //   )
  // }
  const bucketNameEnterSelectElem = () => {

    if (preSetBucketTo) {

      return (
        <>
          <div className="flex flex-col  w-52">
            <Typography sx={{fontWeight: 'bold'}}>Bucket Name</Typography>
            <TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="addBucket"
              defaultValue={preSetBucketTo}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col  w-52">
          <Typography sx={{fontWeight: 'bold'}}>Bucket Name</Typography>
          {createBucket ? (
            <TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="addBucket"
              value={bucketName}
              onChange={handleBucketNameChange}
              variant="outlined"
            />
          ) : (
            <Select
              sx={{marginTop: 1}}
              value={bucketName}
              onChange={handleBucketNameChange}
            >
              {localGeneratedSets.map((value, index) => (
                <MenuItem key={index} value={value}>{value}</MenuItem>
              ))}
            </Select>
          )}

        </div>
        <div className="flex flex-row  w-52">
          <Checkbox checked={createBucket} onChange={handleChckboxChange}/>
          <span style={{paddingTop: '9px'}}>Create Bucket</span>
        </div>
      </>
    );
  };




  const ShowFile = ({mediaItem = {}}) => {
    const [editExisting, setEditExisting] = useState(false);
    const [mediaMetaData, setMediaMetaData] = useState({
      digitraxId: '',
      fileType: '',
      generatedSet: '',
      videoDimension: '',
      description: '',
      fullFilename: '',
      requestString: ''
    });

    useEffect(() => {
      setMediaMetaData({
        digitraxId: mediaItem.digitraxId,
        fileType: mediaItem.fileType,
        generatedSet: mediaItem.generatedSet,
        videoDimension: mediaItem.videoDimension,
        description: mediaItem.description,
        fullFilename: mediaItem.fullFilename,
        requestString: mediaItem.requestString
      });
    }, [mediaItem]);
    const handleChange = (e) => {
      const {name, value} = e.target;

      setMediaMetaData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSave = async () => {
      if(!songNumber) return
      await handleMetadataChange({
        requestString: mediaMetaData.requestString,
        videoDimension: mediaMetaData.videoDimension,
        description: mediaMetaData.description,
      })
      setEditExisting(false)
    }

    const handleEdit = () => {
      // if (!preSetBucketTo) {
      //   submit(formData);
      //   setSelectedFile(null);
      //   setBucketName('');
      //   setUploadEnabled(false);
      //   setCreateBucket(false);
      //   setCurrentFileName('');
      //   setShowFileUpload(false);
      //   setDifferentFilename(false);
      //   setChangeFilename(false);
      // }
      setEditExisting(!editExisting);
    };

    return (
      < >
        <div className="flex-none ml-8">
          <div className="flex flex-col   ">
            <Typography sx={{fontWeight: 'bold'}}>Digitrax Id</Typography>
            <div className="w-52 h-14 mt-2 border border-gray-300 rounded-md">
              <Typography sx={{margin: 2}}>{mediaMetaData.digitraxId}</Typography>
            </div>
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  ">
            <Typography sx={{fontWeight: 'bold'}}>Filename</Typography>
            <div className="w-52 h-14 mt-2 border border-gray-300 rounded-md">
              <Typography sx={{margin: 2}}>{mediaMetaData.fullFilename}</Typography>
            </div>
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  ">
            <Typography sx={{fontWeight: 'bold'}}>Resolution</Typography>
            {!editExisting && (
              <div className="flex flex-col w-52 h-14 mt-2 border border-gray-300 rounded-md">
                <Typography sx={{margin: 2}}>{mediaMetaData.videoDimension}</Typography>
              </div>)}
            {editExisting && (<TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="videoDimension"
              value={mediaMetaData.videoDimension}
              onChange={handleChange}
              variant="outlined"
            />)}
          </div>
        </div>
        <div className="flex-none ml-8">
          <div className="flex flex-col  ">
            <Typography sx={{fontWeight: 'bold'}}>Description</Typography>
            {!editExisting && (<div
              className="flex flex-col justify-around grow w-52 h-14 border border-gray-300 rounded-md items-center self-center">
              <Typography sx={{marginLeft: 1}}>{mediaMetaData.description}</Typography>
            </div>)}
            {editExisting && (<TextField
              sx={{marginTop: 1}}
              hiddenLabel
              name="description"
              value={mediaMetaData.description}
              onChange={handleChange}
              variant="outlined"
            />)}
          </div>
        </div>
        <div className="flex-none ml-8">
          <a href={`${base_url}/fileGetInternal/${mediaItem.requestString}`} target="_blank"
             download>
            <Button
              variant="outlined"
              onClick={() => {
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
              Download File: {mediaItem.fullFilename}
            </Button>
          </a>
        </div>
        <div className="shrink content-start">
          <div className="flex flex-col">
            {!editExisting && (
              <Button
                onClick={handleEdit}
                sx={{
                  borderColor: 'gray',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
              >
                <EditIcon></EditIcon>
              </Button>
            )}
            {editExisting && (
              <>
                <Button
                  onClick={handleEdit}
                  sx={{
                    borderColor: 'gray',
                    color: 'black',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  <CloseIcon></CloseIcon>
                </Button>
                <Button
                  onClick={handleSave}
                  sx={{
                    borderColor: 'gray',
                    color: 'black',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  <SaveIcon></SaveIcon>
                </Button>
              </>

            )}
          </div>
        </div>
      </>

    );
  };

  const ShowGeneratedMediaFiles = ({generatedMediaItems = []}) => {

    if(generatedMediaItems?.length === 0) return null;
    const count = generatedMediaItems?.length;
    return (
      <>
        {generatedMediaItems.map((mediaEntry, index) => (
          <div key={index} className={`w-[90%] flex flex-row justify-between items-center border-b-2 border-x-2 ${index === (count-1) ? 'rounded-b-lg' : ''} border-gray-300 p-5`}>
            <ShowFile
              mediaItem={mediaEntry}
            />
          </div>
        ))}
      </>

    );
  };


  if (!showFileUpload) {
    if(buttonOnly){
      return (
        <div>
          <div
            className={`w-[90%] flex flex-row justify-start`}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowFileUpload(true);
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
              Add Media
            </Button>

          </div>
        </div>
      );
    }


    return (
      <div>
        <div
          className={`w-[90%] mt-10 flex flex-row border-2 justify-between ${mediaObjects?.length > 0 ? 'rounded-t-lg' : 'rounded-lg'}  border-gray-300 p-5`}>
          <Typography sx={{fontWeight: 'bold'}}>{header}</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setShowFileUpload(true);
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
            Add Media
          </Button>
        </div>
        <ShowGeneratedMediaFiles generatedMediaItems={mediaObjects}/>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-[90%] mt-10 flex flex-col border-2 justify-center rounded-t-lg border-gray-300 p-5">
        <Typography sx={{fontWeight: 'bold'}}>{header}</Typography>
      </div>
      <div className="w-[90%]  flex flex-row  border-b-2 border-x-2  border-gray-300">
        <div className="w-[90%] m-2 flex flex-row mt-3 ">


          <div className="flex-1">
            <Typography sx={{fontWeight: 'light', fontSize: 12}}>{`Catalog #: C${songNumber}`}</Typography>
            <Button
              variant="outlined"
              onClick={submitFile}
              disabled={(!uploadEnabled || differentFilename)}
              sx={{

                borderColor: 'gray',
                color: uploadEnabled ? 'white' : 'black',
                height: '60px',
                backgroundColor: uploadEnabled ? '#00b00e' : 'inherit',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
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
              accept="*"
            />
          {/*  video/x-cdg,video/mp4,audio/mpeg */}
          </div>
          {changeFilename && <div className="flex-none ml-8">
            <div className="flex flex-col  w-48">
              <Typography sx={{fontWeight: 'bold'}}>New Filename</Typography>
              <TextField
                sx={{marginTop: 1}}
                hiddenLabel
                name="add"
                value={currentFileName}
                onChange={handleFileNameChange}
                variant="outlined"
              />
            </div>
          </div>}
          <div className={`flex-none mt-2 ${changeFilename ? '' : 'ml-56'}`}>
            {differentFilename && <Typography
              sx={{
                color: '#af1a1a',
                width: '180px',
                overflowWrap: 'break-word',
                fontSize: '11px',
                marginTop: '5px'
              }}>File name doesn't match catalog #</Typography>}
            <Button
              variant="outlined"
              onClick={handleFileUploadClick}
              sx={{
                borderColor: differentFilename ? '#af1a1a' : 'gray',
                color: differentFilename ? '#af1a1a' : 'black',
                marginTop: differentFilename ? 'auto' : '25px',
                height: '60px',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }}
            >
              {currentFileName !== '' ? currentFileName : 'Select File'}
            </Button>
            <div className="flex flex-row  w-52">
              <Checkbox checked={changeFilename} onChange={handleDifferentFilenameCheckbox}/>
              <span style={{paddingTop: '9px'}}>Use Different Filename</span>
            </div>
          </div>
          <div className="flex-none ml-8">
            {bucketNameEnterSelectElem()}
          </div>
          <div className="w-[90%]  flex flex-row flex-wrap">
            <div className="flex-none ml-8">
              <div className="flex flex-col mt-2 w-52">
                <Typography sx={{fontWeight: 'bold'}}>Resolution</Typography>
                <TextField

                  hiddenLabel
                  name="videoDimension"
                  value={videoDimension}
                  onChange={e => setVideoDimension(e.target.value)}
                  variant="outlined"
                />
              </div>
            </div>
            {/*<div className="flex-none ml-8">*/}
            {/*  <div className="flex flex-col mt-2 w-52">*/}
            {/*    <Typography sx={{fontWeight: 'bold'}}>Digitrax Id</Typography>*/}
            {/*    <TextField*/}
            {/*      hiddenLabel*/}
            {/*      name="digitraxId"*/}
            {/*      value={digitraxId}*/}
            {/*      onChange={e => setDigitraxId(e.target.value)}*/}
            {/*      variant="outlined"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className="flex-none ml-8">
              <div className="flex flex-col mt-2 w-52">
                <Typography sx={{fontWeight: 'bold'}}>Description</Typography>
                <TextField
                  hiddenLabel
                  name="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none ml-20 content-start">
          <Button
            onClick={handleClosePanel}
            sx={{

              borderColor: 'gray',
              color: 'black',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#F5F7F8',
              },
            }}
          >
            <CloseIcon></CloseIcon>
          </Button>
        </div>
      </div>
      <ShowGeneratedMediaFiles generatedMediaItems={mediaObjects}/>
    </>
  );
}
