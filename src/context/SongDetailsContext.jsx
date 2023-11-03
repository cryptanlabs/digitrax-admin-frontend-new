import {createContext, useContext, useEffect, useState} from 'react';
import {axiosBase} from '../helpers/requests.js'
import axios from 'axios';
import {DataTableData} from './DataTableContext.jsx';
export const SongDetailsContext = createContext(undefined);


const SongDetailsProvider = ({children}) => {
  const [generatedSets, setGeneratedSets] = useState([]);
  const { getData } = useContext(DataTableData);

  useEffect(() => {
    axiosBase({
      method: 'get',
      url: '/getExistingBuckets',
    })
      .then(response => {
        const buckets = response.data?.map(item => item.bucket)
        setGeneratedSets(buckets)
      })
  }, []);


  const updateSong = async (data) => {
    console.log('STM context-SongDetailsContext.jsx:23', data); // todo remove dev item
    const result = await axiosBase({
      method: 'put',
      url: '/updateSong',
      data: data
    })
      .catch(error => {
        console.log(error?.response?.data?.message)
      })
    getData()
    return result.data
  }


  const createComment = async (data) => {
    data.UserId = '051c927a-d980-40fa-aeca-2d599b466aa2'
    const result = await axiosBase({
      method: 'post',
      url: '/createComment',
      data: data
    })
      .catch(error => {
        console.log(error)
      })

    return result.data
  }

  const getCommentsForSong = async (SongNumber) => {
    const result = await axiosBase({
      method: 'get',
      url: '/getCommentsForSongNumber',
      params: {
        SongNumber
      }
    })
      .catch(error => {
        console.log(error)
      })

    return result.data
  }

  const uploadMediaFile = async (data, force) => {
    const result = await axiosBase({
      method: 'post',
      url: '/upload',
      data: data
    })
      .catch(error => {
        console.log(error)
      })

    return result.data
  }

  return (
    <SongDetailsContext.Provider value={{generatedSets, uploadMediaFile, updateSong, createComment, getCommentsForSong}}>
      {children}
    </SongDetailsContext.Provider>
  )

}


export default SongDetailsProvider
