import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import JSZip from 'jszip'
import {base_url} from '../helpers/requests.js';
import { saveAs } from 'file-saver';
import {SongDetailsContext} from '../context/SongDetailsContext.jsx';
import {UserContext} from '../context/UserContext.jsx';

const ExportDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {adminDashToken} = useContext(UserContext);
    const {
      columnDetails,
      crossClearDataSet,
      allSelected,
      setAllSelected
    } = useContext(DataTableData);

    const {
      handleNotifyOfError
    } = useContext(SongDetailsContext);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [buildingExport, setBuildingExport] = useState(false);


    // useEffect(() => {
    //   if (currentDataSet?.length > 0) {
    //     setIsLoading(false);
    //   }
    //   setFilteredResults(crossClearDataSet);
    // }, [crossClearDataSet]);

    const AddSelected = () => {
      const newlySelected = rowSelectionModel.reduce((acc, id) => {
        if (selectedIds.includes(id)) {
          return acc;
        }
        setSelectedIds((prev) => ([
          ...prev,
          id
        ]));
        const result = filteredResults.find(item => item.id === id);
        if (result) {
          acc.push(result);
        }
        return acc;
      }, []);

      setAllSelected((prev) => ([
        ...prev,
        ...newlySelected
      ]));
    };

    const handleExportAllMedia = async () => {
      setBuildingExport(true)
      try {
        const zip = new JSZip();
        console.log('STM pages-SongDetails.jsx:359', JSZip); // todo remove dev item
        console.log('STM pages-SongDetails.jsx:359', generatedMedia); // todo remove dev item
        const promises = [];
        for(let song of allSelected){
          for (let entry of generatedMedia) {
            console.log('STM pages-SongDetails.jsx:373', entry); // todo remove dev item
            const tempPromise = [Promise.resolve(entry), fetch(`${base_url}/fileGetInternal/${entry.requestString}`, {headers: {'x-access-token': adminDashToken}})];
            promises.push(Promise.all(tempPromise));
          }
        }


        const results = await Promise.all(promises);

        console.log('STM pages-SongDetails.jsx:381', results); // todo remove dev item
        console.log('STM pages-SongDetails.jsx:382', results[0]); // todo remove dev item

        for (let result of results) {
          if(result[1]?.ok){

            zip.file(result[0].location, result[1].arrayBuffer());
          } else {
            handleNotifyOfError({message: `Error requesting media file ${result[0].location}`})
          }
        }

        zip.generateAsync({type: 'blob'})
          .then(function (blob) {
            saveAs(blob, 'hello.zip');
            setBuildingExport(false);
          });
      } catch (e) {
        setBuildingExport(false)
        handleNotifyOfError(e)
      }
      // fetch(`${base_url}/fileGetInternal/${mediaItem.requestString}`)
    }

    useEffect(() => {
      // AddSelected();
      console.log('STM pages-Dashboard.jsx:81', rowSelectionModel); // todo remove dev item
    }, [rowSelectionModel]);

    return (
      <div>
        <div className="w-full mt-4 flex items-center justify-between">
          <h1 className="text-4xl ml-10 font-medium">
            All CrossClear Reported Information
          </h1>
        </div>
        <div className="w-full h-20 mt-5 flex items-center justify-between ">
          <h1 className="text-xl ml-8 font-medium">Catalog</h1>
          <div className="w-1/5 mr-8 flex items-center justify-center">
            {showSearch && (
              <SearchBar
                currentDataSet={crossClearDataSet}
                filteredResults={filteredResults}
                setFilteredResults={setFilteredResults}
              />
            )}
          </div>
        </div>
        <SimpleDataGrid
          columns={columnDetails}
          rows={allSelected}
          onRowClick={() => {}}
          loading={isLoading}
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          checkboxSelection
        />

      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CrossDashboard' Page Component</h1>
    );
  }
};

export default ExportDashboard;
