import {useEffect, useRef, useState} from 'react';
import {FileAdd} from './fileAdd.jsx';


export default function DisplayMediaListing ({
                                               newSong,
                                               songNumber,
                                               generatedSets = [],
                                               generatedMedia = [],
                                               updateGeneratedMediaMetadata = () => {
                                               },
                                               submit = () => {
                                               },
                                               handleRequestDeleteMediaEntry = () => {
                                               },
                                               setIsLoading = () => {}

                                             }) {
  try {
    const [generatedGroups, setGeneratedGroups] = useState({});
    const [generatedCount, setGeneratedCount] = useState(0);
    const [willRegenerate, setWillRegenerate] = useState(false);

    const regenerateMediaMap = (generatedMedia) => {
      // setIsLoading(true)
      const bucketGroups = generatedSets.reduce((acc, cur) => {
        acc[cur] = [];
        return acc;
      }, {});

      const generatedGroupsLocal = generatedMedia.reduce((acc, cur) => {
        if (bucketGroups[cur?.bucket]) {
          bucketGroups[cur?.bucket].push(cur);
          setGeneratedCount(1 + generatedCount);
        }
        return bucketGroups;
      }, bucketGroups);
      setGeneratedGroups(generatedGroupsLocal);
      // console.log('STM components-DisplayMediaListing.jsx:41',  Object.keys(generatedGroupsLocal).length, generatedMedia?.length , generatedCount); // todo remove dev item
      console.log('STM components-DisplayMediaListing.jsx:43',  Object.keys(generatedGroups).length, generatedMedia?.length , generatedCount); // todo remove dev item
      if(Object.keys(generatedGroupsLocal).length !== 0 && generatedMedia?.length !== 0 && generatedCount === 0){
        // if(!willRegenerate){
        //   setWillRegenerate(true)
        //   console.log('STM components-DisplayMediaListing.jsx:43', generatedSets); // todo remove dev item
          console.log('STM components-DisplayMediaListing.jsx:43',  Object.keys(generatedGroupsLocal).length, generatedMedia?.length , generatedCount); // todo remove dev item
        //   setTimeout(() => {
        //     console.log('STM components-DisplayMediaListing.jsx:46', "REGENERATIONG----------------------"); // todo remove dev item
        //     regenerateMediaMap(generatedMedia)
        //
        //   }, 30000)
        // }
        //
        // setIsLoading(true)
      } else {
        // setIsLoading(false)
      }

      if(Object.keys(generatedGroupsLocal).length === 0){
        console.log('STM components-DisplayMediaListing.jsx:59', Object.keys(generatedGroupsLocal).length); // todo remove dev item
        // setIsLoading(true)
      }

    };

    if (!newSong) {
      useEffect(() => {
        regenerateMediaMap(generatedMedia);
      }, [generatedMedia]);

      useEffect(() => {
        console.log('STM components-DisplayMediaListing.jsx:69', Object.keys(generatedGroups).length); // todo remove dev item
        if(Object.keys(generatedGroups).length === 0 && generatedMedia?.length !== 0){
          setIsLoading(true)
        } else {
          setIsLoading(false)
        }

        setTimeout(() => {
          setIsLoading(false)
        }, 20000)
      }, [generatedGroups, generatedMedia]);
    } else {
      useEffect(() => {
        regenerateMediaMap(generatedMedia);
      }, []);
    }


    return (
      <div className="w-full mt-10 ">
        {generatedSets.map((generatedSet, index) => (
          <>
            <FileAdd
              newSong
              key={`${generatedSet}-${index}`}
              handleMetadataChange={updateGeneratedMediaMetadata}
              songNumber={songNumber}
              submit={submit}
              preSetBucketTo={generatedSet}
              header={generatedSet}
              mediaObjects={generatedGroups[generatedSet]}
              handleRequestDeleteMediaEntry={handleRequestDeleteMediaEntry}
            />
          </>
        ))}
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'DisplayMediaListing' Component</h1>
    );
  }
}
