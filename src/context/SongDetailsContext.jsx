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
  const {setBackgroundStatus, getData, generatedSets = [], genres = [], getGenres, bucketList = {bucket: [], folder: []}, getBuckets} = useContext(DataTableData);
  const {user, adminDashToken} = useContext(UserContext);


  const handleNotifyOfError = (error) => {
    let message = 'A request or server error occurred'
    if(error?.response){
      if(error?.response?.data){
        message = error?.response?.data
      }
      if(error?.response?.data?.message){
        message = error?.response?.data?.message
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

  const excludedFromAccessControl = (active, ids = []) =>{
    if(active){
      console.log('STM context-SongDetailsContext.jsx:50', user); // todo remove dev item
      return ids.includes(user.UserId)
    }
    return false
  }

  const updateSong = async (data) => {
    // if(excludedFromAccessControl(true, ["c7663412-7233-45b4-9665-b61f3080354c"])){
    //   handleNotifyOfError({message:`Update Not Allowed For User: ${user.Name}`})
    //   return data
    // }
    setBackgroundStatus(true)
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

  const deleteSong = async (data) => {
    // if(excludedFromAccessControl(true, ["c7663412-7233-45b4-9665-b61f3080354c"])){
    //   handleNotifyOfError({message:`Deletion Not Allowed For User ${user.Name}`})
    //   return
    // }
    // if(!["5ca700cb-405c-49fc-9f6c-aab023d363b2", "354d5e33-c1e9-4188-a88b-64a749d7aed2"].includes(user.UserId)){
    //   handleNotifyOfError({message:"Deletion Not Allowed For User"})
    //   return
    // }
    setBackgroundStatus(true)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'delete',
      url: '/removeSongEntry',
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
    setBackgroundStatus(true)
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
    const result = await axiosBaseWithKey(adminDashToken)({
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
    // if(excludedFromAccessControl(false, ["c7663412-7233-45b4-9665-b61f3080354c"])){
    //   handleNotifyOfError({message:`Upload Not Allowed For User: ${user.Name}`})
    //   return
    // }
    setBackgroundStatus(true)
    const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/100)
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
    setBackgroundStatus(false)
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const uploadMultipleMediaFiles = async (data) => {
    setBackgroundStatus(true)
    console.log('STM context-SongDetailsContext.jsx:132', data); // todo remove dev item
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/uploadBatch',
      timeout: 60000,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    // getData();
    // getExistingBuckets()
    setBackgroundStatus(false)
    return result.data;
  };

  const copyMediaFilesToBucket = async (data) => {
    setBackgroundStatus(true)
    console.log('STM context-SongDetailsContext.jsx:132', data); // todo remove dev item
    // const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/copyToBucket',
      timeout: 20000,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    setBackgroundStatus(false)
    // getData();
    // getExistingBuckets()
    return result.data;
  };

  const createBucket = async (data) => {
    setBackgroundStatus(true)
    console.log('STM context-SongDetailsContext.jsx:132', data); // todo remove dev item
    // const timeToUpload = Math.ceil(data.get(data.get('bucketName')).size/200)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/createBucket',
      timeout: 20000,
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    setBackgroundStatus(false)
    // getData();
    // getExistingBuckets()
    return result.data;
  };
  //

  const uploadThumbnail = async (data) => {
    setBackgroundStatus(true)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/uploadThumbnail',
      timeout: 30000,
      data: data
    })
        .catch(error => {
          console.error(error);
          handleNotifyOfError(error)
        });
    // getData();
    // getExistingBuckets()
    setBackgroundStatus(false)
    return result.data;
  };

  const addSong = async (data) => {
    setBackgroundStatus(true)
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/addSong',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    setBackgroundStatus(false)
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

  const addGenre = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:236', data); // todo remove dev item
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/addGenre',
      data: data
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
console.log('STM context-SongDetailsContext.jsx:246', result.data); // todo remove dev item
    await getGenres()
    return result.data;
  };
  // addStatusChange

  const addStatusChange = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:252', data); // todo remove dev item

    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'post',
      url: '/addStatusChange',
      data: {...data, StatusUpdatedBy: user.UserName}
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    console.log('STM context-SongDetailsContext.jsx:262', result.data); // todo remove dev item
    return result.data;
  };

  const getCrossClearForSong = async (SongNumber) => {
    setBackgroundStatus(true)
    const result = await axiosBaseWithKey(adminDashToken)({
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
    setBackgroundStatus(false)
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

  const getUsage = async () => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      timeout: 30000,
      url: '/getUsage'
    })
      .catch(error => {
        console.error(error);
        handleNotifyOfError(error)
      });
    console.log('STM context-SongDetailsContext.jsx:320', result); // todo remove dev item
    return result.data;
  }

  const getDetailsForSong = async (SongNumber) => {
    try {
      setBackgroundStatus(true)
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        url: `/catalogInternal?SongNumber=${SongNumber}`,
      })
      setBackgroundStatus(false)
      return result.data.data[0];
    } catch (error) {
      setBackgroundStatus(false)
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
      getBuckets,
      bucketList,
      addPublisher,
      addSong,
      deleteSong,
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
      copyMediaFilesToBucket,
      createBucket,
      addGenre,
      addStatusChange,
      getUsage,
      getGenres,
      genres
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
