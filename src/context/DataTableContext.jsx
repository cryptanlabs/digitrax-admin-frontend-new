import {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {axiosBase, axiosBaseWithKey, base_url, returnLimit} from '../helpers/requests.js';
import {ColumnHeadersMap, ColumnWidthMap, statusOptionsText} from '../helpers/constants.js';
import {isWhiteSpace} from '../helpers/utils.js';
import dayjs from 'dayjs';
import {UserContext} from './UserContext.jsx';

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
  const [backgroundStatus, setBackgroundStatus] = useState(true);
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
  const [genres, setGenres] = useState([]);

  const [allSelected, setAllSelected] = useState([]);

  const {user, adminDashToken, loggedIn} = useContext(UserContext);
  const getData = async () => {

    if(fetchingData) return
    setFetchingData(true)
    setBackgroundStatus(true)
    try {
      const baseOrdering = 'SongNumber' // 'SongReleaseYear'
      const baseOrderDirection = 'asc' //'desc'
      const res = await axiosBaseWithKey(adminDashToken)({
        method: 'get',
        url: `/catalogInternal?orderBy=${baseOrdering}&limit=${returnLimit}&orderDir=${baseOrderDirection}`,
      })

      // (`${base_url}/catalogInternal?orderBy=${baseOrdering}&limit=${returnLimit}&orderDir=${baseOrderDirection}`);
      const lowercaseId = res?.data?.data?.map(item => {

        return {id: item.Id, ...item};
      });
      setCurrentDataSet(lowercaseId);
      setTotalResults(res.data.totalResults);
      setTotalPages(res.data.totalPages);
      setNextPage(res.data.nextPage);

      console.log('Result:', res);
      setFetchingData(false)
      setBackgroundStatus(false)
    } catch (e) {
      console.error(e)
      setFetchingData(false)
      setBackgroundStatus(false)
    }


  };

  const getExistingBuckets = () => {
    axiosBaseWithKey(adminDashToken)({
      method: 'get',
      url: '/getExistingBuckets',
    })
      .then(response => {
        const buckets = response.data?.map(item => item.bucket);
        setGeneratedSets(buckets);
      });
  }

  const getBuckets = () => {
    return axiosBaseWithKey(adminDashToken)({
      method: 'get',
      url: '/getBuckets',
    })
      .then(response => {
        const buckets = response.data?.reduce((acc, cur) => {
          acc[cur.bucketType].push(cur.bucketName)
          return acc
        }, {bucket: [], folder: []});
        setBucketList(buckets);
        return buckets
      });
  }

  const getGenres = async () => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      timeout: 30000,
      url: '/getGenres',
    })
    console.log('STM context-DataTableContext.jsx:123', result); // todo remove dev item
    setGenres(result.data)
  }

  // getBuckets

  const getCrossData = async () => {

    if(!fetchingCrossClear){
      try {
        setBackgroundStatus(true)
        setFetchingCrossClear(true);
        const res = await axiosBaseWithKey(adminDashToken)({
          method: 'get',
          url: '/getCrossClear',
        })
        const lowercaseId = res?.data?.result?.map(item => {

          return {id: item.Id, ...item};
        });
        console.log('STM context-DataTableContext.jsx:143', lowercaseId); // todo remove dev item
        setCrossClearDataSet(lowercaseId);

        console.log('Result getCrossData:', res);
        setFetchingCrossClear(false);
        setBackgroundStatus(false)
      } catch (e) {
        console.error(e)
        setFetchingCrossClear(false);
        setBackgroundStatus(false)
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
      if(items.name === 'ApiKey'){
        return {
          field: items.name,
          headerName: items.name,
          width: 300,
        }
      }
      if(items.name === 'ReleaseScheduledFor'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          type: 'dateTime',
          width: ColumnWidthMap[items.name] ?? 150,
          renderCell: (params) => {
            if(!params.value){
              return null
            }
            return (<span>{dayjs(params.value).format('MM/DD/YYYY')} </span>)
          },
          valueGetter: (params) => {
            if(!params.value){
              return undefined
            }
            if(dayjs(params.value).isBefore(dayjs('1950-01-01'))){
              return undefined
            }
            return dayjs(params.value).toDate()
          },
          valueFormatter: (params) => {
            if(!params.value){
              return undefined
            }
            if(dayjs(params.value).isBefore(dayjs('1950-01-01'))){
              return undefined
            }
            return dayjs(params.value).format('MM/DD/YYYY')
          }
        };
      }
      if(items.type === 'DateTime'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          type: 'dateTime',
          width: ColumnWidthMap[items.name] ?? 150,
          // valueGetter: (params) => {
          //   return dayjs(params.value).toDate()
          // },
          valueFormatter: (params) => {
            return dayjs(params.value).format('MM/DD/YYYY')
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
      if(items.name === 'SongReleaseYear' || items.name === 'year'){
        return {
          field: items.name,
          headerName: ColumnHeadersMap[items.name],
          type: 'string',
          width: ColumnWidthMap[items.name] ?? 150,
          renderCell: (params) => {
            if(!params.value){
              return null
            }
            return (<span>{params.value} </span>)
          },
          valueGetter: (params) => {
            if(params.value > 0){
              return params.value
            }
            return undefined
          },
          valueFormatter: (params) => {
            if(params.value > 0){
              return params.value?.toString()
            }
            return undefined
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

    const cols = [
      'SongNumber',
      'Title',
      'InTheStyleOfArtist',
      'Genre',
      'SubGenre',
      'SongReleaseYear',
      'DateAdded',
      'ReleaseScheduledFor',
      'CrossIdA',
      'CrossIdC',
      'CrossIdD'
    ]

    const sortedComputedColumnDetails = computedColumnDetails.sort((a,b,) => {
      const includesA = cols.includes(a.field)
      const includesB = cols.includes(b.field)
      if(includesA && !includesB){
        return -1;
      }
      if(includesB && !includesA){
        return 1;
      }
      if(includesB && includesA){
        return cols.indexOf(a.field) - cols.indexOf(b.field)
      }
      return 0
    })

    return [sortedComputedColumnDetails, computedColumnNames]
  }

  const getColumnNames = async () => {
    const res = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      url: '/columnNames',
    })
    setDataModels(res.data?.datamodel);

    const [columns2, columns] = getColumnNamesAndHeaderDetails('SongCatalog', res.data?.datamodel)
    setColumnDetails(columns2);
    setColumnNames(columns);
    console.log(res);

    const [columns2CrossClear, columnCrossClear] = getColumnNamesAndHeaderDetails(3, res.data?.datamodel, {width: 250})
    setCrossColumnNames(columnCrossClear)
    setCrossColumnDetails(columns2CrossClear)
  };

  const getColumnNamesFor = async (tableName) => {
    const res = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      url: '/columnNames',
    })

    return getColumnNamesAndHeaderDetails(tableName, res.data?.datamodel)
  };

  const getSongNumbersWithoutRecords = async () => {
    setBackgroundStatus(true)
    const res = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      url: '/getAvailableSongNumbers',
    })
    setNextTwentyCatalogNumbers(res.data.slice(0,20))
    setBackgroundStatus(false)
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
      .then(getGenres)
      .then(getSongNumbersWithoutRecords)
      .then(getBuckets)
  }

  useEffect(() => {

    if(loggedIn){
      getColumnNames()
        .then(getData)
        .then(getGenres)
      getPriorRecentSongs()
    }

    // setupData()

    // getExistingBuckets()
    // getSongNumbersWithoutRecords()
  }, [loggedIn]);


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
      backgroundStatus,
      setBackgroundStatus,
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
      setupData,
      getGenres,
      genres,
      getColumnNamesFor
    }}>
      {children}
    </DataTableData.Provider>
  );
};


export default DataTableContext;
