import React, {createContext, useContext, useEffect, useState} from 'react';
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import axios from 'axios';
import {DataTableData} from './DataTableContext.jsx';
import {UserContext} from './UserContext.jsx';
import {Alert, IconButton, Snackbar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const SongDetailsContext = createContext(undefined);


const SongDetailsProvider = ({children}) => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const {getData, generatedSets, getExistingBuckets} = useContext(DataTableData);
  const {user, adminDashToken} = useContext(UserContext);


  const handleNotifyOfError = (error) => {
    let message = 'A request or server error occurred'
    if(error?.response){
      if(error?.response?.data){
        message = error?.response?.data
      }
    } else if(error?.message) {
      message = error.message
    } else if(error?.error){
      message = error.error
    }
    console.log('STM context-SongDetailsContext.jsx:28', message); // todo remove dev item
    if(typeof message === 'string'){
      setSnackBarMessage(message)
    } else {
      setSnackBarMessage('A request or server error occurred')
    }

    setOpenSnackBar(true)
  }

  const handleSnackBarClose = () => {
    setSnackBarMessage('')
    setOpenSnackBar(false)
  }

  const updateSong = async (data) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'put',
      url: '/updateSong',
      data: data
    })
      .catch(error => {
        console.error(error?.response?.data?.message);
        handleNotifyOfError(error)
      });
    getData();
    return result.data;
  };

  const updateMediaMetadata = async (data) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'put',
      url: '/updateGeneratedMediaMetaData',
      data: data
    })
      .catch(error => {
        console.error(error?.response?.data?.message);
        handleNotifyOfError(error)
      });
    getData();
    return result.data;
  };


  const createComment = async (data) => {
    data.UserId = user.UserId
    data.UserName = user.UserName
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/createComment',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const getCommentsForSong = async (SongNumber) => {
    const result = await axiosBase({
      method: 'get',
      url: '/getCommentsForSongNumber',
      params: {
        SongNumber
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const markCommentRemoved = async (CommentId) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'delete',
      url: '/removeComment',
      params: {
        CommentId
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const uploadMediaFile = async (data) => {
    const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/upload',
      timeout: timeToUpload,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const uploadMultipleMediaFiles = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:132', data); // todo remove dev item
    // const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/uploadBatch',
      timeout: 10000,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const copyMediaFilesToBucket = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:132', data); // todo remove dev item
    // const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/copyToBucket',
      timeout: 10000,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    // getData();
    // getExistingBuckets()
    return result.data;
  };
  //

  const uploadThumbnail = async (data) => {
    const timeToUpload = Math.ceil(data.get('files').size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/uploadThumbnail',
      timeout: timeToUpload,
      data: data
    })
        .catch(error => {
          console.error(error);
          handleNotifyOfError(error)
        });
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const addSong = async (data) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/addSong',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const addPublisher = async (data) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/addPublisher',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const removePublisher = async (data) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/removePublisher',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data;
  };

  const getCrossClearForSong = async (SongNumber) => {
    const result = await axiosBase({
      method: 'get',
      url: '/getCrossClearForSong',
      params: {
        SongNumber
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });

    return result.data.result;
  };

  const removeGeneratedMediaEntry = async (requestString) => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      timeout: 30000,
      url: '/removeGeneratedMediaEntry',
      data: {
        requestString: requestString
      }
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
  }

  // getCrossClearForSong
  // removePublisher

  // addPublisher

  const getDetailsForSong = async (SongNumber) => {
    try {
      const result = await axios.get(`${base_url}/catalogInternal?SongNumber=${SongNumber}`);
      return result.data.data[0];
    } catch (error) {
      console.error(error)
      handleNotifyOfError(error)
    }
  };

  // const open

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

  return (
    <SongDetailsContext.Provider value={{
      generatedSets,
      addPublisher,
      addSong,
      removePublisher,
      getDetailsForSong,
      uploadMediaFile,
      updateSong,
      createComment,
      getCommentsForSong,
      getCrossClearForSong,
      markCommentRemoved,
      updateMediaMetadata,
      removeGeneratedMediaEntry,
      uploadThumbnail,
      uploadMultipleMediaFiles,
      handleNotifyOfError,
      copyMediaFilesToBucket
    }}>
      {children}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={12000}
        onClose={handleSnackBarClose}
        action={action}
      >
        <Alert severity="error" onClose={handleSnackBarClose}>{snackBarMessage}</Alert>
      </Snackbar>
    </SongDetailsContext.Provider>
  );

};


export default SongDetailsProvider;
