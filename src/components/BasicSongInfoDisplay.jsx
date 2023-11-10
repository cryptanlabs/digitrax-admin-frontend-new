import {Button, TextField, Typography} from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha.js';
import {useEffect, useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export function BasicSongInfoDisplay({handleChange, basicInformation, nextCatNumberToSuggest}) {

  const [showNextSuggestion, setShowNextSuggestion] = useState(true);
  const SetNextCat = () => {
    handleChange({target: {name: 'SongNumber', value: nextCatNumberToSuggest?.toString()?.padStart(5, '0')}})
    setShowNextSuggestion(false)
  }



  return (
    <>
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            Basic Song Information
          </Typography>
          <Typography>Fill out available song Metadata below</Typography>
        </div>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Catalogue ID #</Typography>
          <TextField
            name="SongNumber"
            type="number"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.SongNumber}
            variant="outlined"
          />
          <div>
            {showNextSuggestion && <VisibilityIcon onClick={() => {setShowNextSuggestion(!showNextSuggestion)}}/>}
            {!showNextSuggestion && <VisibilityOffIcon onClick={() => {setShowNextSuggestion(!showNextSuggestion)}}/>}
            {showNextSuggestion && <Button
              variant="outlined"
              onClick={SetNextCat}
              sx={{
                borderColor: 'gray',
                color: 'black',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
              }} >
              {`Suggested next Cat.#: ${nextCatNumberToSuggest}`}
            </Button>}
          </div>


        </div>

      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Song Title</Typography>
          <TextField
            name="Title"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.Title}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
          <TextField
            name="Artist"
            onChange={handleChange}
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.Artist}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-full flex flex-row mt-10 flex">
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Genre"
            value={basicInformation.Genre}
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-20 w-[40%]">
          <Typography sx={{ fontWeight: "bold" }}>SubGenre</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="SubGenre"
            onChange={handleChange}
            value={basicInformation.SubGenre}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-[90%] flex flex-row mt-10 flex">
        <div className="flex flex-col  w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Bar Intro</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            name="BarIntro"
            hiddenLabel
            onChange={handleChange}
            value={basicInformation.BarIntro}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Key</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            value={basicInformation.SongKey}
            name="SongKey"
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Duration</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Duration"
            onChange={handleChange}
            value={basicInformation.Duration}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mixes</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="Mixes"
            onChange={handleChange}
            value={basicInformation.Mixes}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Mix Rendered</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            name="MixRendered"
            onChange={handleChange}
            value={basicInformation.MixRendered}
            variant="outlined"
          />
        </div>
        <div className="flex flex-col ml-10 w-[15%]">
          <Typography sx={{ fontWeight: "bold" }}>Release Year</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            type="number"
            name="SongReleaseYear"
            onChange={handleChange}
            value={basicInformation.SongReleaseYear}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col w-[90%] ml-20">
          <Typography sx={{ fontWeight: "bold" }}>Song Description</Typography>
          <TextField
            sx={{ marginTop: 1 }}
            hiddenLabel
            multiline
            rows={4}
            name="Description"
            onChange={handleChange}
            value={basicInformation.Description}
            variant="outlined"
          />
        </div>
      </div>
    </>
  )
}
