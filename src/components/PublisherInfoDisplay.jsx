import {Button, TextField, Typography, IconButton } from '@mui/material';
import {useState} from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const songPublisherHeaders = [
  // "Id",
  "PublisherAdmin",
  // "PublisherDatabaseId",
  // "SongNumber",
  "SubPublisherDetails",
  "Share",
];


// Save new publisher is separate because it has its own upload endpoint.  And each publisher
// is its own database row
export function PublisherInfoDisplay({setSongPublishers, songNumber, songPublishers, saveNewPublisher  = () => {}, removePublisher = () => {}}) {
  const [localSongPublishers, setLocalSongPublishers] = useState([]);
  const [addNewPublisher, setAddNewPublisher] = useState(false);
  const [showRemovePublisher, setShowRemovePublisher] = useState(false);

  const handleChange = (idx) => {
    const index = idx
    return (e) => {
      const {name, value} = e.target;
      // setLocalSongPublishers((prev) => {
      //   prev[index].name = value
      //   return prev
      // });
      if(setSongPublishers){
        setSongPublishers((prev) => {
          prev[index].name = value
          return prev
        });
      }
    }
  };

  const NewPublisherRow = () => {
    const [publisherAdmin, setPublisherAdmin] = useState('')
    const [subPublisherDetails, setSubPublisherDetails] = useState('')
    const [share, setShare] = useState('')

    return (
      <div className="w-full border-b flex border-gray-300 h-20">
        <div className="w-[33%] h-full flex items-center justify-center ">
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={publisherAdmin}
            onChange={e => setPublisherAdmin(e.target.value)}
          ></TextField>
        </div>
        <div className="w-[33%] h-full flex items-center justify-center">
          {" "}
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={subPublisherDetails}
            onChange={e => setSubPublisherDetails(e.target.value)}
          ></TextField>
        </div>
        <div className="w-[33%] h-full flex items-center justify-center">
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={share}
            onChange={e => setShare(e.target.value)}
          ></TextField>
        </div>
        <IconButton
          onClick={() => {
            console.log('STM components-PublisherInfoDisplay.jsx:79', {
              SongNumber: songNumber,
              PublisherAdmin: publisherAdmin,
              SubPublisherDetails: subPublisherDetails,
              Share: share
            }); // todo remove dev item
            saveNewPublisher({
              SongNumber: songNumber,
              PublisherAdmin: publisherAdmin,
              SubPublisherDetails: subPublisherDetails,
              Share: share
            })
            setAddNewPublisher(false)
          }}
          size="small"
          sx={{
            borderColor: "gray",
            color: "black",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#F5F7F8",
            },
          }}
        >
          <SaveIcon fontSize="small"/>
        </IconButton>
        <IconButton
          onClick={() => {
            setAddNewPublisher(false)
          }}
          size="small"
          sx={{
            borderColor: "gray",
            color: "black",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#F5F7F8",
            },
          }}
        >
          <CloseIcon fontSize="small"/>
        </IconButton>
      </div>
    )
  }
  const PublisherRow = ({publisher = {}, index}) => {

    return (
      <div className="w-full border-b flex border-gray-300 h-20">
        <div className="w-[33%] h-full flex items-center justify-center ">
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={publisher?.PublisherAdmin}
            onchange={handleChange(index)}
          ></TextField>
        </div>
        <div className="w-[33%] h-full flex items-center justify-center">
          {" "}
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={publisher?.SubPublisherDetails}
            onchange={handleChange(index)}
          ></TextField>
        </div>
        <div className="w-[33%] h-full flex items-center justify-center">
          <TextField
            sx={{ marginTop: 1, width: "90%" }}
            size="small"
            hiddenLabel
            variant="outlined"
            value={publisher?.Share}
            onchange={handleChange(index)}
          ></TextField>
        </div>
        {showRemovePublisher && (<>
          <IconButton
            onClick={async () => {
              await removePublisher(publisher)
              setShowRemovePublisher(false)
            }}
            size="small"
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            <DeleteIcon fontSize="small"/>
          </IconButton>
          <IconButton
            onClick={() => {
              setShowRemovePublisher(false)
            }}
            size="small"
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            <CloseIcon fontSize="small"/>
          </IconButton>
        </>)}

      </div>
    )
  }



  return (
    <>
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Edit Publisher Details
          </Typography>
        </div>
      </div>
      <div className="w-[90%] flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={() => {setAddNewPublisher(true)}}
          sx={{
            marginRight: "15px",
            borderColor: "#00b00e",
            backgroundColor: "#00b00e",
            color: "white",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#86A789",
            },
          }}
        >
          Add Publisher
        </Button>
        <Button
          variant="outlined"
          onClick={() => {setShowRemovePublisher(true)}}
          sx={{
            marginRight: "15px",
            borderColor: "#00b00e",
            backgroundColor: "#00b00e",
            color: "white",
            "&:hover": {
              borderColor: "#F1EFEF",
              backgroundColor: "#86A789",
            },
          }}
        >
          Remove Publisher
        </Button>
      </div>
      <div className="w-[90%] mt-10 flex flex-col border-2 border-black rounded-lg border-gray-300">
        <div className="w-full h-10 border-b flex border-gray-300">
          {songPublisherHeaders.map((header, index) => (
            <div
              key={index}
              index={index}
              className="w-[33%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
            >
              <Typography sx={{ fontSize: 14 }}>{header}</Typography>
            </div>
          ))}
        </div>
        {songPublishers?.map((publisher, index) => (
          <PublisherRow
            key={index}
            publisher={publisher}>
          </PublisherRow>
        ))}
        {(addNewPublisher || songPublishers?.length === 0) && <NewPublisherRow></NewPublisherRow>}
      </div>
    </>
  )
}
