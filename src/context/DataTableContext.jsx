import {createContext, useEffect, useState} from 'react';
import axios from 'axios';
import {axiosBase, base_url, returnLimit} from '../helpers/requests.js';
import {ColumnHeadersMap, ColumnWidthMap, statusOptionsText} from '../helpers/constants.js';
import {isWhiteSpace} from '../helpers/utils.js';
import dayjs from 'dayjs';

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
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchingCrossClear, setFetchingCrossClear] = useState(false);
  const [generatedSets, setGeneratedSets] = useState([]);
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
  const [nextTwentyCatalogNumbers, setNextTwentyCatalogNumbers] = useState([]);

  const getData = async () => {
    // const limit = 1000; //-1 // -1
    // const res = await axios.get(`${base_url}/catalogInternal?limit=1000`)

    if(fetchingData) return
    setFetchingData(true)
    try {
      const res = await axios.get(`${base_url}/catalogInternal?orderBy=SongReleaseYear&limit=${returnLimit}&orderDir=desc`);
      const lowercaseId = res?.data?.data?.map(item => {

        return {id: item.Id, ...item};
      });
      setCurrentDataSet(lowercaseId);
      setTotalResults(res.data.totalResults);
      setTotalPages(res.data.totalPages);
      setNextPage(res.data.nextPage);

      console.log('Result:', res);
      setFetchingData(false)
    } catch (e) {
      console.error(e)
      setFetchingData(false)
    }


  };

  const getExistingBuckets = () => {
    axiosBase({
      method: 'get',
      url: '/getExistingBuckets',
    })
      .then(response => {
        const buckets = response.data?.map(item => item.bucket);
        console.log('STM context-DataTableContext.jsx:82', buckets); // todo remove dev item
        setGeneratedSets(buckets);
      });
  }

  const getCrossData = async () => {

    if(!fetchingCrossClear){
      try {
        setFetchingCrossClear(true);
        const limit = 1000; //-1 // -1
        // const res = await axios.get(`${base_url}/catalogInternal?limit=1000`)
        const res = await axios.get(`${base_url}/getCrossClear`);
        const lowercaseId = res?.data?.result?.map(item => {

          return {id: item.Id, ...item};
        });
        // console.log('STM context-DataTableContext.jsx:79', lowercaseId); // todo remove dev item
        setCrossClearDataSet(lowercaseId);

        console.log('Result getCrossData:', res);
        setFetchingCrossClear(false);
      } catch (e) {
        console.error(e)
        setFetchingCrossClear(false);
      }
    }



  };

  // useEffect(() => {
  //   console.log('Total Results:', totalResults);
  //   console.log('Total pages:', totalPages);
  //   console.log('Column Details:', columnDetails);
  // }, [totalResults, totalPages, columnDetails]);

  const getColumnNamesAndHeaderDetails = (tableName, datamodel = dataModels, { width } = {width: 150}) => {

    let tableNameSource
    if(typeof tableName === 'number'){
      tableNameSource = datamodel?.models[tableName]
    } else {
      tableNameSource = datamodel?.models?.find(item => item.name = tableName)
    }
    const computedColumnNames = tableNameSource?.fields?.map(items => items.name);

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

    // .filter(item => !excludeFields.includes(item.name))
    const computedColumnDetails = tableNameSource?.fields?.map(items => {
      if (items.name === 'Id') {
        return {
          field: 'id',
          headerName: items.name,
          width: 75,
        };
      }
      if(items.name === 'Status'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          width: width ?? 250,
          valueGetter: (params) => {
            if(isWhiteSpace(params.value)){
              return params.value
            } else {
              return statusOptionsText[params.value]
            }
          }
        }
      }
      if(items.type === 'DateTime'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          type: 'dateTime',
          width: ColumnWidthMap[items.name] ?? 150,
          valueGetter: (params) => {
            return dayjs(params.value).toDate()
          }
        };
      }
      if(ColumnHeadersMap[items.name]){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          type: parseTypes(items.type),
          width: ColumnWidthMap[items.name] ?? 150,
        };
      }
      return {
        field: items.name,
        headerName: items.name,
        type: parseTypes(items.type),
        width: width ?? 150,
      };
    });

    // console.log('STM context-DataTableContext.jsx:111', computedColumnDetails, computedColumnNames); // todo remove dev item
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

  const getSongNumbersWithoutRecords = async () => {
    const res = await axios.get(`${base_url}/getAvailableSongNumbers`);
    console.log('STM context-DataTableContext.jsx:175', res); // todo remove dev item
    setNextTwentyCatalogNumbers(res.data.slice(0,20))
    return res.data.slice(0,20)
    // getAvailableSongNumbers
  }

  useEffect(() => {
    const setupData = async () => {
     await getColumnNames()
          .then(getData)
          .then(getCrossData)
          .then(getExistingBuckets)
          .then(getSongNumbersWithoutRecords)
    }
    setupData()

    // getExistingBuckets()
    // getSongNumbersWithoutRecords()
  }, []);


  const allDataRefresh = () => {
    getData()
    getExistingBuckets()
    getSongNumbersWithoutRecords()
  }

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
      allDataRefresh,
      getData,
      getCrossData,
      getExistingBuckets,
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
      columnDetails,
      generatedSets,
      nextTwentyCatalogNumbers,
      getSongNumbersWithoutRecords
    }}>
      {children}
    </DataTableData.Provider>
  );
};


export default DataTableContext;
