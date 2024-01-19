import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import JSZip from 'jszip'
import {axiosBaseWithKey, base_url} from '../helpers/requests.js';
import { saveAs } from 'file-saver';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {Button, MenuItem, Select, TextField, Typography, Checkbox} from '@mui/material';
import {addIdForDataTable} from '../helpers/utils.js';
import {UserContext} from '../context/UserContext.jsx';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {statusDash} from '../helpers/strings.js';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';


const statusFilterOptions = [...statusOptions, 'none']
const statusFilterOptionsText = {...statusOptionsText, none: 'Clear'}

const buckets = [
  '720All',
  'black',
  'green'
]
const ExportDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {adminDashToken} = useContext(UserContext);
    const {
      columnDetails,
      crossClearDataSet,
      allSelected,
      setAllSelected,
      getBuckets,
      bucketList
    } = useContext(DataTableData);

    const {
      handleNotifyOfError,
      copyMediaFilesToBucket,
      createBucket: createS3Bucket
    } = useContext(SongDetailsContext);
    const [localRowSet, setLocalRowSet] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [localSelected, setLocalSelected] = useState([]);
    const [newFolderChecked, setNewFolderChecked] = useState(false);
    const [newBucketChecked, setNewBucketChecked] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [collectedFolders, setCollectedFolders] = useState({});
    const [collectedFolderList, setCollectedFolderList] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [selectedBucket, setSelectedBucket] = useState('');
    const [buildingExport, setBuildingExport] = useState(false);
    const [newFolder, setNewFolder] = useState('');
    const [newBucket, setNewBucket] = useState('');
    const [listedBuckets, setListedBuckets] = useState({bucket: [], folder: []});
    const [selectedRowMediaDetails, setSelectedRowMediaDetails] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [releasePeriodStart, setReleasePeriodStart] = useState(false);
    const [releasePeriodEnd, setReleasePeriodEnd] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [statusToFilter, setStatusToFilter] = useState('');


    const resetFilterKey = 'RESET FILTER'
    useEffect(() => {
      if(selectedFolder === resetFilterKey){
        setFilteredResults(localRowSet)
        return
      }
      const folderFiltered = localRowSet.reduce((acc, cur) => {
        const res = cur.GeneratedMedia.find(item => item.bucket === selectedFolder)
        if(res){
          acc.push(cur)
          return acc
        }
        return acc
      }, [])
      setRowSelectionModel([])
      setFilteredResults(folderFiltered)
    }, [selectedFolder]);

    useEffect(() => {
      setLocalRowSet(allSelected)
      setFilteredResults(allSelected)
      getBucketsAndMedia()
      getBuckets()
        .then(res => setListedBuckets(res))
    }, []);

    useEffect(() => {
      AddSelected()
      console.log('STM pages-ExportDashboard.jsx:75', rowSelectionModel); // todo remove dev item
    }, [rowSelectionModel]);



    const onRowClick = (data) => {
      console.log('STM pages-ExportDashboard.jsx:72', data); // todo remove dev item
      setSelectedRowMediaDetails(data?.row?.GeneratedMedia)
    }
    const getBucketsAndMedia = () => {
      const generatedMedia = allSelected.map(item => {
        console.log('STM pages-ExportDashboard.jsx:46', item); // todo remove dev item
        return item.GeneratedMedia
      })

      const collected = generatedMedia.reduce((acc, cur) => {
        console.log('STM pages-ExportDashboard.jsx:50', cur); // todo remove dev item
        for(let item of cur){
          // if(item.isFolderBucket){}
          if(acc[item.bucket]){
            acc[item.bucket].push(item.requestString)
          } else {
            acc[item.bucket] = []
            acc[item.bucket].push(item.requestString)
          }
        }
        return acc

      }, {})

      setCollectedFolderList(() => (
        [resetFilterKey, ...Object.keys(collected)]
      ))
      setCollectedFolders(collected)
      console.log('STM pages-ExportDashboard.jsx:64', collected); // todo remove dev item
    }

    const AddSelected = () => {
      const newlySelected = rowSelectionModel.reduce((acc, id) => {
        const result = filteredResults?.find(item => item.id === id);
        console.log('STM pages-ExportDashboard.jsx:138', result); // todo remove dev item
        if (result) {
          const selectedMedia = result?.GeneratedMedia?.find(item => item.bucket === selectedFolder);
          if(selectedMedia){
            acc.push(selectedMedia);
          }

        }
        return acc;
      }, []);

      setLocalSelected(() => ([
        ...newlySelected
      ]));
    };

    const submitMediaToCopy = async () => {
      setFilteredResults(localRowSet)
      const requestStringsForCopy = localSelected.map(item => {
        return {requestString: item.requestString, fileType: item.fileType}
      })
      // todo test if this check still holds if no valid bucket entries are present
      if((selectedFolder !== '' && selectedFolder !== resetFilterKey) && selectedBucket !== '' && requestStringsForCopy?.length > 0) {

// console.log('STM pages-ExportDashboard.jsx:141', {
//   currentFolderBucketName: selectedFolder,
//   newBucketName: selectedBucket,
//   requestStringsForCopy
// }); // todo remove dev item
        await copyMediaFilesToBucket({
          currentFolderBucketName: selectedFolder,
          newBucketName: selectedBucket,
          requestStringsForCopy
        })
      }

    }

    const createBucket = async (e) => {
      await createS3Bucket({bucketName: newBucket, bucketType: 'bucket'})
      const res = await getBuckets()
      setListedBuckets(res)
      setNewBucket('')
    }

    const createFolder = async (e) => {
      await createS3Bucket({bucketName: newFolder, bucketType: 'folder'})
      const res = await getBuckets()
      setListedBuckets(res)
      setNewFolder('')
    }

    const resetSelection = () => {
      setFilteredResults(localRowSet)
      setRowSelectionModel([]);
      setSelectedDate('')
    }
    const handleGetForWeek = (value) => {
      setReleasePeriodStart(value.day(0));
      setReleasePeriodEnd(value.day(6));
      setSelectedDate(value);
    };

    const getForSelectedWeek = async () => {
      if (releasePeriodStart && releasePeriodEnd) {
        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          timeout: 10000,
          url: '/rawQuery',
          data: {
            query: {
              where: {
                ReleaseScheduledFor: {
                  lt: releasePeriodEnd, //'2023-10-31T04:00:04.534Z',
                  gt: releasePeriodStart
                }
              },
              take: 100
            }
          }
        })
          .catch(error => {
            console.log(error);
          });

        const data = result.data.data;
        console.log('STM pages-ExportDashboard.jsx:209', result); // todo remove dev item
        setFilteredResults(addIdForDataTable(data));
      }
    };

    const handleFilterByStatus = (e) => {
      const {value} = e.target
      setStatusToFilter(value)
      // if(value === 'none'){
      //   setStatusToFilter('')
      //   setFilteredResults(currentDataSet);
      //   return
      // }
      // setStatusToFilter(value)
      // const sortedArray = [...currentDataSet].filter((rowEntry) => {
      //   return rowEntry.Status === value
      // })
      // setFilteredResults(sortedArray);
    };

    return (
      <div>
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl ml-10 font-medium">
            Send Files To Buckets
          </h1>

        </div>
        <div className="w-[90%] ml-10 flex flex-row items-center justify-around ">
          {/*<div className="flex flex-row items-center justify-around">*/}
            <DatePicker
              disabled={processing}
              value={selectedDate}
              onChange={handleGetForWeek}
            />
            {/*<DatePicker*/}
            {/*  readOnly*/}
            {/*/>*/}
            <Button
              disabled={processing || !(releasePeriodStart && releasePeriodEnd)}
              variant="outlined"
              onClick={() => {
                getForSelectedWeek();
              }}
              sx={{
                marginRight: '15px',
                marginLeft: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              {statusDash.GetReleasesForWeek}
            </Button>
            <Button
              disabled={processing}
              variant="outlined"
              onClick={() => {
                resetSelection();
              }}
              sx={{
                // marginRight: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              {statusDash.ClearSelected}
            </Button>
          {/*</div>*/}

          <div className="flex flex-col w-[30%] ">
            <Typography sx={{fontWeight: 'bold'}}>Status</Typography>
            <Select
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
        <div className="w-[90%]  mb-5 ml-10 flex flex-col items-center justify-between ">
          <div className="flex flex-row w-full  items-center">
            <div className="flex flex-col w-[40%] mr-10">
              <Typography sx={{fontWeight: 'bold'}}>Folder</Typography>
              <Select
                sx={{marginTop: 1}}
                name="Status"
                value={selectedFolder}
                onChange={(e) => {setSelectedFolder(e.target.value)}}
              >
                {collectedFolderList.map((value, index) => (
                  <MenuItem key={index} value={value}>{value}</MenuItem>
                ))}
              </Select>


            </div>
            <div className="flex flex-col justify-center mr-10">
              <Typography sx={{fontWeight: 'bold'}}>to</Typography>
            </div>
            <div className="flex flex-col w-[40%] mr-10">
              <Typography sx={{fontWeight: 'bold'}}>Bucket</Typography>
              <Select
                sx={{marginTop: 1}}
                name="Status"
                value={selectedBucket}
                onChange={(e) => {setSelectedBucket(e.target.value)}}
              >
                {(listedBuckets?.bucket || []).map((value, index) => (
                  <MenuItem key={index} value={value}>{value}</MenuItem>
                ))}
              </Select>

            </div>
            <Button onClick={submitMediaToCopy}>SUBMIT</Button>
          </div>

          {/* CREATE NEW FOLDER OR BUCKET OPTION */}
          <div className="flex flex-row w-full  items-center">
            <div className="flex flex-col w-[50%]">
              <div className="flex flex-row  items-center">
                <Checkbox
                  checked={newFolderChecked}
                  onChange={(e) => {setNewFolderChecked(e.target.checked)}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography sx={{fontWeight: 'bold'}}>Create New Folder</Typography>
              </div>
              {newFolderChecked && (
                <div className="flex flex-col w-[60%] mt-3">
                  <div className="flex flex-col w-full">
                    <Typography sx={{ fontWeight: "bold" }}>New Folder</Typography>
                    <div className="flex flex-row">
                      <TextField
                        name="Title"
                        onChange={(e) => {setNewFolder(e.target.value)}}
                        sx={{ marginTop: 1, width: '100%' }}
                        hiddenLabel
                        value={newFolder}
                        variant="outlined"
                      />
                      <Button
                        disabled={newFolder === ''}
                        onClick={createFolder}
                        variant="outlined"
                        sx={{
                          marginTop: '6px',
                          borderColor: '#2437a2',
                          backgroundColor: '#2437a2',
                          color: 'white',
                          '&:hover': {
                            borderColor: '#F1EFEF',
                            backgroundColor: '#5969ab',
                          }}}
                      >Create</Button>
                    </div>
                  </div>
              </div>
              )}
            </div>
            <div className="flex flex-col w-[50%]">
              <div className="flex flex-row  items-center">
                <Checkbox
                  checked={newBucketChecked}
                  onChange={(e) => {setNewBucketChecked(e.target.checked)}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography sx={{fontWeight: 'bold'}}>Create New Bucket</Typography>
              </div>
              {newBucketChecked && (
                <div className="flex flex-col w-[60%] mt-3">
                  <div className="flex flex-col w-full">
                    <Typography sx={{ fontWeight: "bold" }}>New Bucket</Typography>
                    <div className="flex flex-row">
                      <TextField
                        name="Title"
                        onChange={(e) => {setNewBucket(e.target.value)}}
                        sx={{ marginTop: 1, width: '100%' }}
                        hiddenLabel
                        value={newBucket}
                        variant="outlined"
                      />
                      <Button
                        disabled={newBucket === ''}
                        onClick={createBucket}
                        variant="outlined"
                        sx={{
                          marginTop: '6px',
                          borderColor: '#2437a2',
                          backgroundColor: '#2437a2',
                          color: 'white',
                          '&:hover': {
                            borderColor: '#F1EFEF',
                            backgroundColor: '#5969ab',
                          },
                        }}>Create</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

        </div>

          {/*<h1 className="text-xl ml-8 font-medium">Catalog</h1>*/}
          <div className="w-1/5 mr-8 flex items-center justify-center">

            {showSearch && (
              <SearchBar
                currentDataSet={crossClearDataSet}
                filteredResults={filteredResults}
                setFilteredResults={setFilteredResults}
              />
            )}
          </div>
        </div>
        <div className="w-[70%] flex flex-row justify-around">
          <div className="w-[40%] ml-8 mb-2">
            <Typography >{localSelected?.length} media files selected to move</Typography>

          </div>
          <div className="w-[60%] ml-8 mb-2">
            {collectedFolderList?.length === 1 && <Typography sx={{color: 'red'}} >No Media Files Associated With Present Song Entries</Typography>}

          </div>
        </div>

        <SimpleDataGrid
          columns={columnDetails}
          rows={filteredResults}
          onRowClick={onRowClick}
          loading={isLoading}
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          checkboxSelection
        />

        <ul className="w-[30%] ml-8 mb-10">
          <li>Or should this info be in a modal?</li>
          <li>
            <h1 className="text-l ml-8 font-medium mr-2">Row contains {selectedRowMediaDetails?.length} associated media files:</h1>

          </li>
          {(selectedRowMediaDetails || []).map((item, key) => (
            <li key={key}>
              <ul className=" mt-3 border-b-2 border-slate-300 ">
                <li className="flex flex-row items-end">
                  <h1 className="text-xl ml-8 font-medium mr-2">{item?.isFolderBucket ? 'Folder' : 'Bucket'}:</h1>
                  <Typography >{item?.bucket}</Typography>
                </li>
                <li className="flex flex-row items-end">
                  <h1 className="text-l ml-8 font-medium mr-2">File Type:</h1>
                  <Typography >{item?.fileType}</Typography>
                </li>
                <li className="flex flex-row items-end">
                  <h1 className="text-l ml-8 font-medium mr-2">Full Filename:</h1>
                  <Typography >{item?.fullFilename}</Typography>
                </li>
                <li className="flex flex-row items-end">
                  <h1 className="text-l ml-8 font-medium mr-2">digitraxId:</h1>
                  <Typography >{item?.digitraxId}</Typography>
                </li>
              </ul>
            </li>
          ))}
        </ul>

      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CrossDashboard' Page Component</h1>
    );
  }
};

export default ExportDashboard;
