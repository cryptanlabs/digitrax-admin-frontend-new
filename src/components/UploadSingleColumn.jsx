import {Button, Checkbox, MenuItem, Select, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useRef, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {statusDash} from '../helpers/strings.js';
import {statusOptions, statusOptionsText} from '../helpers/constants.js';
import {UserContext} from '../context/UserContext.jsx';


const parseTypes = (prismaType) =>{
  if (prismaType === 'Int' || prismaType === 'Decimal') {
    return 'number'
  } else if (prismaType === 'Boolean') {
    return 'boolean'
  } else if (prismaType === 'DateTime') {
    return 'dateTime'
  } else {
    return 'string'
  }
}
export default function UploadOrUpdateSingleColumn ({columnNames = []}) {
  try {
    const {adminDashToken} = useContext(UserContext);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [columnHeaders, setColumnHeaders] = useState([]);
    const [availableColumnHeaders, setAvailableColumnHeaders] = useState([]);
    const [invalidUpload, setInvalidUpload] = useState(false);
    const [columnToUpdate, setColumnToUpdate] = useState('');
    const [dataToUpdateColumn, setDataToUpdateColumn] = useState('');
    const [songNumberColumn, setSongNumberColumn] = useState('');
    const formData = new FormData();

    const [reviewing, setReviewing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [updateAnother, setUpdateAnother] = useState(false);
    const [overwrite, setOverwrite] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [numberSubmitted, setNumberSubmitted] = useState(0);
    const [numberAdded, setNumberAdded] = useState(0);
    const [numberPassedWithNoEntry, setNumberPassedWithNoEntry] = useState(0);
    const [rowsWithExistingValue, setRowsWithExistingValue] = useState([]);
    const [rowsNotFound, setRowsNotFound] = useState([]);
    const [rowsWithError, setRowsWithError] = useState([]);
    const [issueRowToDisplay, setIssueRowToDisplay] = useState([]);
    const [modelDetails, setModelDetails] = useState({});
    const [columnsForResult, setColumnsForResult] = useState([]);

    const getTablesAndColumns = async () => {
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        url: '/columnNames'
      })
        .catch(error => {
          console.log(error);
        });

      const models = result.data.datamodel.models;
      // console.log('STM pages-QueryBuilder.jsx:17', models); // todo remove dev item
      const modelDetailsLocal = {};

      const model = models.find(item => item.name === 'SongCatalog');

      for (const field of model.fields) {
        if (field.relationFromFields) {
          continue;
        }
        // console.log('STM pages-QueryBuilder.jsx:23', field); // todo remove dev item
        modelDetailsLocal[field.name] = field.type;
      }

      console.log('STM pages-QueryBuilder.jsx:34', modelDetailsLocal); // todo remove dev item
      setModelDetails(modelDetailsLocal);
    };

    useEffect(() => {
      getTablesAndColumns();
    }, []);

    const handleFileUploadClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      console.log('STM pages-Reports.jsx:16', file); // todo remove dev item
      if (file) {
        setSelectedFile(file);
        formData.append(
          'batch',
          file
        );

        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          url: '/convertCsv',
          data: formData
        })
          .catch(error => {
            console.log(error);
          });

        console.log('STM pages-Upload.jsx:34', result.data); // todo remove dev item
        console.log('STM pages-Reports.jsx:32', result); // todo remove dev item
        const rowsTemp = result.data.map((item, index) => {
          item.id = index;
          return item;
        });

        // if (Object.keys(result.data[0])?.length > 3) {
        //   setInvalidUpload(true);
        // } else {
          setColumnHeaders(Object.keys(result.data[0]));

          const columnsTemp = Object.keys(result.data[0]).map((item, index) => {
            return {
              field: item,
              headerName: item,
              width: 150
            };
          });
          setRowData(rowsTemp);
          setColumns(columnsTemp);
          setReviewing(true);
        // }

        return result.data;
      }
    };

    const prepareForSubmit = () => {
      const holding = rowData.reduce((acc, cur) => {
        acc.push({SongNumber: cur[songNumberColumn], [columnToUpdate]: cur[dataToUpdateColumn]})
        return acc
      }, [])

      const valueType = modelDetails[columnToUpdate];
      setColumnsForResult([{
        field: "SongNumber",
        headerName: "Catalog Number",
        type: parseTypes(valueType),
        width: 150,
      },{
        field: columnToUpdate,
        headerName: dataToUpdateColumn,
        type: parseTypes(valueType),
        width: 450,
      },{
        field: 'id',
        headerName: "Id",
        width: 75,
      }])

      handleFileSubmit(holding)
    }
    const handleFileSubmit = async (inputData) => {
console.log('STM components-UploadSingleColumn.jsx:160', columnToUpdate,  dataToUpdateColumn, songNumberColumn); // todo remove dev item
      if(columnToUpdate === '' || dataToUpdateColumn === '' || songNumberColumn === ''){
        return;
      }

      setProcessing(true);

      const valueType = modelDetails[columnToUpdate];
      console.log('STM components-UploadSingleColumn.jsx:133', valueType); // todo remove dev item
      const isNumeric = ['Int', 'Decimal'].includes(valueType);
      console.log('STM components-UploadSingleColumn.jsx:138', isNumeric); // todo remove dev item

      for (let i = 0; i < inputData.length; i += 100) {
        const rowSlice = inputData.slice(i, i + 100);

        // console.log('STM components-UploadSingleColumn.jsx:138', rowSlice); // todo remove dev item
        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          url: '/catalogUpdateMany',
          data: {rows: rowSlice, isNumeric, fieldToUpdate: columnToUpdate, force: overwrite}
        })
          .catch(error => {
            console.log(error);
          });
        // console.log('STM components-UploadSingleColumn.jsx:132', result.data); // todo remove dev item
        setNumberSubmitted((prev) => (
          prev + rowSlice?.length
        ));
        setNumberAdded((prev) => (
          prev + result.data.totalUpdated
        ));
        setNumberPassedWithNoEntry((prev) => (
          prev + result.data.rowsWithOutValue
        ))
        setRowsWithExistingValue((prev) => ([
          ...prev, ...result.data.notUpdated
        ]));
        setRowsNotFound((prev) => ([
          ...prev, ...result.data.notFound
        ]));
        setRowsWithError((prev) => ([
          ...prev, ...result.data.rowErrors
        ]));


        //
      }

      setIssueRowToDisplay(rowsNotFound);
      setProcessing(false);
      setCompleted(true);
    };

    const reset = () => {
      setRowData([]);
      setColumns([]);
      setRowsNotFound([]);
      setProcessing(false);
      setCompleted(false);
      setReviewing(false);
      setNumberAdded(0);
      setNumberSubmitted(0);
      setSelectedFile(null);
      setOverwrite(false)
      setColumnToUpdate('')
      setDataToUpdateColumn('')
    };

    const updateAnotherColumn = () => {
      setCompleted(false);
      setReviewing(true);
      setRowsNotFound([]);
      setNumberAdded(0);
      setNumberSubmitted(0);
      setNumberPassedWithNoEntry(0)
      setColumnToUpdate('')
      setDataToUpdateColumn('')
      setOverwrite(false)
      setRowsWithExistingValue([])
      setRowsNotFound([])
      setRowsWithError([])
    }


    return (
      <div>
        <div className="w-full mt-4 flex flex-col items-center justify-between">
          <div className="w-full mt-4 flex flex-col justify-start">
            <h1 className="text-4xl ml-10 font-medium">
              Update/Upload a Single Column (In progress)
            </h1>
            <div className="w-[90%] flex flex-row ml-20 items-center justify-between">
              <div className="flex flex-col ml-20">

                <div className="flex-1 pb-5">
                  {(!reviewing && !completed) && <Button
                    variant="outlined"
                    onClick={handleFileUploadClick}
                    sx={{
                      marginTop: '30px',
                      borderColor: 'gray',
                      color: 'white',
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
                    onClick={prepareForSubmit}
                    sx={{
                      marginTop: '30px',
                      borderColor: 'gray',
                      color: 'white',
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
                      color: 'white',
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
{/*                  {processing && <Button
                    variant="outlined"
                    onClick={() => {
                    }}
                    sx={{
                      marginTop: '30px',
                      marginLeft: '50px',
                      borderColor: 'gray',
                      color: 'white',
                      height: '60px',
                      backgroundColor: '#a21818',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    Abort
                  </Button>}*/}
                  {completed && <Button
                    variant="outlined"
                    onClick={updateAnotherColumn}
                    sx={{
                      marginTop: '30px',
                      marginLeft: '50px',
                      borderColor: 'gray',
                      color: 'white',
                      height: '60px',
                      backgroundColor: '#00b00e',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    Update another
                  </Button>}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="text/csv"
                  />
                  {invalidUpload &&
                    <Typography sx={{fontWeight: 'bold'}}>only two columns permitted</Typography>}
                </div>
              </div>
            </div>
            <div className="w-[90%] flex flex-row ml-20 items-center justify-between">
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Column with digitraxId or Cat #</Typography>
                <Select
                  sx={{marginTop: 1}}
                  name="Status"
                  value={songNumberColumn}
                  onChange={(e) => setSongNumberColumn(e.target.value)}
                >
                  {columnHeaders.filter(item => !(item === 'id' || item === 'Id')).map((value, index) => (
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Update from Column</Typography>
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
              </div>
              <div className="flex flex-col ml-20 w-[40%]">
                <Typography sx={{fontWeight: 'bold'}}>Column To Update</Typography>
                <Select
                  sx={{marginTop: 1}}
                  name="Status"
                  value={columnToUpdate}
                  onChange={(e) => setColumnToUpdate(e.target.value)}
                >
                  {columnNames.filter(item => !(item === 'id' || item === 'Id')).map((value, index) => (
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-row  w-52">
                <Checkbox checked={overwrite} onChange={(e) => {
                  setOverwrite(e.target.checked);
                }}/>
                <span style={{paddingTop: '9px'}}>Overwrite value if value exists</span>
              </div>
            </div>
            <div className="flex flex-col ml-20 w-[40%]">
            {processing && <span>Processed {numberSubmitted} of {rowData.length}. </span>}
            {completed && <span>Processed {numberSubmitted}. </span>}
              <div className="flex flex-row">
                {(processing || completed) && <span style={{marginRight: '20px'}}>{numberAdded} rows updated. </span>}
                {((processing || completed) && !overwrite) && <span  style={{marginRight: '20px'}}>{rowsWithExistingValue?.length} rows skipped. </span>}
                {(processing || completed) && <span style={{marginRight: '20px'}}>{rowsNotFound?.length} rows not found. </span>}
                {(processing || completed) && <span style={{marginRight: '20px'}}>{rowsWithError?.length} rows with error or issue. </span>}
                {(processing || completed) && <span style={{marginRight: '20px'}}>{numberPassedWithNoEntry} rows with empty value. </span>}
              </div>

            </div>
          </div>
          Note: 'id' is added just for display. It does not get included on submission.
          <SimpleDataGrid
            rows={rowData}
            columns={columns}
          />
          <div className="w-full mt-4 flex flex-col items-center justify-between">
            <Typography sx={{fontWeight: 'bold'}}>Rows With Possible Issues During Update </Typography>
            <div className="flex flex-row mb-5 mt-3">
              <Button
                disabled={processing}
                variant="outlined"
                onClick={() => {setIssueRowToDisplay(rowsWithError)}}
                sx={{
                  marginLeft: '50px',
                  borderColor: 'gray',
                  color: 'white',
                  height: '40px',
                  backgroundColor: '#00b00e',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
              >
                Show Rows With Error/Issue data
              </Button>
              <Button
                variant="outlined"
                onClick={() => {setIssueRowToDisplay(rowsNotFound)}}
                sx={{
                  marginLeft: '50px',
                  borderColor: 'gray',
                  color: 'white',
                  height: '40px',
                  backgroundColor: '#00b00e',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
              >
                Show Rows Not Found
              </Button>
              <Button

                variant="outlined"
                onClick={() => {setIssueRowToDisplay(rowsWithExistingValue)}}
                sx={{
                  marginLeft: '50px',
                  borderColor: 'gray',
                  color: 'white',
                  height: '40px',
                  backgroundColor: '#00b00e',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
              >
                Rows with existing value
              </Button>
            </div>
            <SimpleDataGrid
              rows={issueRowToDisplay}
              columns={columnsForResult}
            />
          </div>
          {/*{!doNotOverwrite && (<div className="w-full mt-4 flex flex-col items-center justify-between">*/}
          {/*  <Typography sx={{fontWeight: 'bold'}}>Rows with existing value</Typography>*/}
          {/*  <SimpleDataGrid*/}
          {/*    rows={rowsWithExistingValue}*/}
          {/*    columns={columns}*/}
          {/*  />*/}
          {/*</div>)}*/}
        </div>
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'UploadOrUpdateSingleColumn'
        Component</h1>
    );
  }
}
