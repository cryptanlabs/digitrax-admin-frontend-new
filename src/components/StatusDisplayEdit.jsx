import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

export default function StatusDisplayEdit({newSong, handleChange = () => {}, statusData = {}, handleSave = () => {}}) {

  try {
    return (
      <div className="w-full flex flex-col ">
        <div className="w-full flex flex-row mt-10 flex">
          <div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
            <Select
              sx={{marginTop: 1}}
              name="Status"
              value={statusData.Status}
              onChange={handleChange}
            >
              {statusOptions.map((value, index) => (
                <MenuItem key={index} value={value}>{statusOptionsText[value]}</MenuItem>
              ))}
            </Select>
          </div>
          {!newSong && ( <div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Catalog #</Typography>
            <TextField
              name="Artist"
              onChange={handleChange}
              sx={{marginTop: 1}}
              hiddenLabel
              value={statusData.SongNumber}
              variant="outlined"
            />
          </div>)}
        </div>
        {!newSong && (<div className="w-full flex flex-row mt-10 flex">
          <div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Song Title</Typography>
            <TextField
              name="Title"
              onChange={handleChange}
              sx={{marginTop: 1}}
              hiddenLabel
              value={statusData.Title}
              variant="outlined"
            />
          </div>
          <div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Artist</Typography>
            <TextField
              name="Artist"
              onChange={handleChange}
              sx={{marginTop: 1}}
              hiddenLabel
              value={statusData.Artist}
              variant="outlined"
            />
          </div>
        </div> )}
        <div className="w-full flex flex-row mt-10 flex">
          <div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Release Scheduled For</Typography>
            <DatePicker
              name="ReleaseScheduledFor"
              value={statusData.ReleaseScheduledFor}
              onChange={(val) => {
                handleChange({target: {value: val, name: 'ReleaseScheduledFor'}});
              }}
            />
          </div>
          {!newSong && (<div className="flex flex-col ml-20 w-[40%]">
            <Typography sx={{fontWeight: 'bold'}}>Status Last Updated At</Typography>
            <DatePicker
              value={statusData.StatusUpdatedAt}
              readOnly
            />
          </div>)}
        </div>
        {!newSong && (
          <div className="w-[90%] mt-5 flex items-center justify-end">
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
          </div>
        )}
      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'SongStatusDisplayEdit' Component</h1>
    )
  }
}
