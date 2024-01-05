import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {Button} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh.js';

const UsageDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {
      getColumnNamesFor,
    } = useContext(DataTableData);
    const {
      getUsage
    } =
      useContext(SongDetailsContext);
    const [filteredResults, setFilteredResults] = useState([]);
    const [columnNames, setColumnNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getUsageDetails = async () => {
      setIsLoading(true)
      await getColumnNamesFor(8)
        .then(res => {
          console.log('STM pages-CrossDashboard.jsx:24', res); // todo remove dev item
          setColumnNames(res[0])
        })
      await getUsage()
        .then(res => {
          console.log('STM pages-CrossDashboard.jsx:31', res); // todo remove dev item
          setFilteredResults(res)
        })
      setIsLoading(false)
    }
    useEffect(() => {
      getUsageDetails()
    }, []);

    // useEffect(() => {
    //   if (currentDataSet?.length > 0) {
    //     setIsLoading(false);
    //   }
    //   setFilteredResults(crossClearDataSet);
    // }, [crossClearDataSet]);

    return (
      <div>
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl ml-10 font-medium">
            All CrossClear Reported Information
          </h1>
          <div className="flex items-center px-2 w-1/6 justify-between mr-3">
            <Button
              onClick={() => {getUsageDetails()}}
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
          </div>
        </div>
        <SimpleDataGrid
          columns={columnNames}
          rows={filteredResults}
          onRowClick={() => {}}
          loading={isLoading}/>

      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CrossDashboard' Page Component</h1>
    )
  }
};

export default UsageDashboard;
