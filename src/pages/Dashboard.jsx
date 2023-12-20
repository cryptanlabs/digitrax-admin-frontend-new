import {Button, MenuItem, Select, Typography} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchBar from "../components/Searchbar";
import { useState, useContext, useEffect } from "react";
import { DataTableData } from "../context/DataTableContext";
import { useNavigate } from "react-router-dom";
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';

const statusFilterOptions = [...statusOptions, 'none']
const statusFilterOptionsText = {...statusOptionsText, none: 'Clear'}

const Dashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {currentDataSet, columnDetails, addToRecentSongs, getData, allSelected, setAllSelected, setupData} = useContext(DataTableData);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusToFilter, setStatusToFilter] = useState('');

    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
      if (currentDataSet?.length > 0) setIsLoading(false);
      setFilteredResults(currentDataSet);
    }, [currentDataSet]);

    const columns = columnDetails;

    useEffect(() => {
      console.log('Columns', columns);
      getData()
    }, []);

    const handleRowClick = (params) => {
      const rowData = params.row;
      addToRecentSongs(params.row.SongNumber);
      navigate(`/songdata/${params.row.SongNumber}`, {state: {rowData}});
    };

    const handleFilterByStatus = (e) => {
      const {value} = e.target
      if(value === 'none'){
        setStatusToFilter('')
        setFilteredResults(currentDataSet);
        return
      }
      setStatusToFilter(value)
      const sortedArray = [...currentDataSet].filter((rowEntry) => {
        return rowEntry.Status === value
      })
      setFilteredResults(sortedArray);
    };

    const AddSelected = () => {
      const newlySelected = rowSelectionModel.reduce((acc, id) => {
        // if (selectedIds.includes(id)) {
        //   return acc;
        // }
        // setSelectedIds((prev) => ([
        //   ...prev,
        //   id
        // ]));
        const result = filteredResults.find(item => item.id === id);
        if (result) {
          acc.push(result);
        }
        return acc;
      }, []);

      setAllSelected((prev) => ([
        // ...prev,
        ...newlySelected
      ]));
    };

    useEffect(() => {
      AddSelected();
      console.log('STM pages-Dashboard.jsx:81', allSelected); // todo remove dev item
    }, [rowSelectionModel]);

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
          </div>
        </div>
        <div className="w-full h-20 mt-5 flex items-center justify-between ">
          <h1 className="text-xl ml-8 font-medium">Catalog</h1>
          <div className="w-1/5 mr-8 flex items-center justify-center">
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
              {statusFilterOptions.map((value, index) => (
                <MenuItem key={index} value={value}>{statusFilterOptionsText[value]}</MenuItem>
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
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={setRowSelectionModel}
            checkboxSelection
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
