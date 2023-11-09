import {createContext, useContext, useEffect, useState} from 'react';
import {axiosBase, base_url} from '../helpers/requests.js';
import axios from 'axios';
import {DataTableData} from './DataTableContext.jsx';
import {UserContext} from './UserContext.jsx';

export const SongDetailsContext = createContext(undefined);


const SongDetailsProvider = ({children}) => {
  const [generatedSets, setGeneratedSets] = useState([]);
  const {getData} = useContext(DataTableData);
  const {user} = useContext(UserContext);

  useEffect(() => {
    axiosBase({
      method: 'get',
      url: '/getExistingBuckets',
    })
      .then(response => {
        const buckets = response.data?.map(item => item.bucket);
        setGeneratedSets(buckets);
      });
  }, []);


  const updateSong = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:23', data); // todo remove dev item
    const result = await axiosBase({
      method: 'put',
      url: '/updateSong',
      data: data
    })
      .catch(error => {
        console.log(error?.response?.data?.message);
      });
    getData();
    return result.data;
  };


  const createComment = async (data) => {
    data.UserId = user.UserId
    data.UserName = user.UserName
    const result = await axiosBase({
      method: 'post',
      url: '/createComment',
      data: data
    })
      .catch(error => {
        console.log(error);
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
        console.log(error);
      });

    return result.data;
  };

  const markCommentRemoved = async (CommentId) => {
    const result = await axiosBase({
      method: 'delete',
      url: '/removeComment',
      params: {
        CommentId
      }
    })
      .catch(error => {
        console.log(error);
      });

    return result.data;
  };

  const uploadMediaFile = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/upload',
      data: data
    })
      .catch(error => {
        console.log(error);
      });

    return result.data;
  };

  const addSong = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/addSong',
      data: data
    })
      .catch(error => {
        console.log(error);
      });

    return result.data;
  };

  const addPublisher = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/addPublisher',
      data: data
    })
      .catch(error => {
        console.log(error);
      });

    return result.data;
  };

  const removePublisher = async (data) => {
    const result = await axiosBase({
      method: 'post',
      url: '/removePublisher',
      data: data
    })
      .catch(error => {
        console.log(error);
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
        console.log(error);
      });

    return result.data.result;
  };

  // getCrossClearForSong
  // removePublisher

  // addPublisher

  const getDetailsForSong = async (SongNumber) => {
    console.log('STM context-SongDetailsContext.jsx:82', SongNumber); // todo remove dev item
    const result = await axios.get(`${base_url}/catalogInternal?SongNumber=${SongNumber}`);
    return result.data.data[0];
  };

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
      markCommentRemoved
    }}>
      {children}
    </SongDetailsContext.Provider>
  );

};


export default SongDetailsProvider;
