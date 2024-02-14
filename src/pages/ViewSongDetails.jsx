import {Box, Button, MenuItem, Select, TextField, Typography} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';
import WithFilters from '../components/WithFilter.jsx';
import {addIdForDataTable, isWhiteSpace, upperCaseKey} from '../helpers/utils.js';
import {axiosBase, axiosBaseWithKey} from '../helpers/requests.js';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import {UserContext} from '../context/UserContext.jsx';

const catTable = {
  "Id": "Int",
  "SongNumber": "String",
  "Title": "String",
  "Artist": "String",
  "Genre": "String",
  "SubGenre": "String",
  "SongReleaseYear": "Int",
  "Duration": "String",
  "SongKey": "String",
  "InTheStyleOfArtist": "String",
  "Writer": "String",
  "Description": "String",
  "RecordingIdNumber": "String",
  "RecordingTitle": "String",
  "RecordingType": "String",
  "RecordingArtist": "String",
  "Label": "String",
  "BarIntro": "String",
  "Mixes": "String",
  "MixRendered": "String",
  "HFASongCode": "String",
  "ISWC": "String",
  "ISRCCAMixVocal": "String",
  "ISRCCCMixKaraoke": "String",
  "ISRCCDMixInstrumental": "String",
  "ISRCAAMixVocal": "String",
  "ISRCACMixKaraoke": "String",
  "ISRCADMixInstrumental": "String",
  "HFALicenseNumber": "String",
  "MechanicalRegistrationNumberA": "String",
  "MechanicalRegistrationNumberC": "String",
  "MechanicalRegistrationNumberD": "String",
  "SongCrossId": "String",
  "CheckMixes": "String",
  "CrossIdA": "String",
  "CrossIdC": "String",
  "CrossIdD": "String",
  "Territories": "String",
  "ClearedforKaraoke": "Boolean",
  "ClearedForTV": "Boolean",
  "Kod": "Boolean",
  "Vevo": "Boolean",
  "VirtualDj": "Boolean",
  "KaraokeCloudApi": "Boolean",
  "Status": "String",
  "ReleaseScheduledFor": "DateTime",
  "StatusUpdatedAt": "DateTime",
  "DateAdded": "DateTime",
  "CreatedAt": "DateTime",
  "UpdatedAt": "DateTime",
  "PublisherAdmin": "String",
  "SubPublisherDetails": "String",
  "Share": "Decimal",
}

const publisher = {
  // "Id": "Int",
  // "PublisherDatabaseId": "String",
  // "SongNumber": "String",
  "PublisherAdmin": "String",
  "SubPublisherDetails": "String",
  "Share": "Decimal",
  // "UpdatedAt": "DateTime",
  // "CreatedAt": "DateTime"
}

const publisherKeys = ["PublisherAdmin", "SubPublisherDetails", "Share"]

const queryFieldsDefault = {
  "SongNumber": "String",
  "InTheStyleOfArtist": "String",
  "Title": "String",
  "Genre": "String",
  "SongReleaseYear": "Int",
  "Mixes": "String",
  "PublisherAdmin": "String",
  "SubPublisherDetails": "String",
  "Share": "Decimal",
}

const queryPublisherFieldsDefault = {
  "PublisherAdmin": "String",
}

const queryFieldsExtended = {
  "HFASongCode": "String",
  "ISWC": "String",
  "ISRCCAMixVocal": "String",
  "ISRCCCMixKaraoke": "String",
  "ISRCCDMixInstrumental": "String",
  "ISRCAAMixVocal": "String",
  "ISRCACMixKaraoke": "String",
  "ISRCADMixInstrumental": "String",
  "HFALicenseNumber": "String",
  "MechanicalRegistrationNumberA": "String",
  "MechanicalRegistrationNumberC": "String",
  "MechanicalRegistrationNumberD": "String",
  "SongCrossId": "String",}

