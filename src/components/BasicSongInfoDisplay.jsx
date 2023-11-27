import {Box, Button, TextField, Typography} from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha.js';
import {useEffect, useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export function BasicSongInfoDisplay({newSong, handleChange, basicInformation, nextCatNumberToSuggest}) {

  const [showNextSuggestion, setShowNextSuggestion] = useState(true);
  const SetNextCat = () => {
    handleChange({target: {name: 'SongNumber', value: nextCatNumberToSuggest?.toString()?.padStart(5, '0')}})
    setShowNextSuggestion(false)
  }



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {/* Title */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 3
        }}
      >
          <Typography sx={{ fontWeight: "bold" }}>
            Basic Song Information
          </Typography>
          <Typography>Fill out available song Metadata below</Typography>
      </Box>

      {/* Input Fields */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2
        }}
      >
        {/* row 1: catalog id + release schedule */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Catalog ID #</Typography>
            <TextField
              name="SongNumber"
              type="number"
              onChange={handleChange}
              sx={{ my: 1 }}
              hiddenLabel
              value={basicInformation.SongNumber}
              variant="outlined"
            />
            <div>
              {newSong && (<div>
                {showNextSuggestion && <VisibilityIcon onClick={() => {setShowNextSuggestion(!showNextSuggestion)}}/>}
                {!showNextSuggestion && <VisibilityOffIcon onClick={() => {setShowNextSuggestion(!showNextSuggestion)}}/>}
                {showNextSuggestion && <Button
                  variant="outlined"
                  onClick={SetNextCat}
                  sx={{
                    ml: 1,
                    borderColor: 'gray',
                    color: 'black',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }} >
                  {`Suggested next Cat.#: ${nextCatNumberToSuggest}`}
                </Button>}
              </div>)}
            </div>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{fontWeight: 'bold'}}>Release Scheduled For</Typography>
            <DatePicker
              sx={{ marginTop: 1 }}
              name="ReleaseScheduledFor"
              value={basicInformation.ReleaseScheduledFor}
              onChange={(val) => {
                handleChange({target: {value: dayjs(val), name: 'ReleaseScheduledFor'}});
              }}
            />
          </Box>
        </Box>

        {/* row 2: song title + artist */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Song Title</Typography>
            <TextField
              name="Title"
              onChange={handleChange}
              sx={{ marginTop: 1 }}
              hiddenLabel
              value={basicInformation.Title}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Artist</Typography>
            <TextField
              name="Artist"
              onChange={handleChange}
              sx={{ marginTop: 1 }}
              hiddenLabel
              value={basicInformation.Artist}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* row 3: genre + subgenre */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            gap: 2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name="Genre"
              value={basicInformation.Genre}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>SubGenre</Typography>
            <TextField
              sx={{ marginTop: 1 }}
              hiddenLabel
              name="SubGenre"
              onChange={handleChange}
              value={basicInformation.SubGenre}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* row 4: bar intro + key + duration + mixes + mix rendered + release year */}
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between'
        }}>
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
        </Box>

        {/* row 5: song description */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
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
        </Box>
      </Box>
    </Box>
  )
}
