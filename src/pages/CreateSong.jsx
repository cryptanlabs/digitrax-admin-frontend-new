import { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button, Typography, TextField } from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SongDetailsContext } from "../context/SongDetailsContext";
import {FileAdd} from '../components/fileAdd.jsx';
import {BasicSongInfoDisplay} from '../components/BasicSongInfoDisplay.jsx';
import {LicensingInfoDisplay} from '../components/LicensingInfoDisplay.jsx';
import {PublisherInfoDisplay} from '../components/PublisherInfoDisplay.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';
import DisplayMediaListing from '../components/DisplayMediaListing.jsx';
import {InfoDisplayRow} from '../components/InfoDisplayRow.jsx';
import SongStatusDisplayEdit from '../components/SongStatusDisplayEdit.jsx';
import {getStatusInfoFromSongData} from '../helpers/utils.js';
import {
  basicInformationDefault,
  licensingInformationDefault,
  statusInformationDefault
} from '../helpers/constants.js';
import {CommentDisplay} from '../components/CommentDisplay.jsx';

const publishingHeaders = [
  "ISRC",
  "HFA Song Code",
  "HFA-Mechanical-A Mix",
  "HFA-Mechanical-D Mix",
  "Territories",
  "Writer",
];

const publishingHeadersMappedToColumn = {
  ISRC: "ISRCCAMixVocal",
  "HFA Song Code": "HFASongCode",
  "HFA-Mechanical-A Mix": "MechanicalRegistrationNumberA",
  "HFA-Mechanical-D Mix": "MechanicalRegistrationNumberD",
  Territories: "Territories",
  Writer: "Writer",
};

const publishingColumnMappedToHeaders = {
  'ISRCCAMixVocal': 'ISRC',
  'HFASongCode': 'HFA Song Code',
  'MechanicalRegistrationNumberA': 'HFA-Mechanical-A Mix',
  'MechanicalRegistrationNumberD': 'HFA-Mechanical-D Mix',
  'Territories': 'Territories',
  'Writer': 'Writer'
};


