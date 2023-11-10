import {Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useEffect, useState} from 'react';
import {addIdForDataTable, isWhiteSpace, upperCaseKey} from '../helpers/utils.js';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {ColumnHeadersMap} from '../helpers/constants.js';

export default function QueryBuilder () {
  try {
    const [dbSchemas, setDbSchemas] = useState({});
    const [availableTables, setAvailableTables] = useState();
    const [modelDetails, setModelDetails] = useState({});
    const [modelDetailsClean, setModelDetailsClean] = useState({});
    const [selectedTable, setSelectedTable] = useState('');
    const [availableFields, setAvailableFields] = useState([]);
    const [queryFields, setQueryFields] = useState({});
    const [collectQueryParams, setCollectQueryParams] = useState({});
    const [results, setResults] = useState([]);
    const [resultColumns, setResultColumns] = useState([]);

    const getTablesAndColumns = async () => {
      const result = await axiosBase({
        method: 'get',
        url: '/columnNames'
      })
        .catch(error => {
          console.log(error);
        });

      const models = result.data.datamodel.models;
      // console.log('STM pages-QueryBuilder.jsx:17', models); // todo remove dev item
      const modelDetailsLocal = {};
      const modelDetailsLocalClean = {};

      for (const model of models) {
        // console.log('STM pages-QueryBuilder.jsx:23', model); // todo remove dev item
        if (model.name === 'SongCatalog') {
          continue;
        }
        modelDetailsLocal[model.name] = {};
        modelDetailsLocalClean[model.name] = {};

        for (const field of model.fields) {
          // console.log('STM pages-QueryBuilder.jsx:23', model); // todo remove dev item
          modelDetailsLocal[model.name][field.name] = field.type;
          modelDetailsLocalClean[model.name][field.name] = '';
        }
      }
      console.log('STM pages-QueryBuilder.jsx:34', modelDetailsLocal); // todo remove dev item
      setModelDetails(modelDetailsLocal);
      setModelDetailsClean(modelDetailsLocalClean);
    };

    const handleChange = (e) => {
      const {name, value} = e.target;

      setQueryFields((prev) => ({
        ...prev,
        [name]: value,
      }));

      console.log('STM pages-QueryBuilder.jsx:49', queryFields); // todo remove dev item
    };
    const handleTableSelect = (e) => {
      const {name, value} = e.target;

      if (modelDetails[value]) {
        const available = Object.keys(modelDetails[value]);
        setAvailableFields(available);
        setQueryFields(modelDetailsClean[value]);

      }
      setSelectedTable(value);
    };


    const handleSaveParams = () => {
      const forTable = {};
      const currentDetails = modelDetails[selectedTable];
      const params = Object.keys(queryFields);
      for (const key of params) {
        if (!isWhiteSpace(queryFields[key])) {

          let convertedValue = '';
          if (currentDetails[key] === 'Int') {
            convertedValue = parseInt(queryFields[key]);
          } else if (currentDetails[key] === 'Boolean') {
            convertedValue = /[t|T]rue/.test(queryFields[key]);
          } else {
            convertedValue = queryFields[key];
          }
          forTable[key] = convertedValue;
        }
      }

      setCollectQueryParams((prev) => ({
        ...prev,
        [selectedTable]: forTable,
      }));
    };

    const runQuery = async () => {
      setCollectQueryParams(() => ({}));
      handleSaveParams();
      let tableName = '';
      const queryNested = {};
      const params = Object.keys(collectQueryParams);
      for (const key of params) {
        console.log('STM pages-QueryBuilder.jsx:93', key); // todo remove dev item
        tableName = key;
        const capitalizedKey = upperCaseKey(key);
        queryNested.where = collectQueryParams[key];
      }

      const query = {...queryNested, include: {SongCatalog: true}};
      // {
      //   include: queryNested
      // }

      console.log('STM pages-QueryBuilder.jsx:104', query); // todo remove dev item
      const result = await axiosBase({
        method: 'post',
        timeout: 10000,
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
      console.log('STM pages-QueryBuilder.jsx:134', data); // todo remove dev item
      if (data.length > 0) {
        const columnSet = Object.keys(data[0])?.map(item => {
          if (item === 'Id') {
            return {
              field: 'id',
              headerName: item,
              width: 75,
            };
          }
          // if(ColumnHeadersMap[item]){
          //   return {
          //     field: item,
          //     headerName: ColumnHeadersMap[item],
          //     width:  150
          //   };
          // }
          return {
            field: item,
            headerName: item,
            width: 150
          };
        });
        setResultColumns(columnSet);
      }

      setResults(addIdForDataTable(data));
      console.log('STM pages-QueryBuilder.jsx:114', result); // todo remove dev item
    };

    const getTableNames = () => {
      return Object.keys(modelDetails);
    };

    useEffect(() => {
      getTablesAndColumns();
    }, []);

    return (
      <>
        <div className="w-full mt-4 flex items-center justify-between">
          <div className="w-full flex flex-col">
            <div className="flex flex-col ml-20">
              <h1 className="text-4xl ml-10 font-medium">
                Expanded Search/Report Generator
              </h1>
              <div className="w-[90%] flex flex-col  mt-10">
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
                    <>
                      <div className="flex flex-col ml-20 mt-2 w-[15%]">
                        <Typography sx={{fontWeight: 'bold'}}>{entry}</Typography>
                        <TextField
                          sx={{marginTop: 1}}
                          hiddenLabel
                          name={entry}
                          value={queryFields[entry]}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </div>
                    </>
                  ))}
                </div>
              </div>
              {/*<div className="w-[90%] flex mt-10 items-center justify-end">*/}
              {/*  <Button*/}
              {/*    variant="outlined"*/}
              {/*    onClick={() => {*/}
              {/*      handleSaveParams()*/}
              {/*    }}*/}
              {/*    sx={{*/}
              {/*      marginRight: '15px',*/}
              {/*      borderColor: '#00b00e',*/}
              {/*      backgroundColor: '#00b00e',*/}
              {/*      color: 'white',*/}
              {/*      '&:hover': {*/}
              {/*        borderColor: '#F1EFEF',*/}
              {/*        backgroundColor: '#86A789',*/}
              {/*      },*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Add To Search*/}
              {/*  </Button>*/}
              {/*</div>*/}
              <div className="w-[90%] flex mt-10 items-center justify-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    console.log('STM pages-QueryBuilder.jsx:85', collectQueryParams);
                    runQuery();
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
                  Run Query
                </Button>
              </div>
              <div className="w-[90%] flex mt-10 items-center justify-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    console.log('STM pages-QueryBuilder.jsx:85', collectQueryParams);
                    setCollectQueryParams({});
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
            <div className="mt-10">
              <SimpleDataGrid
                columns={resultColumns}
                rows={results}
              />
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
