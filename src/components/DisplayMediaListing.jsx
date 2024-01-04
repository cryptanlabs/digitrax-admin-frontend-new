import {useEffect, useRef, useState, useMemo } from 'react';
import {FileAdd} from './fileAdd.jsx';


export default function DisplayMediaListing ({
                                               newSong,
                                               songNumber,
                                               generatedSets = [],
                                               generatedMedia = [],
                                               generatedGroupsExternal = {},
                                               bucketTypeMapExternal = {},
                                               displayBucketsExternal = [],
                                               updateGeneratedMediaMetadata = () => {
                                               },
                                               submit = () => {
                                               },
                                               handleRequestDeleteMediaEntry = () => {
                                               },
                                               setIsLoading = () => {},
                                               isLoading = true
                                             }) {
  try {
    const [generatedGroups, setGeneratedGroups] = useState({});
    const [displayBuckets, setDisplayBuckets] = useState([]);
    const [generatedCount, setGeneratedCount] = useState(0);
    const [bucketTypeMap, setBucketTypeMap] = useState({});
    const [willRegenerate, setWillRegenerate] = useState(false);

    const regenerateMediaMap = (generatedMedia, generatedSets) => {
// console.log('STM components-DisplayMediaListing.jsx:28', generatedMedia); // todo remove dev item
//       const assignedBuckets = generatedMedia.reduce((acc, cur) => {
//         acc.buckets[cur['bucket']] = [];
//         acc.bucketType[cur['bucket']] = cur['isFolderBucket'];
//         return acc;
//       }, {buckets: {}, bucketType: {}});
//
//       console.log('STM components-DisplayMediaListing.jsx:35', assignedBuckets); // todo remove dev item
//       setBucketTypeMap(assignedBuckets.bucketType)
//       console.log('STM components-DisplayMediaListing.jsx:36', assignedBuckets.bucketType); // todo remove dev item
//       const localDisplayBuckets = [...generatedSets, ...Object.keys(assignedBuckets.buckets)]
//
//       setDisplayBuckets(localDisplayBuckets)
//
//       const bucketGroups = localDisplayBuckets.reduce((acc, cur) => {
//         acc[cur] = [];
//         return acc;
//       }, {});
//
//       const generatedGroupsLocal = generatedMedia.reduce((acc, cur) => {
//         if (bucketGroups[cur?.bucket]) {
//           bucketGroups[cur?.bucket].push(cur);
//           setGeneratedCount(1 + generatedCount);
//         }
//         return bucketGroups;
//       }, bucketGroups);
//       console.log('STM components-DisplayMediaListing.jsx:53', generatedGroupsLocal); // todo remove dev item
//       setGeneratedGroups(generatedGroupsLocal);
    };


    if (!newSong) {
      // useEffect(() => {
      //   regenerateMediaMap(generatedMedia, generatedSets);
      // }, []);
      useEffect(() => {
        // setDisplayBuckets(displayBucketsExternal);
        setGeneratedGroups(generatedGroupsExternal);
        console.log('STM components-DisplayMediaListing.jsx:64', generatedGroupsExternal); // todo remove dev item
        console.log('STM components-DisplayMediaListing.jsx:72', displayBucketsExternal); // todo remove dev item
      }, [generatedGroupsExternal]);

      useEffect(() => {
        setDisplayBuckets(displayBucketsExternal);

        console.log('STM components-DisplayMediaListing.jsx:72', displayBucketsExternal); // todo remove dev item
      }, [displayBucketsExternal]);

      useEffect(() => {
        setBucketTypeMap(bucketTypeMapExternal)
        console.log('STM components-DisplayMediaListing.jsx:72', displayBucketsExternal); // todo remove dev item
      }, [bucketTypeMapExternal]);
    } else {
      useEffect(() => {
        regenerateMediaMap(generatedMedia, generatedSets);
      }, []);

    }


    return (
      <div className="w-full mt-10 ">
        {displayBuckets.map((generatedSet, index) => (
          <>
            <FileAdd
              newSong
              key={`${generatedSet}-${index}`}
              handleMetadataChange={updateGeneratedMediaMetadata}
              songNumber={songNumber}
              submit={submit}
              preSetBucketTo={generatedSet}
              isFolderBucket={bucketTypeMap[generatedSet]}
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
