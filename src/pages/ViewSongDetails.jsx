import {Button, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';

export default function ViewSongDetails () {
  const navigate = useNavigate();
  const [songNumber, setSongNumber] = useState(true);
  const [disableRequestButton, setDisableRequestButton] = useState(true);
  const [noSongFoundForCatalogNumber, setNoSongFoundForCatalogNumber] = useState(false);
    const {addToRecentSongs} = useContext(DataTableData);
  const {
    getDetailsForSong
  } = useContext(SongDetailsContext);

  const handleChange = (e) => {
    const {value} = e.target
    setSongNumber(value)
    setDisableRequestButton(value?.length !== 5)
  }

  const handleLookup = async () => {
    const rowData = await getDetailsForSong(songNumber)
    if(rowData){
      addToRecentSongs(songNumber);
      navigate(`/songdata/${songNumber}`, {state: {rowData: rowData}});
    } else {
      setNoSongFoundForCatalogNumber(true)
    }

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
          {noSongFoundForCatalogNumber && <span>{`No Song Found For Catalog #${songNumber}`}</span>}
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
