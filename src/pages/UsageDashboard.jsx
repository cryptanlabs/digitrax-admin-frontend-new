import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {Button} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh.js';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {axiosBaseWithKey} from '../helpers/requests.js';
import {addIdForDataTable} from '../helpers/utils.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import {UserContext} from '../context/UserContext.jsx';
dayjs.extend(isBetween)
const UsageDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {adminDashToken} = useContext(UserContext);
    const {
      getColumnNamesFor,
    } = useContext(DataTableData);
    const {
      getUsage
    } =
      useContext(SongDetailsContext);
    const [filteredResults, setFilteredResults] = useState([]);
    const [returnedResults, setReturnedResults] = useState([]);
    const [columnNames, setColumnNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedendDate, setSelectedEndDate] = useState(null);

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
          setReturnedResults(res)
          setFilteredResults(res)
        })
      setIsLoading(false)
    }

    const getForSelectedWeek = async () => {
      if (selectedStartDate && selectedendDate) {
        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          timeout: 10000,
          url: '/rawQuery',
          data: {
            query: {
              where: {
                ReleaseScheduledFor: {
                  lt: selectedendDate, //'2023-10-31T04:00:04.534Z',
                  gt: selectedStartDate
                }
              },
            }
          }
        })
          .catch(error => {
            console.log(error);
          });

        const data = result.data.data;
        console.log('STM pages-ExportDashboard.jsx:209', result); // todo remove dev item
        setReturnedResults(addIdForDataTable(data));

      }
    };


    useEffect(() => {
      getUsageDetails()
    }, []);


    const filterBetween = () => {
      if(selectedStartDate && selectedendDate){
        const val = returnedResults.filter(item => dayjs(item?.createdAt)?.isBetween(selectedStartDate, selectedendDate))
        console.log('STM pages-UsageDashboard.jsx:85', val); // todo remove dev item
        setFilteredResults(val)
      }

    }

    const resetFilter = () => {
      setFilteredResults([...returnedResults])
    }


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
          <div className="w-1/2 mr-8 flex items-center justify-around">
            <DatePicker
              value={selectedStartDate}
              onChange={setSelectedStartDate}
            />
            to
            <DatePicker
              value={selectedendDate}
              onChange={setSelectedEndDate}
            />
            <Button variant="outlined" onClick={() => {filterBetween()}}>Filter</Button>
            <Button variant="outlined" onClick={() => {resetFilter()}}>Reset Filter</Button>
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
