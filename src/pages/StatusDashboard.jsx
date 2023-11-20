import SearchIcon from '@mui/icons-material/Search';
import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {useState, useContext, useEffect} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {useNavigate} from 'react-router-dom';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import weekYear from 'dayjs/plugin/weekYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import {
  statusDashboardFieldsHidden,
  statusDashboardFieldsShown,
  statusOptions
} from '../helpers/constants.js';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {CommentDisplay} from '../components/CommentDisplay.jsx';
import StatusDisplayEdit from '../components/StatusDisplayEdit.jsx';
import {axiosBase} from '../helpers/requests.js';
import {addIdForDataTable} from '../helpers/utils.js';
import {statusDash} from '../helpers/strings.js';
import DisplayMediaListing from '../components/DisplayMediaListing.jsx';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const columnVisibilityModel = {
  ...statusDashboardFieldsHidden.reduce((acc, cur) => {
    acc[cur] = false;
    return acc;
  }, {}),
  ...statusDashboardFieldsShown.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {}),
};
const StatusDashboard = () => {
  const {currentDataSet, columnDetails, addToRecentSongs} = useContext(DataTableData);
  const {
    updateSong,
    getCommentsForSong,
    createComment,
    markCommentRemoved,
    getDetailsForSong,
    uploadMediaFile,
    generatedSets,
    updateMediaMetadata
  } = useContext(SongDetailsContext);

  const [comments, setComments] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState({});
  const [showStatusDetails, setShowStatusDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [releasePeriodStart, setReleasePeriodStart] = useState(false);
  const [releasePeriodEnd, setReleasePeriodEnd] = useState(false);
  const [createNewReleaseSet, setCreateNewReleaseSet] = useState(false);
  const [newReleaseSet, setNewReleaseSet] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState([]);

  const navigate = useNavigate();

  // TODO use an object to reduce the complexity of resetting state
  const resetState = () => {
    setShowStatusDetails(false)
    setSelectedDate('')
    setReleasePeriodStart(false)
    setReleasePeriodEnd(false)
    setCreateNewReleaseSet(false)
    setNewReleaseSet([])
    setRowSelectionModel([])
    setSelectedIds([])
    setProcessing(false)
    setSelectedDate('')
  }

  useEffect(() => {
    if (currentDataSet?.length > 0) setIsLoading(false);
    setFilteredResults(currentDataSet);
  }, [currentDataSet]);

  const columns = columnDetails;

  useEffect(() => {

    console.log('Columns', columns);
  }, []);

  const resetSelection = () => {
    setFilteredResults(currentDataSet);
    setRowSelectionModel([]);
    setSelectedDate('')
  };
  const handleChange = (e) => {
    const {name, value} = e.target;
    setRowData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRowClick = async (params) => {
    console.log('STM pages-StatusDashboard.jsx:106', params); // todo remove dev item
    delete params.row.id;
    setRowData({
      SongNumber: params.row.SongNumber,
      Status: params.row.Status,
      Title: params.row.Title,
      Artist: params.row.Artist,
      ReleaseScheduledFor: dayjs(params.row.ReleaseScheduledFor),
      StatusUpdatedAt: dayjs(params.row.StatusUpdatedAt)
    });

    console.log('STM pages-StatusDashboard.jsx:116', params); // todo remove dev item
    console.log('STM pages-StatusDashboard.jsx:116', params.row.GeneratedMedia); // todo remove dev item
    setGeneratedMedia(params.row.GeneratedMedia)
    await getComments(params.row.SongNumber);
    setShowStatusDetails(true);
  };

  const getComments = async (SongNumber) => {
    const results = await getCommentsForSong(SongNumber);
    console.log('STM pages-SongDetails.jsx:119', results); // todo remove dev item
    setComments((prev) => ([
      ...results,
    ]));
  };

  const handleCreateComment = async (newComment) => {
    const copyComment = {
      SongNumber: rowData.SongNumber,
      Content: newComment,
    };
    const createdComment = await createComment(copyComment);
    console.log('STM pages-SongDetails.jsx:281', createdComment); // todo remove dev item
    setComments((prev) => ([
      createdComment,
      ...prev,
    ]));
  };

  const handleRemoveComment = async (CommentId) => {
    markCommentRemoved(CommentId);
    setComments((prev) => {
      const idx = prev?.findIndex(item => item.CommentId === CommentId);
      prev.splice(idx, 1);
      return prev;
    });
  };

  const handleSave = async () => {
    setRowData((prev) => ({
      ...prev,
      StatusUpdatedAt: dayjs(),
    }));
    await updateSong(rowData);
  };

  const handleGetForWeek = (value) => {
    const result = value.day();
    console.log('STM pages-StatusDashboard.jsx:122', result); // todo remove dev item
    console.log('STM pages-StatusDashboard.jsx:123', value.day(0)); // todo remove dev item
    setReleasePeriodStart(value.day(0));
    setReleasePeriodEnd(value.day(6));
    setSelectedDate(value);
  };

  const getForSelectedWeek = async () => {
    if (releasePeriodStart && releasePeriodEnd) {
      const result = await axiosBase({
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
      setFilteredResults(addIdForDataTable(data));
    }
  };

  const handleShowOrHideReleaseSetCreate = () => {
    if(createNewReleaseSet){
      setNewReleaseSet([])
      setRowSelectionModel([])
      setSelectedIds([])
      setProcessing(false)
      setSelectedDate('')
    }
    setCreateNewReleaseSet(!createNewReleaseSet)
  }


  const updatesRowSelectionModel = (newRowSelectionModel) => {
    setRowSelectionModel(newRowSelectionModel);
  };
  const AddSelected = () => {
    const newlySelected = rowSelectionModel.reduce((acc, id) => {
      if (selectedIds.includes(id)) {
        return acc;
      }
      setSelectedIds((prev) => ([
        ...prev,
        id
      ]));
      const result = filteredResults.find(item => item.id === id);
      if (result) {
        acc.push(result);
      }
      return acc;
    }, []);

    setNewReleaseSet((prev) => ([
      ...prev,
      ...newlySelected
    ]));
  };

  const showAdded = () => {
    setRowSelectionModel(selectedIds);
  };

  const handleSaveReleaseSet = async () => {

    setProcessing(true)
    for(let i = 0; i<newReleaseSet?.length; i++){
      await updateSong({
        SongNumber: newReleaseSet[i].SongNumber,
        ReleaseScheduledFor: selectedDate
      });
    }

    setProcessing(false)
    resetState()
  };

  const uploadMediaFileAndRefresh = async (data) => {
    await uploadMediaFile(data)
    const songData = await getDetailsForSong(rowData.SongNumber)
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia)
    //
  }

  const uploadMediaMetadataAndRefresh = async (data) => {
    await updateMediaMetadata(data)
    const songData = await getDetailsForSong(rowData.SongNumber)
    setGeneratedMedia(songData?.GeneratedMedia ?? generatedMedia)
    //
  }

  const SongStatusEdit = () => {
    console.log('STM pages-StatusDashboard.jsx:243', rowData); // todo remove dev item
    return (
      <div className="w-full flex flex-col mt-10  mb-20">
        <StatusDisplayEdit
          statusData={rowData}
          handleChange={handleChange}
          handleSave={handleSave}/>
        <div className="w-full flex flex-col">
          <CommentDisplay
            comments={comments}
            handleCreateComment={handleCreateComment}
            handleRemoveComment={handleRemoveComment}
          />
        </div>
        <div className="w-full flex flex-col ml-20">
          <DisplayMediaListing
            updateGeneratedMediaMetadata={uploadMediaMetadataAndRefresh}
            uploadMediaFileAndRefresh={uploadMediaFileAndRefresh}
            SongNumber={rowData.SongNumber}
            generatedSets={generatedSets}
            generatedMedia={generatedMedia}
          />
        </div>
      </div>
    );
  };


  return (
    <div>
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-10 font-medium">
          {statusDash.StatusManagementDashboard}
        </h1>
        <div className="flex items-center px-2 w-1/6 justify-between mr-3">
        </div>
      </div>
      <div className="w-full h-10 mt-5 flex items-center justify-between ">
        <h1 className="text-xl ml-8 font-medium">{statusDash.Catalog}</h1>
      </div>
      <div className="w-[90%] h-20 ml-20 flex flex-row items-center justify-between ">
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
            marginRight: '15px',
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
        <Button
          disabled={processing}
          variant="outlined"
          onClick={() => {
            handleShowOrHideReleaseSetCreate()
          }}
          sx={{
            marginRight: '15px',
            borderColor: '#00b00e',
            backgroundColor: '#00b00e',
            color: 'white',
            '&:hover': {
              borderColor: '#F1EFEF',
              backgroundColor: '#86A789',
            },
          }}
        >
          {`${createNewReleaseSet ? statusDash.CloseCreateNewReleaseSet : statusDash.CreateNewReleaseSet}`}
        </Button>
      </div>
      <SimpleDataGrid
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={updatesRowSelectionModel}
        columns={columns}
        rows={filteredResults}
        onRowClick={handleRowClick}
        loading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
        checkboxSelection
      />
      {createNewReleaseSet && (
        <div className="w-full flex flex-col mt-4 flex items-center">
          <div className="w-[90%]  mb-20 flex flex-row items-center justify-between ">
            <Button
              variant="outlined"
              onClick={() => {
                AddSelected();
              }}
              sx={{
                marginRight: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              {statusDash.AddSelected}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                showAdded();
              }}
              sx={{
                marginRight: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              {statusDash.ShowAddedSongsAbove}
            </Button>
          </div>
          <SimpleDataGrid
            autoHeight
            columns={columns}
            rows={newReleaseSet}
            onRowClick={handleRowClick}
            loading={isLoading}
            columnVisibilityModel={columnVisibilityModel}
          />
          <div className={`w-[95%] pb-3 pt-2 mb-20 flex flex-col border border-gray-400 rounded-xl`}>
            <h1 className="text-xl ml-8 font-medium">{statusDash.SetReleaseDate}</h1>
            <div className={`w-[95%] pb-3 pt-2 flex flex-row`}>
              <div className="flex flex-col ml-10 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>{statusDash.ReleaseScheduledFor}</Typography>
                <DatePicker
                  name="ReleaseScheduledFor"
                  value={selectedDate}
                  onChange={(val) => {
                    setSelectedDate(val)
                  }}
                />
              </div>
              <div className="flex flex-row ml-24  w-[40%] items-center justify-end">
                <Button
                  disabled={processing}
                  variant="outlined"
                  onClick={() => {
                    handleSaveReleaseSet();
                  }}
                  sx={{
                    marginRight: '15px',
                    borderColor: '#00b00e',
                    backgroundColor: '#00b00e',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#86A789',
                    },
                  }}
                >
                  {statusDash.SetReleaseForChosenSongs}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(showStatusDetails && !createNewReleaseSet) && <SongStatusEdit/>}
    </div>
  );
};

export default StatusDashboard;
