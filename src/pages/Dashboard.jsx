import SearchIcon from "@mui/icons-material/Search";
import {Button, MenuItem, Select, Typography} from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from '@mui/icons-material/Refresh';
import { createSvgIcon } from '@mui/material/utils';
import LinearProgress from '@mui/material/LinearProgress';
import SearchBar from "../components/Searchbar";
import { useState, useContext, useEffect } from "react";
import {
  DataGrid,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext
} from "@mui/x-data-grid";
import { DataTableData } from "../context/DataTableContext";
import { useNavigate } from "react-router-dom";
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';

const Dashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {currentDataSet, columnDetails, addToRecentSongs, getData} = useContext(DataTableData);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortInstructions, setSortIntructions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statusToFilter, setStatusToFilter] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
      if (currentDataSet?.length > 0) setIsLoading(false);
      setFilteredResults(currentDataSet);
      if (currentDataSet?.length > 0) {
        console.log('STM pages-Dashboard.jsx:35', currentDataSet[0]); // todo remove dev item
      }
    }, [currentDataSet]);

    const columns = columnDetails;

    useEffect(() => {
      console.log('Columns', columns);
    }, []);

    const sortTitlesAlphabetically = () => {
      const sortedArray = [...currentDataSet].sort((a, b) => {
        const titleA = a.Title.toLowerCase();
        const titleB = b.Title.toLowerCase();

        if (titleA < titleB) return sortInstructions ? 1 : -1;
        if (titleA > titleB) return sortInstructions ? -1 : 1;
        return 0;
      });

      setFilteredResults(sortedArray);
      setSortIntructions((prev) => !prev);
    };

    const handleRowClick = (params) => {
      console.log('STM pages-Dashboard.jsx:62', params.row); // todo remove dev item
      const rowData = params.row;
      addToRecentSongs(params.row.SongNumber);
      navigate('/songdata', {state: {rowData}});
    };

    const handleFilterByStatus = (e) => {
      const {value} = e.target
      setStatusToFilter(value)
      console.log('STM pages-Dashboard.jsx:72', value); // todo remove dev item
      const sortedArray = [...currentDataSet].filter((rowEntry) => {
        return rowEntry.Status === value
      })
      setFilteredResults(sortedArray);
    };

    return (
      <div>
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl ml-10 font-medium">
            Catalog Management Dashboard
          </h1>
          <div className="flex items-center px-2 w-1/6 justify-between mr-3">
            <Button
                onClick={() => {getData()}}
                variant="outlined"
                startIcon={<RefreshIcon/>}
                sx={{
                  borderColor: 'gray',
                  color: 'black',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
            >
              Refresh
            </Button>
            {/*<Button*/}
            {/*  variant="outlined"*/}
            {/*  startIcon={<FileDownloadIcon/>}*/}
            {/*  sx={{*/}
            {/*    borderColor: 'gray',*/}
            {/*    color: 'black',*/}
            {/*    '&:hover': {*/}
            {/*      borderColor: '#F1EFEF',*/}
            {/*      backgroundColor: '#F5F7F8',*/}
            {/*    },*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Export*/}
            {/*</Button>*/}
          </div>
        </div>
        <div className="w-full h-20 mt-5 flex items-center justify-between ">
          <h1 className="text-xl ml-8 font-medium">Catalog</h1>
          <div className="w-1/5 mr-8 flex items-center justify-center">
            {showSearch && (
              <SearchBar
                currentDataSet={currentDataSet}
                filteredResults={filteredResults}
                setFilteredResults={setFilteredResults}
              />
            )}

          </div>
          <div className="flex flex-col w-[40%] mr-10">
            <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
            <Select
              sx={{marginTop: 1}}
              name="Status"
              value={statusToFilter}
              onChange={handleFilterByStatus}
            >
              {statusOptions.map((value, index) => (
                <MenuItem key={index} value={value}>{statusOptionsText[value]}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-10">
          <SimpleDataGrid
            columns={columns}
            rows={filteredResults}
            onRowClick={handleRowClick}
            loading={isLoading}
          />
        </div>

      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'Dashboard' Page Component</h1>
    )
  }
};

export default Dashboard;
