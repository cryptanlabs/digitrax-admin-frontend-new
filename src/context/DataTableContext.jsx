import {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {base_url} from '../helpers/requests.js';
import {ColumnHeadersMap} from '../helpers/constants.js';

export const DataTableData = createContext(undefined);

const excludeFields = [
  'Id',
  'Writer',
  'Artist',
  'HFASongCode',
  'ISWC',
  'RecordingType',
  'RecordingArtist',
  'RecordingIdNumber',
  'RecordingTitle',
  'Label',
  'ISRCCAMixVocal',
  'ISRCCCMixKaraoke',
  'ISRCCDMixInstrumental',
  'ISRCAAMixVocal',
  'ISRCACMixKaraoke',
  'ISRCADMixInstrumental',
  'HFALicenseNumber',
  'MechanicalRegistrationNumberA',
  'MechanicalRegistrationNumberC',
  'MechanicalRegistrationNumberD',
  'SongCrossId',
  'CheckMixes',
  'CrossIdA',
  'CrossIdC',
  'CrossIdD',
  'CreatedAt',
  'UpdatedAt',
  'SubGenre',
  'Description',
  'ReleaseYear'
];

const DataTableContext = ({children}) => {
  const [currentDataSet, setCurrentDataSet] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  const [dataModels, setDataModels] = useState(undefined);
  const [columnNames, setColumnNames] = useState(undefined);
  const [columnDetails, setColumnDetails] = useState([]);
  const [crossColumnNames, setCrossColumnNames] = useState([]);
  const [crossColumnDetails, setCrossColumnDetails] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [crossClearDataSet, setCrossClearDataSet] = useState([]);

  const getData = async () => {
    const limit = 1000; //-1 // -1
    // const res = await axios.get(`${base_url}/catalogInternal?limit=1000`)
    const res = await axios.get(`${base_url}/catalogInternal?orderBy=SongReleaseYear&limit=${limit}&orderDir=desc`);
    const lowercaseId = res?.data?.data?.map(item => {

      return {id: item.Id, ...item};
    });
    setCurrentDataSet(lowercaseId);
    setTotalResults(res.data.totalResults);
    setTotalPages(res.data.totalPages);
    setNextPage(res.data.nextPage);

    console.log('Result:', res);


  };

  const getCrossData = async () => {
    const limit = 1000; //-1 // -1
    // const res = await axios.get(`${base_url}/catalogInternal?limit=1000`)
    const res = await axios.get(`${base_url}/getCrossClear`);
    const lowercaseId = res?.data?.result?.map(item => {

      return {id: item.Id, ...item};
    });
    console.log('STM context-DataTableContext.jsx:79', lowercaseId); // todo remove dev item
    setCrossClearDataSet(lowercaseId);

    console.log('Result getCrossData:', res);


  };

  useEffect(() => {
    console.log('Total Results:', totalResults);
    console.log('Total pages:', totalPages);
    console.log('Column Details:', columnDetails);
  }, [totalResults, totalPages, columnDetails]);

  const getColumnNamesAndHeaderDetails = (tableName, datamodel = dataModels, { width } = {width: 150}) => {

    let tableNameSource
    if(typeof tableName === 'number'){
      tableNameSource = datamodel?.models[tableName]
    } else {
      tableNameSource = datamodel?.models?.find(item => item.name = tableName)
    }
    const computedColumnNames = tableNameSource?.fields?.map(items => items.name);


    const computedColumnDetails = tableNameSource?.fields?.filter(item => !excludeFields.includes(item.name)).map(items => {
      if (items.name === 'Id') {
        return {
          field: 'id',
          headerName: items.name,
          width: 75,
        };
      }
      if(ColumnHeadersMap[items.name]){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          width: width ?? 150
        };
      }
      return {
        field: items.name,
        headerName: items.name,
        width: width ?? 150
      };
    });

    console.log('STM context-DataTableContext.jsx:111', computedColumnDetails, computedColumnNames); // todo remove dev item
    return [computedColumnDetails, computedColumnNames]
  }

  const getColumnNames = async () => {
    const res = await axios.get(`${base_url}/columnNames`);
    setDataModels(res.data?.datamodel);

    const [columns2, columns] = getColumnNamesAndHeaderDetails('SongCatalog', res.data?.datamodel)
    setColumnDetails(columns2);
    setColumnNames(columns);
    console.log(res);

    const [columns2CrossClear, columnCrossClear] = getColumnNamesAndHeaderDetails(3, res.data?.datamodel, {width: 250})
    setCrossColumnNames(columnCrossClear)
    setCrossColumnDetails(columns2CrossClear)
  };

  useEffect(() => {
    getColumnNames()
      .then(getData)
      .then(getCrossData)
  }, []);

  // useEffect(() => {
  //   getColumnNames();
  //   getData();
  //   getCrossData();
  // }, []);

  const addToRecentSongs = (song) => {
    setRecentSongs((prev) => {
      if (prev.length > 7) {
        prev.shift();
      }
      return [...prev, song];
    });
  };


  return (
    <DataTableData.Provider value={{
      getData,
      getCrossData,
      crossClearDataSet,
      crossColumnNames,
      crossColumnDetails,
      recentSongs,
      addToRecentSongs,
      currentDataSet,
      nextPage,
      totalPages,
      totalResults,
      columnNames,
      columnDetails
    }}>
      {children}
    </DataTableData.Provider>
  );
};


export default DataTableContext;
