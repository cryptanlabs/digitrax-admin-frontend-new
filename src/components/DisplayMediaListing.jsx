import {FileUpload} from './fileUpload.jsx';
import {Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload.js';
import {useEffect, useRef, useState} from 'react';
import {FileAdd} from './fileAdd.jsx';


export default function DisplayMediaListing({newSong, SongNumber, generatedSets = [], generatedMedia = [], updateGeneratedMediaMetadata = () => {}, uploadMediaFileAndRefresh = () => {}}){
  try {
    const [generatedGroups, setGeneratedGroups] = useState({});
    const [generatedCount, setGeneratedCount] = useState(0);

    const regenerateMediaMap = (generatedMedia) => {
      const bucketGroups = generatedSets.reduce((acc, cur) => {
        acc[cur] = [];
        return acc;
      }, {});

      const generatedGroupsLocal = generatedMedia.reduce((acc, cur) => {
        if (bucketGroups[cur?.bucket]) {
          bucketGroups[cur?.bucket].push(cur);
          setGeneratedCount(1 + generatedCount)
        }
        return bucketGroups;
      }, bucketGroups);
      setGeneratedGroups(generatedGroupsLocal);
    }

    if(!newSong){
      useEffect(() => {
        console.log('STM components-DisplayMediaListing.jsx:30', generatedMedia); // todo remove dev item
        regenerateMediaMap(generatedMedia)
      }, [generatedMedia]);
    } else {
      useEffect(() => {
        console.log('STM components-DisplayMediaListing.jsx:30', generatedMedia); // todo remove dev item
        regenerateMediaMap(generatedMedia)
      }, []);
    }


    return (
      <div className="w-full mt-10 ">
        {generatedSets.map((generatedSet, index) => (
          <>
            <FileAdd
              newSong
              key={index}
              handleMetadataChange={updateGeneratedMediaMetadata}
              songNumber={SongNumber}
              submit={uploadMediaFileAndRefresh}
              preSetBucketTo={generatedSet}
              header={generatedSet}
              mediaObjects={generatedGroups[generatedSet]}
            />
          </>
        ))}
      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'DisplayMediaListing' Component</h1>
    )
  }
}
