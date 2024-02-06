import SearchBar from '../components/Searchbar';
import {useContext, useEffect, useState} from 'react';
import {DataTableData} from '../context/DataTableContext';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';

const CrossDashboard = () => {
  try {
    const [showSearch, setShowSearch] = useState(false);
    const {
      getCrossData,
      currentDataSet,
      crossClearDataSet,
      crossColumnDetails,
    } = useContext(DataTableData);
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      getCrossData()
        .then(() => {
          setIsLoading(false);
        })
    }, []);
    useEffect(() => {
      if (crossClearDataSet?.length > 0) {
        setIsLoading(false);
      }
      console.log('STM pages-CrossDashboard.jsx:21', crossClearDataSet); // todo remove dev item
      setFilteredResults(crossClearDataSet);
    }, [crossClearDataSet]);

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
        <SimpleDataGrid columns={crossColumnDetails} rows={filteredResults} onRowClick={() => {
        }} loading={isLoading}/>

      </div>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CrossDashboard' Page Component</h1>
    )
  }
};

export default CrossDashboard;
