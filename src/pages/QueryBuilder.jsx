import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {axiosBase, axiosBaseWithKey} from '../helpers/requests.js';
import {useContext, useEffect, useState} from 'react';
import {addIdForDataTable, isWhiteSpace, upperCaseKey} from '../helpers/utils.js';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import WithFilters from '../components/WithFilter.jsx';
import {UserContext} from '../context/UserContext.jsx';

function formatedDate(){
  const date = new Date();

  const monthName = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${monthName}-${day}-${year}_${hours}${minutes}${seconds}`;
}

export default function QueryBuilder () {
  try {
    const {adminDashToken} = useContext(UserContext);
    const [modelDetails, setModelDetails] = useState({});
    const [modelDetailsClean, setModelDetailsClean] = useState({});
    const [selectedTable, setSelectedTable] = useState('');
    const [availableFields, setAvailableFields] = useState([]);
    const [queryFields, setQueryFields] = useState({});
    const [queryFieldModifiers, setQueryFieldModifiers] = useState({});
    const [collectQueryParams, setCollectQueryParams] = useState({});
    const [results, setResults] = useState([]);
    const [resultColumns, setResultColumns] = useState([]);
    const [lastQuery, setLastQuery] = useState({});
    const [querySaveLabel, setQuerySaveLabel] = useState('');
    const [showQuerySaveComplete, setShowQuerySaveComplete] = useState(false);
    const [savedQueries, setSavedQueries] = useState([]);
    const [loadedSavedQuery, setLoadedSavedQuery] = useState({});
    const [exportFileName, setExportFileName] = useState(false);

    const getSavedQueries = async () => {
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        timeout: 30000,
        url: '/getBuiltQueries',
      })
        .catch(error => {
          console.log(error);
        });
      setSavedQueries(result.data)
    };

    const getTablesAndColumns = async () => {
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        url: '/columnNames'
      })
        .catch(error => {
          console.log(error);
        });

      const models = result.data.datamodel.models;
      const modelDetailsLocal = {};
      const modelDetailsLocalClean = {};

      for (const model of models) {
        modelDetailsLocal[model.name] = {};
        modelDetailsLocalClean[model.name] = {};

        for (const field of model.fields) {
          if(field.relationFromFields){
            continue
          }
          modelDetailsLocal[model.name][field.name] = field.type;
          modelDetailsLocalClean[model.name][field.name] = '';
        }
      }
      setModelDetails(modelDetailsLocal);
      setModelDetailsClean(modelDetailsLocalClean);
    };

    useEffect(() => {
      getTablesAndColumns();
      getSavedQueries()
    }, []);

    const handleChange = (e) => {
      const {name, value} = e.target;

      setQueryFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    const handleTableSelect = (e) => {
      const {name, value} = e.target;

      if (modelDetails[value]) {
        const available = Object.keys(modelDetails[value]);
        setAvailableFields(modelDetails[value]);
        setQueryFields(modelDetailsClean[value]);
        console.log('STM pages-QueryBuilder.jsx:86', modelDetails[value]); // todo remove dev item
      }

      setSelectedTable(value);
    };


    const handleSaveParams = () => {
      return new Promise((resolve) => {
            const forTable = {};
            const currentDetails = modelDetails[selectedTable];
            const params = Object.keys(queryFields);

            const parseNumbers = (key) =>{
              if (currentDetails[key] === 'Int') {
                return parseInt(queryFields[key]);
              } else if (currentDetails[key] === 'Decimal') {
                return parseFloat(queryFields[key])
              } else {
                return queryFields[key]
              }
            }

            for (const key of params) {
              if (!isWhiteSpace(queryFields[key])) {
                let convertedValue = '';
                if(queryFieldModifiers[key]){

                  switch (queryFieldModifiers[key]){
                    case '=':
                      convertedValue = {equals: parseNumbers(key)}
                      break;
                    case '>':
                      convertedValue = {gt: parseNumbers(key)}
                      break;
                    case '>=':
                      convertedValue = {gte: parseNumbers(key)}
                      break;
                    case '<':
                      convertedValue = {lt: parseNumbers(key)}
                      break;
                    case '<=':
                      convertedValue = {lte: parseNumbers(key)}
                      break;
                  }
                } else {
                  if (currentDetails[key] === 'Int') {
                    convertedValue = parseInt(queryFields[key]);
                  } else if (currentDetails[key] === 'Boolean') {
                    convertedValue = /[t|T]rue/.test(queryFields[key]);
                  } else {
                    convertedValue = {contains: queryFields[key]};
                  }
                }


                forTable[key] = convertedValue;
              }
            }

            resolve({[selectedTable]: forTable})
      });
    };

    const runQuery = async () => {
      setShowQuerySaveComplete(false)
      let localCollectQueryParams = await handleSaveParams();

      let tableName = '';
      const queryNested = {};
      const params = Object.keys(localCollectQueryParams);
      for (const key of params) { // key is tableName
        tableName = key;
        const capitalizedKey = upperCaseKey(key);
        queryNested.where = localCollectQueryParams[key];
      }
      const query = {...queryNested};

      if(tableName !== 'SongCatalog'){
        query.include = {SongCatalog: true}
      }

      setLastQuery({
        tableName,
        query
      })
      await sendQueryAndParseResponse(tableName, query)
    };

    const sendQueryAndParseResponse = async (tableName, query) => {
      const result = await axiosBaseWithKey(adminDashToken)({
        method: 'post',
        timeout: 30000,
        url: '/rawQuery',
        data: {
          tableName,
          query
        }
      })
        .catch(error => {
          console.log(error);
        });

      const data = result.data.data;
      if (data.length > 0) {
        const columnSet = Object.keys(data[0])?.map(item => {
          if (item === 'Id') {
            return {
              field: 'id',
              headerName: item,
              width: 75,
            };
          }
          return {
            field: item,
            headerName: item,
            width: 150
          };
        });
        setResultColumns(columnSet);
      }

      setResults(addIdForDataTable(data));
      const exportFileNameString = `${tableName}_${formatedDate()}`
      setExportFileName(exportFileNameString)
    }

    const getTableNames = () => {
      return Object.keys(modelDetails);
    };



    const handleQueryFieldModifiers = (e) =>{
      const {name, value} = e.target;
      setQueryFieldModifiers((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const handleLoadSavedQuery = async (e) => {
      try {
        const {name, value} = e.target
        const savedQueryEntry = savedQueries.find(item => item.Label === value.Label);
        if(savedQueryEntry){
          setLoadedSavedQuery(value)
          await sendQueryAndParseResponse(savedQueryEntry.TableName, savedQueryEntry.Query);
        }

      } catch (e) {
        console.error(e)
      }

    }

    const SaveLastQuery = async () => {
      let saveLabel = querySaveLabel
      if(saveLabel === ''){
        saveLabel = new Date(Date.now()).toString()
      }

      if(lastQuery.tableName && lastQuery.query){
        const result = await axiosBaseWithKey(adminDashToken)({
          method: 'post',
          timeout: 30000,
          url: '/saveBuiltQuery',
          data: {
            tableName: lastQuery.tableName,
            query: lastQuery.query,
            label: saveLabel
          }
        })
          .catch(error => {
            console.log(error);
          });

        if(result){

          setShowQuerySaveComplete(true)
          getSavedQueries()
        }
      }

    };



    return (
      <>
        <div className="w-full mt-4 flex items-center justify-between">
          <div className="w-full flex flex-col">
            <div className="flex flex-col ml-20">
              <h1 className="text-4xl ml-10 font-medium">
                Expanded Search/Report Generator
              </h1>
              <div className="w-[90%] flex flex-col  mt-10">
                <Typography sx={{ fontWeight: "bold" }}>Load Saved</Typography>
                <Select
                  sx={{marginTop: 1}}
                  value={loadedSavedQuery}
                  onChange={handleLoadSavedQuery}
                >
                  {savedQueries.map((value, index) => (
                    <MenuItem key={index} value={value}>{value.Label}</MenuItem>
                  ))}
                </Select>
                <Typography sx={{ fontWeight: "bold", marginTop: '20px' }}>New Search</Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: '15px', marginTop: '10px' }}>Select Table</Typography>
                <Select
                  sx={{marginTop: 1}}
                  value={selectedTable}
                  onChange={handleTableSelect}
                >
                  {getTableNames().map((value, index) => (
                    <MenuItem key={index} value={value}>{value}</MenuItem>
                  ))}
                </Select>
                <div className="w-full flex flex-row flex-wrap mt-10 flex">
                  {Object.keys(queryFields).map((entry, index) => (
                      <WithFilters
                        key={index}
                      field={entry}
                      fieldType={availableFields[entry]}
                      queryFields={queryFields}
                      setQueryFields={handleChange}
                      queryFieldModifiers={queryFieldModifiers}
                      setQueryFieldModifiers={handleQueryFieldModifiers}
                      />
                  ))}
                </div>
              </div>
              <div className="w-[90%] flex flex-row mt-10 items-center justify-end">

                <div className="w-[90%] flex flex-col  items-center justify-end">
                  <div className="w-[90%] flex  items-center justify-end">
                    <Button
                      variant="outlined"
                      onClick={runQuery}
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
                      Run Query
                    </Button>
                  </div>
                  <div className="w-[90%] flex mt-10 items-center justify-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        console.log('STM pages-QueryBuilder.jsx:85', collectQueryParams);
                        setCollectQueryParams({});
                        setSelectedTable('')
                        setQueryFieldModifiers({})
                        setQueryFields({})
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
                      Clear Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <SimpleDataGrid
                columns={resultColumns}
                rows={results}
                exportFileName={exportFileName}
              />
            </div>
            <div className="w-[90%] flex flex-row mb-20 items-center justify-end">
              <div className="flex flex-col ml-20 w-[90%]">
                <Typography sx={{ fontWeight: "bold" }}>Save Label</Typography>
                <TextField
                  name="Artist"
                  onChange={(e) => {setQuerySaveLabel(e.target.value)}}
                  sx={{ marginTop: 1 }}
                  hiddenLabel
                  value={querySaveLabel}
                  variant="outlined"
                />
              </div>
              <div className="w-[90%] flex mt-10 items-center justify-end">
                <Button
                  disabled={showQuerySaveComplete}
                  variant="outlined"
                  onClick={() => {
                    SaveLastQuery()
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

                  {`${showQuerySaveComplete ? 'Saved' : 'Save Search'}`}
                </Button>

              </div>
            </div>

          </div>
        </div>
      </>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'QueryBuilder' Page Component</h1>
    )
  }
}
