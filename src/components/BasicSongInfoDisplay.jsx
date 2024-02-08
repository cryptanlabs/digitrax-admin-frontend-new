import {Box, Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha.js';
import {useEffect, useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {SimpleDialog} from './SimpleDialog.jsx';

export function BasicSongInfoDisplay({newSong, handleChange, basicInformation, genres, nextCatNumberToSuggest, handleDialogOpen = () => {}, handleDialogClose = () => {}}) {

  const [showNextSuggestion, setShowNextSuggestion] = useState(true);
    const [primaryGenresWithExisting, setPrimaryGenresWithExisting] = useState([]);
    const [subgenresWithExisting, setSubgenresWithExisting] = useState([]);

  const SetNextCat = () => {
    handleChange({target: {name: 'SongNumber', value: nextCatNumberToSuggest?.toString()?.padStart(5, '0')}})
    setShowNextSuggestion(false)
  }

    useEffect(() => {
console.log('STM components-BasicSongInfoDisplay.jsx:27', genres); // todo remove dev item
        if(basicInformation.Genre !== ''){
          const tempSet = new Set([basicInformation.Genre, ...genres.filter(item => item.Type === 'Primary').map(item => item.Genre)])
            setPrimaryGenresWithExisting(Array.from(tempSet))
        } else {
            setPrimaryGenresWithExisting([...genres.filter(item => item.Type === 'Primary').map(item => item.Genre)])
        }

        if(basicInformation.SubGenre !== ''){
            const tempSet = new Set([basicInformation.SubGenre, ...genres.filter(item => item.Type === 'Subgenre').map(item => item.Genre)])
            setSubgenresWithExisting(Array.from(tempSet))
        } else {
          const tempSub = [...genres.filter(item => item.Type === 'Subgenre').map(item => item.Genre)]
          console.log('STM components-BasicSongInfoDisplay.jsx:40', tempSub); // todo remove dev item
            setSubgenresWithExisting(tempSub)
        }

    }, [genres]);


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
              flexDirection: 'row',
                justifyContent: 'space-between',
              width: '50%'
            }}
          >
              <Box
                  sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '48%'
                  }}
              >
                  <Typography sx={{fontWeight: 'bold'}}>Release Scheduled For</Typography>
                  <DatePicker
                      sx={{ marginTop: 1 }}
                      name="ReleaseScheduledFor"
                      value={basicInformation.ReleaseScheduledFor?.isAfter(dayjs('1950-01-01')) ? basicInformation.ReleaseScheduledFor : undefined}
                      onChange={(val) => {
                          handleChange({target: {value: dayjs(val), name: 'ReleaseScheduledFor'}});
                      }}
                      slotProps={{
                        field: { clearable: true, onClear: () => handleChange({target: {value: undefined, name: 'ReleaseScheduledFor'}})},
                      }}
                  />
              </Box>
              <Box
                  sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '48%'
                  }}
              >
                  <Typography sx={{fontWeight: 'bold'}}>Date Added</Typography>
                  <DatePicker
                      sx={{ marginTop: 1 }}
                      name="DateAdded"
                      value={basicInformation.DateAdded || dayjs()}
                      onChange={(val) => {
                          handleChange({target: {value: dayjs(val), name: 'DateAdded'}});
                      }}
                  />
              </Box>
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
            <Typography sx={{ fontWeight: "bold" }}>In The Style Of Artist</Typography>
            <TextField
              name="InTheStyleOfArtist"
              onChange={handleChange}
              sx={{ marginTop: 1 }}
              hiddenLabel
              value={basicInformation.InTheStyleOfArtist}
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

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '90%',
                justifyContent: 'space-between',
                verticalAlign: 'middle',
                // gap: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Genre</Typography>
                {primaryGenresWithExisting?.length === 0 && <Typography sx={{ fontSize: '10px' }}>Genres Loading</Typography>}
              </Box>
              <Button
                variant="outlined"
                onClick={() => {handleDialogOpen('Primary')}}
                style={{marginBottom: '0px'}}
                sx={{
                  ml: 1,

                  height: '16px',
                  borderColor: 'gray',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }} >
                Add Genre
              </Button>
            </Box>
            <Select
              sx={{marginTop: 1, width: '100%',}}
              name="Genre"
              value={basicInformation.Genre}
              onChange={handleChange}
            >
              {primaryGenresWithExisting.map((value, index) => (
                <MenuItem key={index} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '90%',
                justifyContent: 'space-between',
                verticalAlign: 'middle',
                // gap: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>SubGenre</Typography>
                {subgenresWithExisting?.length === 0 && <Typography sx={{ fontSize: '10px' }}>SubGenres Loading</Typography>}
              </Box>
              <Button
                variant="outlined"
                onClick={() => {handleDialogOpen('Subgenre')}}
                style={{marginBottom: '0px'}}
                sx={{
                  ml: 1,

                  height: '16px',
                  borderColor: 'gray',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }} >
                Add SubGenre
              </Button>
            </Box>

              <Select
                  sx={{marginTop: 1}}
                  name="SubGenre"
                  value={basicInformation.SubGenre}
                  onChange={handleChange}
              >
                  {subgenresWithExisting.map((value, index) => (
                      <MenuItem key={index} value={value}>{value}</MenuItem>
                  ))}
              </Select>
          </Box>
        </Box>
          {/* row 4: writer(s) */}
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
                    width: '100%'
                }}
            >
                <Typography sx={{ fontWeight: "bold" }}>Writer(s)</Typography>
                <TextField
                    sx={{ marginTop: 1 }}
                    hiddenLabel
                    name="Writer"
                    value={basicInformation.Writer}
                    onChange={handleChange}
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
              value={basicInformation.SongReleaseYear > 0 ? basicInformation.SongReleaseYear : ''}
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
