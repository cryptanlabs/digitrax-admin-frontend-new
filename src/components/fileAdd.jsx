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
import {base_url} from '../helpers/requests.js';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {isWhiteSpace} from '../helpers/utils.js';

export function FileAdd({
                            newSong,
                            buttonOnly,
                            header,
                            songNumber,
                            preSetBucketTo,
                            isFolderBucket,
                            buckets = [],
                            submit = () => {
                            },
                            handleMetadataChange = () => {
                            },
                            mediaObjects = [],
                            filesStagedForUpload = [],
                            handleRequestDeleteMediaEntry = () => {
                            },
                            getBuckets = () => {}
                        }) {
    // notifications
    const [uploadingProgress, setUploadingProgress] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [uploadError, setUploadError] = useState(false);

    // File upload handling
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
    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const addNewBucketToList = (bucketName) => {
        if (createBucket) {
            if (!localGeneratedSets.includes(bucketName)) {
                setLocalGeneratedSets([...localGeneratedSets, bucketName]);
            }
        }
    };

    const handleClosePanel = (isReset = true) => {
        // submit(formData);
        setSelectedFile(null);
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
        if (!songNumber) return;
        let message
        try {
            setUploadingProgress(true);
            addNewBucketToList(bucketName);
            message = `${currentFileName} to ${bucketName}`
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
            } else if (newSong && !preSetBucketTo) {
                formData.append(
                    'force',
                    true
                );
            }

            if (!isWhiteSpace(description)) {
                formData.append(
                    'description',
                    description
                );

            }


            if (!isWhiteSpace(videoDimension)) {
                formData.append(
                    'videoDimension',
                    videoDimension
                );
            }


            await submit(formData);
            addNewBucketToList(bucketName);
            handleSnackBarOpen(`Uploaded ${message}`)
        } catch (e) {
            console.error(e)
            setUploadError(true)
            handleSnackBarOpen(`Error Uploading ${message}`)
        }

        setUploadingProgress(false)
        handleClosePanel(false);
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
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
                    <Typography sx={{fontWeight: 'bold'}}>Folder Name</Typography>
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
        const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
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
            if (!songNumber) return;
            await handleMetadataChange({
                requestString: mediaMetaData.requestString,
                videoDimension: mediaMetaData.videoDimension,
                description: mediaMetaData.description,
            });
            setEditExisting(false);
        };

        const handleDelete = () => {
            setOpenConfirmDeleteDialog(true);
        };

        const handleCancel = () => {
            setOpenConfirmDeleteDialog(false);
        };

        const handleOkToDelete = async () => {
            setOpenConfirmDeleteDialog(false);
            handleRequestDeleteMediaEntry(mediaItem.requestString);
        };

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
                <div className={`w-full flex flex-row  justify-between items-center`}>
                    <div className={`w-full flex flex-row flex-wrap justify-between items-center`}>
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
                        <div className="flex flex-row">
                            <div className="flex flex-col">
                                {!editExisting && (
                                    <Button
                                        onClick={handleEdit}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            margin: 0,
                                            borderColor: 'gray',
                                            color: 'black',
                                            '&:hover': {
                                                borderColor: '#F1EFEF',
                                                backgroundColor: '#F5F7F8',
                                            },
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 10 }}>Edit</Typography>
                                        <EditIcon></EditIcon>
                                    </Button>
                                )}
                                {editExisting && (
                                    <>
                                        <Button
                                            onClick={handleEdit}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderColor: 'gray',
                                                color: 'black',
                                                '&:hover': {
                                                    borderColor: '#F1EFEF',
                                                    backgroundColor: '#F5F7F8',
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: 10 }}>Close</Typography>
                                            <CloseIcon></CloseIcon>
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderColor: 'gray',
                                                color: 'black',
                                                '&:hover': {
                                                    borderColor: '#F1EFEF',
                                                    backgroundColor: '#F5F7F8',
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: 10 }}>Save</Typography>
                                            <SaveIcon></SaveIcon>
                                        </Button>
                                        <Button
                                          onClick={handleDelete}
                                          sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              borderColor: 'gray',
                                              color: 'black',
                                              '&:hover': {
                                                  borderColor: '#F1EFEF',
                                                  backgroundColor: '#F5F7F8',
                                              },
                                          }}
                                        >
                                            <Typography sx={{ fontSize: 10 }}>Remove</Typography>
                                            <DeleteIcon></DeleteIcon>
                                        </Button>
                                    </>

                                )}
                            </div>

                        </div>
                    </div>
                    <Dialog
                        open={openConfirmDeleteDialog}
                    >
                        <DialogTitle>
                            Confirm Delete Media File.
                        </DialogTitle>
                        <DialogContent>

                            Note That This Cannot Be Undone
                        </DialogContent>
                        <DialogActions>
                            <Button
                                autoFocus
                                onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                sx={{
                                    borderColor: 'gray',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: '#F1EFEF',
                                        backgroundColor: '#7e2121',
                                    },
                                }}
                                onClick={handleOkToDelete}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                </div>
            </>

        );
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
                        getBuckets()
                        if(songNumber) setShowFileUpload(true);
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
                  {!songNumber && <span>Missing Song Number</span>}
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
                    <div className="flex flex-row justify-start">
                        <Typography sx={{fontWeight: 'bold', marginRight: '10px'}}>{`${isFolderBucket ? 'Folder:' : 'Bucket:'}`}</Typography>
                        <Typography sx={{fontWeight: 'bold'}}>{header}</Typography>
                    </div>


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

    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setPersonName(
    //       // On autofill we get a stringified value.
    //       typeof value === 'string' ? value.split(',') : value,
    //     );
    // };

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
                <div className="w-[90%] m-2 flex flex-row flex-wrap mt-3 ">


                    <div className="flex flex-col">
                        <Typography sx={{fontWeight: 'light', fontSize: 12}}>{`Catalog #: C${songNumber}`}</Typography>
                        {uploadingProgress && <CircularProgress />}
                        {!uploadingProgress && (<Button
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
                            {`${newSong ? 'Add' : 'Upload'}`}
                        </Button>)}
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
                        <div className=" flex flex-row flex-wrap">
                            <div className="flex-col">
                                {bucketNameEnterSelectElem()}
                            </div>
                            {/*<div className="flex-col ml-8">*/}
                            {/*    {bucketAddOptions.map((item, idx) => (*/}
                            {/*      <div key={`${idx}-${item}`} className="flex flex-row  w-52">*/}
                            {/*          <Checkbox name={item} onChange={handleBucketSelectChange}/>*/}
                            {/*          <span style={{paddingTop: '9px'}}>{item}</span>*/}
                            {/*      </div>*/}
                            {/*    ))}*/}
                            {/*    <Select*/}
                            {/*      multiple*/}
                            {/*      sx={{marginTop: 1}}*/}
                            {/*      value={bucketToAdd}*/}
                            {/*      onChange={handleBucketSelectChange}*/}
                            {/*    >*/}
                            {/*        {bucketAddOptions.map((value, index) => (*/}
                            {/*          <MenuItem key={index} value={value}>{value}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}


                            {/*</div>*/}
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
