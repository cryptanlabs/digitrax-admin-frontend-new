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
        // submit(formData);
        setSelectedFiles(null);
        setUploadEnabled(false);
        setCreateBucket(false);
        if(isReset) setShowFileUpload(false);
        setDifferentFilename(false);
        setChangeFilename(false);
        setFileNameChanged(false);
        setCurrentFileName('');
        if (preSetBucketTo) {
            setBucketName(preSetBucketTo);
        } else {
            setBucketName('');
        }

    };

    const submitFile = async () => {
        // if (!songNumber) return;
        console.log('STM FileUpload-FileUpload.jsx:148', submitFile); // todo remove dev item
        let message
        try {
            setBucketName('demo')
            setUploadingProgress(true);
            // addNewBucketToList(bucketName);
            message = `${currentFileName} to ${bucketName}`
            // if (fileNameChanged) {
            //     formData.append(
            //         bucketName,
            //         selectedFiles,
            //         currentFileName
            //     );
            // } else {
            //     formData.append(
            //         bucketName,
            //         selectedFiles
            //     );
            // }
            //
            // formData.append(
            //     'bucketName',
            //     bucketName
            // );
            //
            // if (createBucket) {
            //     formData.append(
            //         'force',
            //         true
            //     );
            // } else if (newSong && !preSetBucketTo) {
            //     formData.append(
            //         'force',
            //         true
            //     );
            // }
            //
            // if (!isWhiteSpace(description)) {
            //     formData.append(
            //         'description',
            //         description
            //     );
            //
            // }
            //
            //
            // if (!isWhiteSpace(videoDimension)) {
            //     formData.append(
            //         'videoDimension',
            //         videoDimension
            //     );
            // }

            formData.append(
                'bucketName',
                bucketName
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
        // const file = event.target.files[0];
        if (files) {
console.log('STM FileUpload-FileUpload.jsx:225', files); // todo remove dev item
            // try {
            //     setDifferentFilename(file.name.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
            // } catch (e) {
            //     console.error(e);
            // }
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
            // setCurrentFileName(file.name);
            // if (bucketName !== '') {
            //     setUploadEnabled(true);
            // }
        }
    };

    const handleBucketNameChange = (e) => {
        const {name, value} = e.target;
        setBucketName(value);
        setUploadEnabled(value !== '' && selectedFiles);
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

    const handleDifferentFilenameCheckbox = (e) => {
        const {checked} = e.target;
        setChangeFilename(checked);
        if (!checked && selectedFiles) {
            setCurrentFileName(selectedFiles?.name);
            setDifferentFilename(selectedFiles?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
        }
    };






    const ShowGeneratedMediaFiles = ({generatedMediaItems = []}) => {

        if (generatedMediaItems?.length === 0) return null;
        const count = generatedMediaItems?.length;
        return (
            <>
                {generatedMediaItems.map((mediaEntry, index) => (
                    <div key={index}
                         className={`flex flex-row  justify-between items-center border-b-2 border-x-2 ${index === (count - 1) ? 'rounded-b-lg' : ''} border-gray-300 p-5`}>
                        <ShowFile
                            mediaItem={mediaEntry}
                            songNumber={songNumber}
                            handleMetadataChange={handleMetadataChange}
                            handleRequestDeleteMediaEntry={handleRequestDeleteMediaEntry}
                        />
                    </div>
                ))}
            </>

        );
    };



    if(!showFileUpload && buttonOnly){
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

    if (!showFileUpload) {
        return (
            <Box
                sx={{
                    width: '100%',
                }}
            >
                <div
                    className={`mt-10 flex flex-row border-2 justify-between ${mediaObjects?.length > 0 ? 'rounded-t-lg' : 'rounded-lg'}  border-gray-300 p-5`}>
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
            </Box>
        );
    }



    const handleBucketSelectChange = (e) => {
        const {name, value} = e.target;

        setBucketsToAdd(typeof value === 'string' ? value.split(',') : value)

        // setBucketAddOptions((prev) => ({
        //     ...prev,
        //     [name]: value,
        // }));
    };

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
            <div className="  flex flex-row  border-b-2 border-x-2  border-gray-300">
                <div className="  flex flex-col ">
                <div className="w-[90%] m-2 flex flex-row flex-wrap mt-3 ">
                    <FileSelect
                      songNumber={songNumber}
                      uploadingProgress={uploadingProgress}
                      submitFile={submitFile}
                      uploadEnabled={uploadEnabled}
                      differentFilename={differentFilename}
                      handleFileChange={handleFileChange}
                    />
                    <ul>
                        <li><h3>Files Staged For Upload</h3></li>
                        {selectedFiles.map((file, idx) => (
                          <FileDetails file={file} key={idx} />
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
                    <div className={`flex-none mt-2 ${changeFilename ? '' : 'ml-56'}`}>
                        {differentFilename && <Typography
                            sx={{
                                color: '#af1a1a',
                                width: '180px',
                                overflowWrap: 'break-word',
                                fontSize: '11px',
                                marginTop: '5px'
                            }}>File name doesn't match catalog #</Typography>}

                        <div className="flex flex-row  w-52">
                            <Checkbox checked={changeFilename} onChange={handleDifferentFilenameCheckbox}/>
                            <span style={{paddingTop: '9px'}}>Use Different Filename</span>
                        </div>
                    </div>
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
                            <div className="flex-col ml-8">
                                {/*{bucketAddOptions.map((item, idx) => (*/}
                                {/*  <div key={`${idx}-${item}`} className="flex flex-row  w-52">*/}
                                {/*      <Checkbox name={item} onChange={handleBucketSelectChange}/>*/}
                                {/*      <span style={{paddingTop: '9px'}}>{item}</span>*/}
                                {/*  </div>*/}
                                {/*))}*/}
                                <Select
                                  multiple
                                  sx={{marginTop: 1}}
                                  value={bucketToAdd}
                                  onChange={handleBucketSelectChange}
                                >
                                    {bucketAddOptions.map((value, index) => (
                                      <MenuItem key={index} value={value}>{value}</MenuItem>
                                    ))}
                                </Select>


                            </div>
                            {/*<div className="flex-col ml-8">*/}
                            {/*    {bucketAddOptions.map((item, idx) => (*/}
                            {/*      <div key={`${idx}-${item}`} className="flex flex-row  w-52">*/}
                            {/*          <Checkbox name={item} onChange={handleBucketSelectChange}/>*/}
                            {/*          <span style={{paddingTop: '9px'}}>{item}</span>*/}
                            {/*      </div>*/}
                            {/*    ))}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className=" flex flex-col flex-wrap">
                        <div className="flex ml-8">
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
                        <div className="flex ml-8">
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
                    <div className="flex flex-col mb-2 ml-2">
                        <Typography sx={{fontWeight: 'light', fontSize: 12}}>{`Catalog #: C${songNumber}`}</Typography>
                        {uploadingProgress && <CircularProgress />}
                        {!uploadingProgress && (<Button
                          variant="outlined"
                          onClick={submitFile}
                          // disabled={(!uploadEnabled || differentFilename)}
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
                        </Button>)}

                        {/*  video/x-cdg,video/mp4,audio/mpeg */}
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
