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
  const [bucketList, setBucketList] = useState({bucket: [], folder: []});

  const [allSelected, setAllSelected] = useState([]);
  const getData = async () => {

    if(fetchingData) return
    setFetchingData(true)
    try {
      const baseOrdering = 'SongNumber' // 'SongReleaseYear'
      const baseOrderDirection = 'asc' //'desc'
      const res = await axios.get(`${base_url}/catalogInternal?orderBy=${baseOrdering}&limit=${returnLimit}&orderDir=${baseOrderDirection}`);
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
        setGeneratedSets(buckets);
      });
  }

  const getBuckets = () => {
    return axiosBase({
      method: 'get',
      url: '/getBuckets',
    })
      .then(response => {
        const buckets = response.data?.reduce((acc, cur) => {
          console.log('STM context-DataTableContext.jsx:106', cur.bucketType); // todo remove dev item
          acc[cur.bucketType].push(cur.bucketName)
          return acc
        }, {bucket: [], folder: []});
        setBucketList(buckets);
        return buckets
      });
  }

  // getBuckets

  const getCrossData = async () => {

    if(!fetchingCrossClear){
      try {
        setFetchingCrossClear(true);
        const res = await axios.get(`${base_url}/getCrossClear`);
        const lowercaseId = res?.data?.result?.map(item => {

          return {id: item.Id, ...item};
        });
        setCrossClearDataSet(lowercaseId);

        console.log('Result getCrossData:', res);
        setFetchingCrossClear(false);
      } catch (e) {
        console.error(e)
        setFetchingCrossClear(false);
      }
    }



  };


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
      if(items.name === 'GeneratedMedia'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          // type: 'dateTime',
          width: ColumnWidthMap[items.name] ?? 150,
          valueGetter: (params) => {
            const count = params?.row?.GeneratedMedia?.length
            return `${count || 0} Media Items`
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
    setNextTwentyCatalogNumbers(res.data.slice(0,20))
    return res.data.slice(0,20)
    // getAvailableSongNumbers
  }

  const getPriorRecentSongs = () => {
    const priorRecentSongs = window.localStorage.getItem('RecentSongs')
    if(priorRecentSongs){
      setRecentSongs(JSON.parse(priorRecentSongs))
    }
  }

  const setupData = async () => {
    await getColumnNames()
      .then(getData)
      .then(getCrossData)
      .then(getExistingBuckets)
      .then(getSongNumbersWithoutRecords)
  }

  useEffect(() => {
    getColumnNames()
      .then(getData)
    getPriorRecentSongs()
    // setupData()

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
      const tempArray = Array.from(new Set([...prev, song]))
      if (tempArray.length > 6) {
        tempArray.shift();
      }
      window.localStorage.setItem('RecentSongs', JSON.stringify([...tempArray]))
      return [...tempArray];
    });

  };



  return (
    <DataTableData.Provider value={{
      allDataRefresh,
      getData,
      getColumnNames,
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
      getSongNumbersWithoutRecords,
      allSelected,
      setAllSelected,
      bucketList,
      getBuckets,
      setupData
    }}>
      {children}
    </DataTableData.Provider>
  );
};


export default DataTableContext;
