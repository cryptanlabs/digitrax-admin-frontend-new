import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';

const ExportDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {
      columnDetails,
      crossClearDataSet,
      allSelected,
      setAllSelected
    } = useContext(DataTableData);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

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
