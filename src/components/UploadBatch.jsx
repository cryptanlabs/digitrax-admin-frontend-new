import {Button, Checkbox, MenuItem, Select, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useRef, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {UserContext} from '../context/UserContext.jsx';

export default function UploadBatch ({columnNames = []}) {
  try {
    const {adminDashToken} = useContext(UserContext);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnHeaders, setColumnHeaders] = useState([]);
    const [reviewing, setReviewing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [numberSubmitted, setNumberSubmitted] = useState(0);
    const [numberAdded, setNumberAdded] = useState(0);
    const [rowsWithError, setRowsWithError] = useState([]);
    const [addCatalogNumber, setAddCatalogNumber] = useState(false);
    const [modelDetails, setModelDetails] = useState({});
    const [columnToUpdate, setColumnToUpdate] = useState('');
    const [dataToUpdateColumn, setDataToUpdateColumn] = useState('');
    const [songNumberColumn, setSongNumberColumn] = useState('');
    const [reloadTable, setReloadTable] = useState(true);
    const formData = new FormData();

    let cancelUpload = false;

    const getTablesAndColumns = async () => {
      const result = await axiosBase({
        method: 'get',
        url: '/columnNames'
      })
        .catch(error => {
          console.log(error);
        });

      const models = result.data.datamodel.models;
      const modelDetailsLocal = {};

      const model = models.find(item => item.name === 'SongCatalog');

      for (const field of model.fields) {
        if (field.relationFromFields) {
          continue;
        }
        modelDetailsLocal[field.name] = field.type;
      }

      setModelDetails(modelDetailsLocal);
    };

    useEffect(() => {
      getTablesAndColumns();
    }, []);

    useEffect(() => {
      setTimeout(() => {
        setReloadTable(true)
      }, 250)
    }, [rowData]);

    const reset = () => {
      setRowData([]);
      setColumns([]);
      setRowsWithError([])
      setProcessing(false)
      setCompleted(false)
      setReviewing(false)
      setAddCatalogNumber(false)
      setNumberAdded(0)
      setNumberSubmitted(0)
      setSelectedFile(null)
      setSongNumberColumn('')
      setColumnToUpdate('')
      setDataToUpdateColumn('')
    }
    const handleFileUploadClick = () => {
      fileInputRef.current.click();
    };
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFile(file);
        formData.append(
          'batch',
          file
        );

        setRowData([]);
        // setColumns([]);
        setProcessing(false)
        setCancel(false)
        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          url: '/convertCsv',
          // url: '/catalogAddMany',
          data: formData
        })
          .catch(error => {
            console.log(error);
          });

        setReviewing(true)

        const rowsTemp = result.data.map((item, index) => {
          item.id = index;
          return item;
        });

        setColumnHeaders(Object.keys(result.data[0]).sort());

        const columnsTemp = Object.keys(result.data[0]).map((item, index) => {
          return {
            field: item,
            headerName: item,
            width: 150
          };
        });

        setRowData(rowsTemp);
        setColumns(columnsTemp);
        return result.data;

      }

    };

    const associateColumn = () => {

      setReloadTable(false)
      const holding = rowData.reduce((acc, cur) => {
        cur[columnToUpdate] = cur[dataToUpdateColumn]
        delete cur[dataToUpdateColumn]
        acc.push(cur)
        return acc
      }, [])

      setRowData(holding)

      setColumns((prev) => {
        const idx = prev.findIndex(item => item.field === dataToUpdateColumn)
        if(idx > -1){
          prev[idx].field = columnToUpdate
          prev[idx].headerName = columnToUpdate
        }
        return prev
      })

      setColumnHeaders((prev) => {
        const idx = prev.findIndex(item => item === dataToUpdateColumn)
        if(idx > -1){
          prev.splice(idx, 1)
        }
        return prev
      })

      setColumnToUpdate('')
      setDataToUpdateColumn('')
    }

    const handleAddSongNumber = (e) => {
      const {checked} = e.target;
      setAddCatalogNumber(checked)
    }

    const handleFileSubmit = async () => {
      setProcessing(true)
      const endPointToUse = addCatalogNumber ? '/addSongsFromArrayNewNumbers' : '/catalogAddManyFromArray';
      for(let i=0; i<rowData.length; i += 100) {
        if(cancel || cancelUpload){
          break;
        }
        const rowSlice = rowData.slice(i, i + 100)


        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          url: endPointToUse,
          data: {rows: rowSlice, startIndex: i}
        })
          .catch(error => {
            console.log(error);
          });
        setNumberSubmitted((prev) => (
          prev + rowSlice?.length
        ))
        setNumberAdded((prev) => (
          prev + result.data.totalAddedSongCatalog
        ))

        setRowsWithError((prev) => ([
          ...prev, ...result.data.errorRows
        ]))

      }

      setRowData(rowsWithError)
      setProcessing(false)
      setCompleted(true)
    };

    const handleUploadAnother = () => {
      reset()
      fileInputRef.current.click();
    }

    return (
      <div>
        <div className="w-full mt-4 flex flex-col items-center justify-between">
          <div className="w-full mt-4 flex items-center justify-between">
            <div className="flex flex-col ml-20">
              <h1 className="text-4xl ml-10 font-medium">
                UpLoad (In progress)
              </h1>
              <div className="flex-1 pb-5">
                {(!reviewing && !completed) && <Button
                  variant="outlined"
                  onClick={handleFileUploadClick}
                  sx={{
                    marginTop: '30px',
                    borderColor: 'gray',
                    color: 'black',
                    height: '60px',
                    backgroundColor: '#00b00e',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  Open
                </Button>}
                {reviewing && <Button
                  variant="outlined"
                  disabled={completed}
                  onClick={handleFileSubmit}
                  sx={{
                    marginTop: '30px',
                    borderColor: 'gray',
                    color: 'black',
                    height: '60px',
                    backgroundColor: '#00b00e',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  Upload
                </Button>}
                {(reviewing || completed) && <Button
                  variant="outlined"
                  onClick={reset}
                  sx={{
                    marginTop: '30px',
                    marginLeft: '50px',
                    borderColor: 'gray',
                    color: 'black',
                    height: '60px',
                    backgroundColor: '#00b00e',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  Reset
                </Button>}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="text/csv"
                />
                <div className="flex flex-row  w-52">
                  <Checkbox checked={addCatalogNumber} onChange={handleAddSongNumber}/>
                  <span style={{paddingTop: '9px'}}>Add Catalog Number</span>
                </div>
                <div className="w-[90%] flex flex-row ml-20 items-center justify-between">
                  <div className="flex flex-col ml-20 w-[70%]">
                    <Typography sx={{fontWeight: 'bold'}}>Column with digitraxId or Cat #</Typography>
                    <Select
                      sx={{marginTop: 1, marginBottom: '30px'}}
                      name="Status"
                      value={songNumberColumn}
                      onChange={(e) => {
                        setSongNumberColumn(e.target.value)
                        setDataToUpdateColumn(e.target.value)
                        setColumnToUpdate(() => "SongNumber")
                      }}
                    >
                      {columnHeaders.filter(item => !(item === 'id' || item === 'Id')).map((value, index) => (
                        <MenuItem key={index} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col ml-20 w-[50%]">
                    <Typography sx={{fontWeight: 'bold'}}>Current Column</Typography>
                    <Select
                      sx={{marginTop: 1}}
                      name="Status"
                      value={dataToUpdateColumn}
                      onChange={(e) => setDataToUpdateColumn(e.target.value)}
                    >
                      {columnHeaders.filter(item => !(item === 'id' || item === 'Id')).map((value, index) => (
                        <MenuItem key={index} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                    <span style={{fontSize: '10px'}}>Current Column option is removed once associated</span>
                  </div>
                  <div className="flex flex-col ml-20 w-[50%]">
                    <Typography sx={{fontWeight: 'bold'}}>Associate With</Typography>
                    <Select
                      sx={{marginTop: 1, marginBottom: '30px'}}
                      name="Status"
                      value={columnToUpdate}
                      onChange={(e) => setColumnToUpdate(e.target.value)}
                    >
                      {columnNames.filter(item => !(item === 'id' || item === 'Id')).map((value, index) => (
                        <MenuItem key={index} value={value}>{value}</MenuItem>
                      ))}
                    </Select>
                  </div>
                  <Button
                    variant="outlined"
                    onClick={associateColumn}
                    sx={{
                      marginLeft: '50px',
                      borderColor: 'gray',
                      width: '200px',
                      color: 'white',
                      height: '60px',
                      backgroundColor: '#00b00e',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    Associate Columns
                  </Button>
                </div>
              </div>
              {processing && <span>Processed {numberSubmitted} of {rowData.length}. </span>}
              {completed && <span>Processed {numberSubmitted}. </span>}
              {(processing || completed) && <span>{numberAdded} rows added. </span>}
            </div>
          </div>
          {reloadTable && <SimpleDataGrid
            rows={rowData}
            columns={columns}
          />}
          <div className="w-full mt-4 flex flex-col items-center justify-between">
            <Typography sx={{ fontWeight: "bold" }}>Rows not added </Typography>
            <SimpleDataGrid
              rows={rowsWithError}
              columns={columns}
            />
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'UploadBatch' Component</h1>
    )
  }
}
