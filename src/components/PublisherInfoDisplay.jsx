import {Box, Button, TextField, Typography, IconButton} from '@mui/material';
import {useState} from 'react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const songPublisherHeaders = [
  // "Id",
  'PublisherAdmin',
  // "PublisherDatabaseId",
  // "SongNumber",
  'SubPublisherDetails',
  'Share',
];

const PublisherRow = ({
                        publisher = {},
                        handleChange,
                        showRemovePublisher,
                        setShowRemovePublisher,
                        removePublisher
                      }) => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          py: 1
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          name="PublisherAdmin"
          variant="outlined"
          value={publisher?.PublisherAdmin}
          onChange={handleChange}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          name="SubPublisherDetails"
          variant="outlined"
          value={publisher?.SubPublisherDetails}
          onChange={handleChange}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          name="Share"
          variant="outlined"
          value={publisher?.Share}
          onChange={handleChange}
        />
      </Box>
      {showRemovePublisher && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '7%',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography sx={{fontSize: 10}}>Delete</Typography>
            <IconButton
              onClick={async () => {
                await removePublisher(publisher);
                setShowRemovePublisher(false);
              }}
              size="small"
              sx={{
                borderColor: 'gray',
                color: 'black',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }}
            >
              <DeleteIcon fontSize="small"/>
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography sx={{fontSize: 10}}>Cancel</Typography>
            <IconButton
              onClick={() => {
                setShowRemovePublisher(false);
              }}
              size="small"
              sx={{
                borderColor: 'gray',
                color: 'black',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }}
            >
              <CloseIcon fontSize="small"/>
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const NewPublisherRow = ({songNumber, saveNewPublisher, setAddNewPublisher,}) => {
  const [publisherAdmin, setPublisherAdmin] = useState('');
  const [subPublisherDetails, setSubPublisherDetails] = useState('');
  const [share, setShare] = useState('');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          py: 1
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          variant="outlined"
          value={publisherAdmin}
          onChange={e => setPublisherAdmin(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          py: 1
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          variant="outlined"
          value={subPublisherDetails}
          onChange={e => setSubPublisherDetails(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          width: '31%',
          borderRight: '1px solid #D1D5DB',
          justifyContent: 'center',
          py: 1
        }}
      >
        <TextField
          sx={{marginTop: 1, width: '90%'}}
          size="small"
          hiddenLabel
          variant="outlined"
          value={share}
          onChange={e => setShare(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '7%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography sx={{fontSize: 10}}>Save</Typography>
          <IconButton
            onClick={() => {
              saveNewPublisher({
                SongNumber: songNumber,
                PublisherAdmin: publisherAdmin,
                SubPublisherDetails: subPublisherDetails,
                Share: share
              });
              setAddNewPublisher(false);
            }}
            size="small"
            sx={{
              borderColor: 'gray',
              color: 'black',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#F5F7F8',
              },
            }}
          >
            <SaveIcon fontSize="small"/>
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography sx={{fontSize: 10}}>Cancel</Typography>
          <IconButton
            onClick={() => {
              setAddNewPublisher(false);
            }}
            size="small"
            sx={{
              borderColor: 'gray',
              color: 'black',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#F5F7F8',
              },
            }}
          >
            <CloseIcon fontSize="small"/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

// Save new publisher is separate because it has its own upload endpoint.  And each publisher
// is its own database row
export function PublisherInfoDisplay ({
                                        setSongPublishers,
                                        songNumber,
                                        songPublishers,
                                        saveNewPublisher = () => {
                                        },
                                        removePublisher = () => {
                                        }
                                      }) {
  try {
    const [localSongPublishers, setLocalSongPublishers] = useState([]);
    const [addNewPublisher, setAddNewPublisher] = useState(false);
    const [showRemovePublisher, setShowRemovePublisher] = useState(false);

    const handleChange = (idx) => {
      const index = idx;
      return (e) => {
        const {name, value} = e.target;
        songPublishers[index][name] = value;
        if (setSongPublishers) {
          setSongPublishers(songPublishers)
        }
      };
    };


    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2
        }}
      >
        {/* row 1: title */}
        <Typography sx={{fontWeight: 'bold'}}>
          Edit Publisher Details
        </Typography>

        {/* row 2: buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setAddNewPublisher(true);
            }}
            sx={{
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Add Publisher
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setShowRemovePublisher(true);
            }}
            sx={{
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Remove Publisher
          </Button>
        </Box>

        {/* row 3: input fields */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D1D5DB',
            borderRadius: 1
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
            }}
          >
            {songPublisherHeaders.map((header, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  height: '100%',
                  width: `31%`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: '1px solid #D1D5DB',
                  borderBottom: '1px solid #D1D5DB',
                  py: 1
                }}
              >
                <Typography sx={{fontSize: 14}}>{header}</Typography>
              </Box>
            ))}
          </Box>
          <Box>
            {songPublishers?.map((publisher, index) => (
              <PublisherRow
                key={index}
                handleChange={handleChange(index)}
                showRemovePublisher={showRemovePublisher}
                setShowRemovePublisher={setShowRemovePublisher}
                removePublisher={removePublisher}
                publisher={publisher}>
              </PublisherRow>
            ))}
            {(addNewPublisher || songPublishers?.length === 0) &&
              <NewPublisherRow
                songNumber={songNumber}
                saveNewPublisher={saveNewPublisher}
                setAddNewPublisher={setAddNewPublisher}>

              </NewPublisherRow>}
          </Box>
        </Box>
      </Box>
    );
  } catch (e) {
    console.error(e);
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'PublisherInfoDisplay' Component</h1>
    );
  }
}
