import { useState} from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';

const SearchBar = ({ currentDataSet, setFilteredResults }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    const results = currentDataSet.filter(elem => 
      elem.Title.toLowerCase().includes(searchValue.toLowerCase()) ||
      elem.Genre.toLowerCase().includes(searchValue.toLowerCase()) ||
      elem.InTheStyleOfArtist.toLowerCase().includes(searchValue.toLowerCase()) ||
      elem.SongReleaseYear.toString().includes(searchValue)
    );
    setFilteredResults(results);
  };


  return (
    <TextField
      label="Search"
      variant="outlined"
      size='small'
      value={searchValue}
      style={{ width: "100%" }}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyUp={(e) => { if (e.key === "Enter") handleSearch() }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ cursor: 'pointer' }} onClick={handleSearch}>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

SearchBar.propTypes = {
  currentDataSet: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setFilteredResults: PropTypes.func.isRequired,
};

export default SearchBar;