const labelMapping = {
  "SongNumber": "Catalog ID #",
  "InTheStyleOfArtist": "In Style Of Artist",
  "Title": "Song Title",
  "Genre": "Genre",
  "SongReleaseYear": "Release Year",
  "Mixes": "Mix",
  "HFASongCode": "HFASongCode",
  "ISWC": "ISWC",
  "ISRCCAMixVocal": "ISRCCAMixVocal",
  "ISRCCCMixKaraoke": "ISRCCCMixKaraoke",
  "ISRCCDMixInstrumental": "ISRCCDMixInstrumental",
  "ISRCAAMixVocal": "ISRCAAMixVocal",
  "ISRCACMixKaraoke": "ISRCACMixKaraoke",
  "ISRCADMixInstrumental": "ISRCADMixInstrumental",
  "HFALicenseNumber": "HFALicenseNumber",
  "MechanicalRegistrationNumberA": "MechanicalRegistrationNumberA",
  "MechanicalRegistrationNumberC": "MechanicalRegistrationNumberC",
  "MechanicalRegistrationNumberD": "MechanicalRegistrationNumberD",
  "SongCrossId": "SongCrossId",
}
export default function ViewSongDetails () {
  const {adminDashToken} = useContext(UserContext);
  const navigate = useNavigate();
  const [songNumber, setSongNumber] = useState(true);
  const [disableRequestButton, setDisableRequestButton] = useState(true);
  const [noSongFoundForCatalogNumber, setNoSongFoundForCatalogNumber] = useState(false);
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [availableFields, setAvailableFields] = useState(catTable);
  const [queryFields, setQueryFields] = useState(queryFieldsDefault);
  const [queryFieldModifiers, setQueryFieldModifiers] = useState({});
  // const [queryPublisherFields, setQueryPublisherFields] = useState(queryPublisherFieldsDefault);
  // const [queryPublisherFieldModifiers, setQueryPublisherFieldModifiers] = useState({});
  const [extendedFieldSelected, setExtendedFieldSelected] = useState('');
  const [lastQuery, setLastQuery] = useState({});
  const [results, setResults] = useState([]);
  const [resultColumns, setResultColumns] = useState([]);
  const [invalidSongNumber, setInvalidSongNumber] = useState(true);
  const [disableNavigateOnClick, setDisableNavigateOnClick] = useState(false);
    const {addToRecentSongs} = useContext(DataTableData);
  const {
    getDetailsForSong
  } = useContext(SongDetailsContext);


  /*
  *               key={'123'}
              label="Catalog ID #"
              field="SongNumber"
              fieldType="String"
              queryFields={queryFields}
              setQueryFields={handleQueryChange}
              queryFieldModifiers={queryFieldModifiers}
              setQueryFieldModifiers={handleQueryFieldModifiers}
              *
              * */
  useEffect(() => {
    const queryKeys = {}
    for(let key of Object.keys(queryFieldsDefault)){
      queryKeys[key] = ''
    }
    setQueryFields(queryKeys)
  }, []);

  useEffect(() => {
    prepareQuery()
    let disabled = true
    for(let key of Object.keys(queryFields)){
      if(key === 'SongNumber'){
        continue;
      }
      if(queryFields[key]?.length > 0){
        disabled = false
      }
    }

    const validSongNumberState = (queryFields['SongNumber']?.length === 0 || queryFields['SongNumber']?.length === 5)
    if(!validSongNumberState){
      setDisableRequestButton(true)
    } else if(queryFields['SongNumber']?.length === 0 && !disabled){
      setDisableRequestButton(false)
    } else if(queryFields['SongNumber']?.length === 5 && !disabled){
      setDisableRequestButton(false)
    } else if(queryFields['SongNumber']?.length === 5){
      setDisableRequestButton(false)
    } else {
      setDisableRequestButton(true)
    }
  }, [queryFields]);


  useEffect(() => {
    if(results.length === 1){
      addToRecentSongs(results[0]['SongNumber']);
      navigate(`/songdata/${results[0]['SongNumber']}`, {state: {rowData: results[0]}});
    } else if(results.length === 0 && !disableRequestButton){
      setNoSongFoundForCatalogNumber(true)
    } else if(results.length > 1 && !disableRequestButton){
      setNoSongFoundForCatalogNumber(false)
      setShowDataGrid(true)
    } else {
      setNoSongFoundForCatalogNumber(false)
    }
  }, [results]);

  const handleChange = (e) => {
    const {value} = e.target
    setSongNumber(value)
    setDisableRequestButton(value?.length !== 5)
  }

  const handleAddFieldChange = (e) => {
    setQueryFields((prev) => ({
      ...prev,
      [e.target.value]: ''
    }))
  }

  const handleQueryChange = (e) => {
    const {name, value} = e.target;

    setQueryFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQueryFieldModifiers = (e) =>{
    const {name, value} = e.target;
    setQueryFieldModifiers((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleLookup = async () => {
    await sendQueryAndParseResponse(lastQuery.tableName, lastQuery.query)
  }

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

  }

  const handleSaveParams = () => {
    // return new Promise((resolve) => {
      const forTable = {};
      const currentDetails = catTable;
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
        // if(!isWhiteSpace(queryFields[key]) && publisherKeys.includes(key)){
        //
        // } else
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
            } else if (currentDetails[key] === 'Boolean') {
              convertedValue = /[t|T]rue/.test(queryFields[key]);
            } else {
              convertedValue = {contains: queryFields[key]};
            }
          }

          if(publisherKeys.includes(key)){
            if(forTable["SongPublisher"]){
              forTable["SongPublisher"]["some"][key] = convertedValue
            } else {
              forTable["SongPublisher"] = {
                "some": {
                  [key]: convertedValue
                }};
            }

          } else {
            forTable[key] = convertedValue;
          }

        }
      }
      return {['SongCatalog']: forTable}
    //   resolve({['SongCatalog']: forTable})
    //   // resolve({[selectedTable]: forTable})
    // });
  };

  const prepareQuery = () => {
    // setShowQuerySaveComplete(false)
    let localCollectQueryParams = handleSaveParams();

    let tableName = 'SongCatalog';
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
  };

  const onRowClick = (val) =>{
    if(disableNavigateOnClick) return;
    const rowData = val.row
    addToRecentSongs(rowData['SongNumber']);
    navigate(`/songdata/${rowData['SongNumber']}`, {state: {rowData}});
  }


  return (
    <>
      <div className="w-full flex-col justify-start mt-10 flex">
        <div className="w-full flex-col justify-start ml-20 flex">
          <div>
            {/* ---------- DEBUGGING  - DISPLAYS GENERATED QUERY -----------*/}
            {/*{Object.keys(lastQuery?.query || {}).map((item, key) => (*/}
            {/*    <div>*/}
            {/*      {JSON.stringify(lastQuery?.query[item])}*/}
            {/*    </div>*/}
            {/*))}*/}
            {noSongFoundForCatalogNumber && <Typography sx={{ fontWeight: "bold" }}>No Song(s) Found</Typography>}
          </div>
        </div>
        <div className="w-full flex-row justify-start mt-10 flex">
          {/*<WithFilters*/}
          {/*    key={'123'}*/}
          {/*    label="Catalog ID #"*/}
          {/*    field="SongNumber"*/}
          {/*    fieldType="String"*/}
          {/*    queryFields={queryFields}*/}
          {/*    setQueryFields={handleQueryChange}*/}
          {/*    queryFieldModifiers={queryFieldModifiers}*/}
          {/*    setQueryFieldModifiers={handleQueryFieldModifiers}*/}
          {/*/>*/}
          <div className="flex flex-col ml-20 mt-10">
            <Button
              disabled={disableRequestButton}
              variant="outlined"
              onClick={handleLookup}
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
              Get Song Details
            </Button>
          </div>
          <div className="flex flex-col ml-20 w-96">
            <Typography sx={{ fontWeight: "bold" }}>Add Registration/Mechanical Field to Lookup</Typography>
            <Select
                sx={{marginTop: 1}}
                name="Genre"
                value={extendedFieldSelected}
                onChange={handleAddFieldChange}
            >
              {Object.keys(queryFieldsExtended).map((value, index) => (
                  <MenuItem key={index} value={value}>{value}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="w-full flex flex-row flex-wrap mt-10">
          {Object.keys(queryFields).map((entry, index) => (
              <WithFilters
                  key={index}
                  label={labelMapping[entry]}
                  field={entry}
                  fieldType={availableFields[entry]}
                  queryFields={queryFields}
                  setQueryFields={handleQueryChange}
                  queryFieldModifiers={queryFieldModifiers}
                  setQueryFieldModifiers={handleQueryFieldModifiers}
              />
          ))}
          {/*{Object.keys(queryPublisherFields).map((entry, index) => (*/}
          {/*    <WithFilters*/}
          {/*        key={index}*/}
          {/*        label={labelMapping[entry]}*/}
          {/*        field={entry}*/}
          {/*        fieldType={availableFields[entry]}*/}
          {/*        queryFields={queryPublisherFields}*/}
          {/*        setQueryFields={handleQueryChange}*/}
          {/*        queryFieldModifiers={queryPublisherFieldModifiers}*/}
          {/*        setQueryFieldModifiers={handleQueryFieldModifiers}*/}
          {/*    />*/}
          {/*))}*/}
        </div>

        <div className="mt-10">
          {showDataGrid && (<>
          <div className="ml-10 mb-5">
            <Button
                variant="outlined"
                onClick={() => {setDisableNavigateOnClick(!disableNavigateOnClick)}}
                sx={{
                  marginRight: '15px',
                  borderColor: disableNavigateOnClick ? '#930a0a' : '#00b00e',
                  backgroundColor: disableNavigateOnClick ? '#930a0a' : '#00b00e',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#86A789',
                  },
                }}
            >
              {`${disableNavigateOnClick ? 'Navigate On Row Click Disabled' : 'Navigate On Row Click Enabled'}`}
            </Button>
          </div>

            <SimpleDataGrid
                columns={resultColumns}
                rows={results}
                onRowClick={onRowClick}
            />
          </>

          ) }
        </div>
      </div>
    </>
  );
}
