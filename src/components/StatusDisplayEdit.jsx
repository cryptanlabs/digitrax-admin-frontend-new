import {Box, Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

export default function StatusDisplayEdit({newSong, handleChange = () => {}, statusData = {}, handleSave = () => {}}) {

  console.log('STM components-StatusDisplayEdit.jsx:7', statusOptionsText[statusData.Status]); // todo remove dev item
  try {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '40%'
            }}
          >
            <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
            <Typography sx={{fontWeight: 'bold'}}>{statusData.Status}</Typography>
            <Select
              sx={{marginTop: 1}}
              name="Status"
              value={statusData.Status || 'Status1'}
              onChange={(e) => {handleChange(e)}}
            >
              {statusOptions.map((value, index) => (
                <MenuItem key={index} value={value}>{statusOptionsText[value]}</MenuItem>
              ))}
            </Select>
            {!newSong && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '40%'
                }}
              >
                <Typography sx={{fontWeight: 'bold'}}>Status Last Updated At</Typography>
                <DatePicker
                  sx={{marginTop: 1}}
                  value={statusData.StatusUpdatedAt}
                  readOnly
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
            }}
          >
            <Typography sx={{fontWeight: 'bold'}}>Comment On Status Change</Typography>
            <TextField
              sx={{marginTop: 1}}
              hiddenLabel
              multiline
              rows={2}
              name="StatusComment"
              value={statusData.StatusComment}
              onChange={handleChange}
              variant="outlined"
            />
            {/*<Box*/}
            {/*  sx={{*/}
            {/*    display: 'flex',*/}
            {/*    width: '100%',*/}
            {/*    justifyContent: 'flex-end'*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Button*/}
            {/*    variant="outlined"*/}
            {/*    onClick={() => {*/}
            {/*      handleCreateComment(newComment);*/}
            {/*      setNewComment('');*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*      borderColor: '#00b00e',*/}
            {/*      backgroundColor: '#00b00e',*/}
            {/*      color: 'white',*/}
            {/*      '&:hover': {*/}
            {/*        borderColor: '#F1EFEF',*/}
            {/*        backgroundColor: '#86A789',*/}
            {/*      },*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Save Comment*/}
            {/*  </Button>*/}
            {/*</Box>*/}
          </Box>
        </Box>
        {!newSong && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleSave();
              }}
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
              Save Changes
            </Button>
          </Box>
        )}
      </Box>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'SongStatusDisplayEdit' Component</h1>
    )
  }
}
