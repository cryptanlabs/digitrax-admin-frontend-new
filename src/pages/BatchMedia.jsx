import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {axiosBase} from '../helpers/requests.js';
import React, {useContext, useEffect, useState} from 'react';
import {addIdForDataTable, isWhiteSpace, upperCaseKey} from '../helpers/utils.js';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import WithFilters from '../components/WithFilter.jsx';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {FileUpload} from '../components/FileUpload/FileUpload.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';

export default function BatchMedia () {
  try {
    const [modelDetails, setModelDetails] = useState({});
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [generatedMedia, setGeneratedMedia] = useState([]);
    const {
      generatedSets,
      addPublisher,
      removePublisher,
      getCrossClearForSong,
      getDetailsForSong,
      uploadMediaFile,
      updateSong,
      createComment,
      getCommentsForSong,
      markCommentRemoved,
      updateMediaMetadata,
      removeGeneratedMediaEntry,
      uploadThumbnail,
      uploadMultipleMediaFiles
    } = useContext(SongDetailsContext);
    const {bucketList, getBuckets} = useContext(DataTableData);
    const [listedBuckets, setListedBuckets] = useState({bucket: [], folder: []});

    useEffect(() => {
      getBuckets()
        .then(res => setListedBuckets(res))
    }, []);

    const uploadMediaFileAndRefresh = async (data) => {
      await uploadMediaFile(data);
      // const songData = await getDetailsForSong(basicInformation.SongNumber);
      // setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia);
      //
    };

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
            uploadMultipleMediaFiles={uploadMultipleMediaFiles}
          ></FileUpload>
        </div>
      </>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'QueryBuilder' Page Component</h1>
    )
  }
}
