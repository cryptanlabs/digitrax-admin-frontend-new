import {createContext, useEffect, useState} from 'react';
import axios from 'axios'

export const DataTableData = createContext(undefined);

const excludeFields = [
  "Id",
  "Writer",
  "Artist",
  "HFASongCode",
  "ISWC",
  "RecordingType",
  "RecordingArtist",
  "RecordingIdNumber",
  "RecordingTitle",
  "Label",
  "ISRCCAMixVocal",
  "ISRCCCMixKaraoke",
  "ISRCCDMixInstrumental",
  "ISRCAAMixVocal",
  "ISRCACMixKaraoke",
  "ISRCADMixInstrumental",
  "HFALicenseNumber",
  "MechanicalRegistrationNumberA",
  "MechanicalRegistrationNumberC",
  "MechanicalRegistrationNumberD",
  "SongCrossId",
  "CheckMixes",
  "CrossIdA",
  "CrossIdC",
  "CrossIdD",
  "CreatedAt",
  "UpdatedAt",
  "SubGenre",
  "Description",
  "ReleaseYear"
]

const DataTableContext = ({children}) => {
  const [currentDataSet, setCurrentDataSet] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(1);
  const [currentTable, setCurrentTable] = useState('SongCatalog');
  const [columnNames, setColumnNames] = useState(undefined);
  const [columnDetails, setColumnDetails] = useState([]);
  const base_url = 'http://localhost:3000'
  const getData = async () => {
    const res = await axios.get(`${base_url}/catalogInternal?limit=-1`)
    const lowercaseId = res?.data?.data?.map(item => {

      return {id:item.Id, ...item}
    })
    setCurrentDataSet(lowercaseId)
    setTotalResults(res.data.totalResults)
    setTotalPages(res.data.totalPages)
    setNextPage(res.data.nextPage)

    console.log(res)


  }


  const getColumnNames = async () => {
    const res = await axios.get(`${base_url}/columnNames`)
    setCurrentTable('SongCatalog')
    const columns = res.data?.datamodel?.models?.find(item => item.name = 'SongCatalog')?.fields?.map(items => items.name)

    const columns2 = res.data?.datamodel?.models?.find(item => item.name = 'SongCatalog')?.fields?.filter(item => !excludeFields.includes(item.name)).map(items => {
      if(items.name === 'Id'){
        return {
          field: 'id',
          headerName: items.name,
          width: 75,
        }
      }
      return {
        field: items.name,
        headerName: items.name,
        flex: 0.5
      }
    })
    setColumnDetails(columns2)
    console.log('STM context-DataTableContext.jsx:43', columns2); // todo remove dev item
    setColumnNames(columns)
    console.log(res)
    console.log('STM context-DataTableContext.jsx:31', columns); // todo remove dev item
  }

  useEffect(() => {
    getData()
    getColumnNames()
  }, []);



  return (
    <DataTableData.Provider value={{currentDataSet, nextPage, totalPages, totalResults, columnNames, columnDetails}}>
      {children}
    </DataTableData.Provider>
  )
}


export default DataTableContext
