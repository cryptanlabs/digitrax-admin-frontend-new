import { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment

} from '@mui/material';
const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log(searchValue); 
  };

  return (
      <TextField
        label="Search"
        variant="outlined"
        size='small'
        value={searchValue}
        style={{borderColor: 'white', width: "100%"}}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment style={{cursor: 'pointer'}} onClick={handleSearch} position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
  );
};

export default SearchBar;