const defaultLicensingInformationState = {
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const defaultBasicInfoState = {
  Title: "",
  Artist: "",
  Genre: "",
  SongNumber: "",
  SubGenre: "",
  BarIntro: "",
  SongKey: "",
  Duration: "",
  Mixes: "",
  MixRendered: "",
  SongReleaseYear: "",
  Description: "",
  ISRCCAMixVocal: "",
  HFASongCode: "",
  MechanicalRegistrationNumberA: "",
  MechanicalRegistrationNumberD: "",
  Writer: "",
}

const CreateSong = () => {

  try {
    const location = useLocation();
    const {
      generatedSets,
      addSong,
      addPublisher,
      uploadMediaFile,
      getDetailsForSong,
      createComment,
      getCommentsForSong
    } =
      useContext(SongDetailsContext);
    const {addToRecentSongs, getData, nextTwentyCatalogNumbers, getSongNumbersWithoutRecords} = useContext(DataTableData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newComment, setNewComment] = useState('');

    const fileInputRef = useRef(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [generatedMedia, setGeneratedMedia] = useState([]);
    const [generatedMediaForUpload, setGeneratedMediaForUpload] = useState([]);

    const [publishersForUpload, setPublishersForUpload] = useState([]);

    const [licensingInfoDisplay, setLicensingInfoDisplay] = useState([]);
    const [licensingInformation, setLicensingInformation] = useState(licensingInformationDefault);

    const [basicInformation, setBasicInformation] = useState(basicInformationDefault);

    const [filesStagedForUpload, setFilesStagedForUpload] = useState({});
    const [comments, setComments] = useState([]);
    const [nextCatNumbersToSuggest, setNextCatNumbersToSuggest] = useState([]);
    const [nextCatSuggest, setNextCatSuggest] = useState(undefined);
    const [statusData, setStatusData] = useState(statusInformationDefault);

    useEffect(() => {
      setNextCatNumbersToSuggest(nextTwentyCatalogNumbers)
      getSongNumbersWithoutRecords()
        .then(res => {
          const nextNum = res?.shift()?.toString()?.padStart(5, '0')
          setNextCatNumbersToSuggest(res)
          setNextCatSuggest(nextNum)
        })

    }, []);

    useEffect(() => {
      return () => {
        const detailsInOrder = publishingHeaders.map((val) => {
          return {
            key: publishingHeadersMappedToColumn[val],
            value: licensingInformation[publishingHeadersMappedToColumn[val]],
          };
        });

        console.log('STM pages-SongDetails.jsx:118', detailsInOrder); // todo remove dev item
        setLicensingInfoDisplay(detailsInOrder);
      };
    }, [licensingInformation]);

    const handleChange = (e) => {
      const {name, value} = e.target;
      setBasicInformation((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleLicensingChange = (e) => {
      const {name, value} = e.target;
      console.log('STM pages-CreateSong.jsx:124', name, value); // todo remove dev item
      setLicensingInformation((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const incrementNextCatalogNumberSuggestion = () => {
      setNextCatNumbersToSuggest(prev => {
        setNextCatSuggest(prev.shift())
        return [...prev]
      })
    }

    const uploadMediaFileAndForCreateSong = async (data) => {

      setGeneratedMediaForUpload([...generatedMediaForUpload, data]);
      let bucketName = ''
      let fileName = ''
      for (const thing of data.entries()) {
        if (thing[0] === 'bucketName') {
          bucketName = thing[1]
        }
        if(typeof thing[1] === 'object'){
          fileName = thing[1]?.name
          console.log('STM pages-CreateSong.jsx:150', thing[1]?.name); // todo remove dev item
        }
        console.log('STM components-fileAdd.jsx:23', typeof thing[1]); // todo remove dev item
      }

      setFilesStagedForUpload((prev) => {
        if(prev[bucketName]){
          const tempSet = new Set(prev[bucketName])
          tempSet.add(fileName)
          prev[bucketName] = Array.from(tempSet)
        } else {
          prev[bucketName] = [fileName]
        }
        return prev
      })
      console.log('STM pages-CreateSong.jsx:163', filesStagedForUpload); // todo remove dev item
      console.log('STM pages-CreateSong.jsx:165', generatedMediaForUpload); // todo remove dev item
    };

    const savePublisher = (data) => {
      setPublishersForUpload([...publishersForUpload, data]);
    };
    // Top Section Upload Handlers

    const handleSongUpload = async () => {
      const SongNumber = basicInformation.SongNumber;

      if (!SongNumber) {
        return;
      }

      // Add basic song data
      const newSongData = {
        ...basicInformation,
        ...licensingInformation,
        Status: 'Status1'
      };
      await addSong(newSongData);

      addToRecentSongs(SongNumber);

      // Add Media
      for (let i = 0; i < generatedMediaForUpload.length; i++) {
        for (const thing of generatedMediaForUpload[i].entries()) {
        }
        try {
          await uploadMediaFile(generatedMediaForUpload[i]);
        } catch (e) {
          console.error(e);
        }
      }

      // Add Publishers
      for (let i = 0; i < publishersForUpload.length; i++) {

        try {
          publishersForUpload[i].SongNumber = SongNumber;
          await addPublisher(publishersForUpload[i]);
        } catch (e) {
          console.error(e);
        }
      }

      // Add Comments
      for (let i = 0; i < comments.length; i++) {

        try {
          await createComment(comments[i]);
        } catch (e) {
          console.error(e);
        }
      }

      setLicensingInformation(defaultLicensingInformationState);
      setBasicInformation(defaultBasicInfoState);
      setFilesStagedForUpload({})
      incrementNextCatalogNumberSuggestion()
      console.log(basicInformation);
      getData()
    };

    // const handleCommentChange = (e) => {
    //   const {value} = e.target;
    //   console.log('STM pages-CreateSong.jsx:258', value); // todo remove dev item
    //   setNewComment(value);
    // };
    const handleCreateComment = async (commentContent) => {
      const copyComment = {
        SongNumber: basicInformation.SongNumber,
        Content: commentContent,
        UserName: 'Added on Save',
      };
      setComments((prev) => [copyComment, ...prev]);
      // setNewComment('');
    };

    const handleStatusChange = (e) => {
      const {name, value} = e.target;
      setStatusData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    useEffect(() => {
      console.log(basicInformation);
    }, [basicInformation]);

    return (
      <div className="w-full mt-4 flex flex-col items-center justify-between">
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl ml-20 font-medium">Create Song Entry</h1>
          <div className="flex w-1/3  mr-3 justify-center">
            <Button
              variant="outlined"
              sx={{
                borderColor: 'gray',
                color: 'black',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }}
            >
              Upload Another Song
            </Button>

            <Button
              variant="outlined"
              startIcon={<StarBorderIcon/>}
              sx={{
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                marginLeft: '15px',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              Export
            </Button>
          </div>
        </div>
        <BasicSongInfoDisplay
          handleChange={handleChange}
          basicInformation={basicInformation}
          nextCatNumberToSuggest={nextCatSuggest}
        />
        {/* LICENSING INFORMATION VIEW/EDIT */}
        <div className="w-full mt-10 flex">
          <div className="flex flex-col ml-20">
            <Typography sx={{ fontWeight: "bold" }}>
              Publishing Information
            </Typography>
            <Typography>Update the publishing information here</Typography>
          </div>
        </div>
        <div className="w-[90%] mt-10 flex flex-row flex-wrap">
          {Object.keys(licensingInformation).map((header, index) => (
            <div key={index} className="flex flex-col ml-10 w-[20%]">
              <Typography sx={{ fontWeight: "bold" }}>{header}</Typography>
              <TextField
                size="small"
                hiddenLabel
                name={header.key}
                onChange={handleLicensingChange}
                value={licensingInformation[header.key]}
                variant="outlined"
              />
            </div>
          ))}
        </div>

        <SongStatusDisplayEdit
          newSong
          statusData={statusData}
          handleChange={handleStatusChange}
        />

        <PublisherInfoDisplay
          songNumber={basicInformation.SongNumber}
          saveNewPublisher={savePublisher}
          songPublishers={publishersForUpload}
          setSongPublishers={setPublishersForUpload}
        />

        <CommentDisplay
          comments={comments}
          handleCreateComment={handleCreateComment}
        />

        <div className="w-full mt-10 flex">
          <div className="flex flex-col ml-20">
            <Typography sx={{fontWeight: 'bold', fontSize: '30px'}}>Media</Typography>
          </div>
        </div>
        <div className="w-full flex flex-row flex-wrap grow ml-40 ">
          {Object.keys(filesStagedForUpload).map((item, index) => (
            <div className="w-64 flex-col" key={index}>
              <Typography sx={{fontWeight: 'bold'}}>{item}</Typography>
              {filesStagedForUpload[item].map((fileItem, idx) => (
                <Typography key={idx}>{fileItem}</Typography>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full ml-40 ">
          <FileAdd
            newSong
            buttonOnly
            songNumber={basicInformation.SongNumber}
            submit={uploadMediaFileAndForCreateSong}
            buckets={generatedSets}
            hideHandler={() => {
              setShowFileUpload(false);
            }}
          ></FileAdd>
          <DisplayMediaListing
            newSong
            songNumber={basicInformation.SongNumber}
            submit={uploadMediaFileAndForCreateSong}
            generatedSets={generatedSets}
          />
        </div>

        <div className="w-[90%] mt-5 flex items-center justify-end">
          <Button
            variant="outlined"
            sx={{
              marginRight: '15px',
              borderColor: '#FF6969',
              backgroundColor: '#FF6969',
              color: 'white',
              '&:hover': {
                borderColor: '#FF6969',
                backgroundColor: '#white',
                color: '#FF6969',
              },
            }}
            onClick={() => setSelectedFile(null)}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={handleSongUpload}
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
            Save
          </Button>
        </div>
      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CreateSong' Page Component</h1>
    )
  }
};

export default CreateSong;
