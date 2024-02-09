import {
    Alert,
    Button, CircularProgress,
    IconButton,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {axiosBase} from '../helpers/requests.js';
import React, {useContext, useEffect, useState} from 'react';
import {addIdForDataTable, isWhiteSpace, upperCaseKey} from '../helpers/utils.js';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import WithFilters from '../components/WithFilter.jsx';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {FileUpload} from '../components/FileUpload/FileUpload.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';
import CloseIcon from '@mui/icons-material/Close.js';

export default function BatchMedia () {
  try {
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('Upload Complete');
    const [uploadError, setUploadError] = useState(false);
    const [modelDetails, setModelDetails] = useState({});
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(true);
    const [songsNotCreated, setSongsNotCreated] = useState([]);
    const {
      uploadMultipleMediaFiles
    } = useContext(SongDetailsContext);
    const {bucketList, getBuckets} = useContext(DataTableData);
    const [listedBuckets, setListedBuckets] = useState({bucket: [], folder: []});

    useEffect(() => {
      getBuckets()
        .then(res => setListedBuckets(res))
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
          size="medium"
          aria-label="close"
          color="inherit"
          onClick={handleSnackBarClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

    const uploadMediaFileAndRefresh = async (data) => {
      console.log('STM pages-BatchMedia.jsx:41', data); // todo remove dev item
    };

    const handleUploadMultipleMediaFiles = async (data) => {
      try {
          setUploadComplete(false)
          handleSnackBarOpen("Upload Started")
        setSongsNotCreated([]);
        const result = await uploadMultipleMediaFiles(data);
        if (result?.songNumberDoesNotExist) {
          setSongsNotCreated(result.songNumberDoesNotExist);
        }
        console.log('STM pages-BatchMedia.jsx:50', result); // todo remove dev item

        handleSnackBarOpen('Upload Complete');
          setUploadComplete(true)
      } catch (e) {
        setUploadError(true)
          setUploadComplete(true)
        handleSnackBarOpen('Upload Error');
      }
    }

    return (
      <>
        <div className="w-[90%] mt-4 ml-20 flex items-center justify-center">

          <FileUpload
            buttonOnly
            submit={uploadMediaFileAndRefresh}
            buckets={listedBuckets.folder}
            hideHandler={() => {
              setShowFileUpload(false);
            }}
            uploadMultipleMediaFiles={handleUploadMultipleMediaFiles}
          ></FileUpload>
        </div>
          {!uploadComplete && <CircularProgress />}
        <div className="w-[90%] mt-4 ml-20">
          {songsNotCreated.map((song, idx) => (
            <Typography key={idx} sx={{color: 'red'}} >No Catalog Entry For {song}</Typography>
          ))}
        </div>
        <Snackbar
          open={openSnackBar}
          onClose={handleSnackBarClose}
          action={action}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={`${uploadError ? 'error' : 'success'}`} onClose={handleSnackBarClose}>{snackBarMessage}</Alert>
        </Snackbar>
      </>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'QueryBuilder' Page Component</h1>
    )
  }
}
