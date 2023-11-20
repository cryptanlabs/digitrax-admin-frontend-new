import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {isWhiteSpace} from '../helpers/utils.js';
import ApiUsers from './ApiUsers.jsx';
import Users from './Users.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility.js';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff.js';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';

export default function ViewSongDetails () {
  const [songNumber, setSongNumber] = useState(true);
  const [disableRequestButton, setDisableRequestButton] = useState(true);
  const {
    getDetailsForSong
  } = useContext(SongDetailsContext);

  const handleChange = (e) => {
    const {value} = e.target
    setSongNumber(value)
    setDisableRequestButton(value?.length !== 5)
  }

  const handleLookup = () => {
    getDetailsForSong(songNumber)
  }


  return (
    <>
      <div className="w-full flex-row justify-start mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Catalog ID #</Typography>
          <TextField
            name="SongNumber"
            type="number"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={songNumber}
            variant="outlined"
          />

          </div>
        <div className="flex flex-col ml-20 mt-10">
          <Button
            disabled={disableRequestButton}
            variant="outlined"
            onClick={handleLookup}
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
            Get Song Details
          </Button>
        </div>
      </div>
    </>
  );
}
