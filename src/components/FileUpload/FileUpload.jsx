import {
    Box,
    Button,
    Checkbox,
    TextField,
    Typography,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, {useEffect, useRef, useState} from 'react';
import {base_url} from '../../helpers/requests.js';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {isWhiteSpace} from '../../helpers/utils.js';
import {useDropzone} from 'react-dropzone';

import {ShowFile} from './ShowFile.jsx'
import {BucketName} from './BucketName.jsx';
import {FileSelect} from './FileSelect.jsx';
import {FileDetails} from './FileDetails.jsx';

export function FileUpload({
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
                            filesStagedForUpload = [],
                            handleRequestDeleteMediaEntry = () => {
                            },
                               uploadMultipleMediaFiles = () => {}
                        }) {
    // notifications
    const [uploadingProgress, setUploadingProgress] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [uploadError, setUploadError] = useState(false);

    // File upload handling

    const [selectedFiles, setSelectedFiles] = useState([]);

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

    const [bucketAddOptions, setBucketAddOptions] = useState(['bucketOne', 'bucketTwo', 'bucketThree'])
    const [bucketToAdd, setBucketsToAdd] = useState([])


    // Form Data For Upload
    const formData = new FormData();

    useEffect(() => {
        if (preSetBucketTo) {
            setBucketName(preSetBucketTo);
        }
        if (localGeneratedSets.length === 0) {
            setLocalGeneratedSets(buckets);
        }
    }, []);

    useEffect(() => {
        setLocalGeneratedSets(buckets);
    }, [buckets]);

    const handleSnackBarOpen = (message) => {
        setSnackBarMessage(message)
        setOpenSnackBar(true)
    }

    const handleSnackBarClose = () => {
        setSnackBarMessage('')
        setOpenSnackBar(false)
        setUploadError(false)
    }




    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackBarClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );


    const addNewBucketToList = (bucketName) => {
        if (createBucket) {
            if (!localGeneratedSets.includes(bucketName)) {
                setLocalGeneratedSets([...localGeneratedSets, bucketName]);
            }
        }
    };

    const handleClosePanel = (isReset = true) => {


    };

    const submitFile = async () => {
        // if (!songNumber) return;
        console.log('STM FileUpload-FileUpload.jsx:148', submitFile); // todo remove dev item
        let message
        try {
            if(bucketName === ''){
                return
            }
            // setBucketName('demo')
            setUploadingProgress(true);
            // addNewBucketToList(bucketName);
            message = `${currentFileName} to ${bucketName}`



            // todo NEED TO DENOTE AS A FOLDER BUCKET
            formData.append(
                'bucketName',
                bucketName
            );
            formData.append(
              'bucketType',
              'folder'
            );
            for(let file of selectedFiles){
                console.log('STM FileUpload-FileUpload.jsx:203', file); // todo remove dev item
                console.log('STM FileUpload-FileUpload.jsx:201', file.name); // todo remove dev item
                formData.append(
                  file.name,
                  file
                );
            }

console.log('STM FileUpload-FileUpload.jsx:208', formData); // todo remove dev item
            uploadMultipleMediaFiles(formData)
            // await submit(formData);
            // addNewBucketToList(bucketName);
            // handleSnackBarOpen(`Uploaded ${message}`)
        } catch (e) {
            console.error(e)
            setUploadError(true)
            handleSnackBarOpen(`Error Uploading ${message}`)
        }

        setUploadingProgress(false)
        // handleClosePanel(false);
    };
    const handleFileChange = (files) => {
        console.log('STM FileUpload-FileUpload.jsx:229', files); // todo remove dev item
        if (files) {
        console.log('STM FileUpload-FileUpload.jsx:225', files); // todo remove dev item
            const updatedArray = []
            for(let file of files){
                const present = selectedFiles.find(item => item.name === file.name)
                if(!present){
                    updatedArray.push(file)
                }
                console.log('STM FileUpload-FileUpload.jsx:239', file); // todo remove dev item
                console.log('STM FileUpload-FileUpload.jsx:240', file.name); // todo remove dev item
            }
            setSelectedFiles((prev) => (
              [...prev, ...updatedArray]
            ));
            setUploadEnabled(true)
        }
    };

    const handleBucketNameChange = (e) => {
        const {name, value} = e.target;
        setBucketName(value);
        setUploadEnabled(value !== '' && selectedFiles?.length > 0);
    };

    const handleFileNameChange = (e) => {
        const {name, value} = e.target;
        setCurrentFileName(value);
        setFileNameChanged(true);
        try {
            setDifferentFilename(value.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
        } catch (e) {
            console.error(e);
        }
    };

    const handleChckboxChange = (e) => {
        const {checked} = e.target;
        setCreateBucket(checked);
    };

    const removeFileFromUpload = (fileName) => {
        setSelectedFiles((prev) => {
            const indexLoc = prev.findIndex(item => item.name === fileName)
            if(indexLoc > -1){
                prev.splice(indexLoc, 1)
            }
            return [...prev]
        })
    }


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                // justifyContent: 'center'
            }}
        >
            <div
                className=" mt-10  border-2 justify-center rounded-t-lg border-gray-300 p-5">
                <Typography sx={{fontWeight: 'bold'}}>{header}</Typography>
            </div>
            <div className="w-full  flex flex-row  border-b-2 border-x-2  border-gray-300">
                <div className="w-full  flex flex-col ">

                <div className="w-[90%] m-2 flex flex-row flex-wrap mt-3 ">

                    <ul>
                        <li><h3>Files Staged For Upload</h3></li>
                        {selectedFiles.map((file, idx) => (
                          <FileDetails file={file} key={idx} removeFile={removeFileFromUpload} />
                          ))}
                    </ul>
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

                    <div className="flex-none ml-8">
                        <div className=" flex flex-row flex-wrap">
                            <div className="flex-col">
                                <BucketName
                                  preSetBucketTo={preSetBucketTo}
                                  createBucket={createBucket}
                                  bucketName={bucketName}
                                  localGeneratedSets={localGeneratedSets}
                                  handleChckboxChange={handleChckboxChange}
                                  handleBucketNameChange={handleBucketNameChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                <div className="w-full  flex flex-col justify-between mr-5">
                    <FileSelect
                      songNumber={songNumber}
                      uploadingProgress={uploadingProgress}
                      submitFile={submitFile}
                      uploadEnabled={uploadEnabled}
                      differentFilename={differentFilename}
                      handleFileChange={handleFileChange}
                    />
                    <div className="flex flex-col mb-2 mt-3">

                        {!uploadingProgress &&
                          (<Button
                          variant="outlined"
                          onClick={submitFile}
                          disabled={(!uploadEnabled )}
                          sx={{

                              borderColor: 'gray',
                              color: uploadEnabled ? 'white' : 'black',
                              height: '60px',
                              backgroundColor: uploadEnabled ? '#0f9b14' : 'inherit',
                              '&:hover': {
                                  borderColor: '#F1EFEF',
                                  backgroundColor: '#F5F7F8',
                              },
                              marginLeft: '50px'
                          }}
                        >
                            Upload
                        </Button>)}

                        {/*  video/x-cdg,video/mp4,audio/mpeg */}
                    </div>
                </div>

            </div>

            <Snackbar
                open={openSnackBar}
                autoHideDuration={12000}
                onClose={handleSnackBarClose}
                action={action}
            >
                <Alert severity={`${uploadError ? 'error' : 'success'}`} onClose={handleSnackBarClose}>{snackBarMessage}</Alert>
            </Snackbar>
        </Box>
    );
}
