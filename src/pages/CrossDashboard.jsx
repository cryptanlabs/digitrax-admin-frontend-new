import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "../components/Searchbar";
import { useState, useContext, useEffect } from "react";
import { DataGrid, GridToolbarExport  } from "@mui/x-data-grid";
import { DataTableData } from "../context/DataTableContext";
import { useNavigate } from "react-router-dom";
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';

const CrossDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { currentDataSet, crossClearDataSet, crossColumnDetails, addToRecentSongs } = useContext(DataTableData);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortInstructions, setSortIntructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if(currentDataSet?.length > 0) setIsLoading(false)
    setFilteredResults(crossClearDataSet);
  }, [crossClearDataSet]);

  const columns = crossColumnDetails;

  useEffect(() => {
    console.log("Columns", columns);
  }, []);

  const sortTitlesAlphabetically = () => {
    const sortedArray = [...crossClearDataSet].sort((a, b) => {
      const titleA = a.Title.toLowerCase();
      const titleB = b.Title.toLowerCase();

      if (titleA < titleB) return sortInstructions ? 1 : -1;
      if (titleA > titleB) return sortInstructions ? -1 : 1;
      return 0;
    });

    setFilteredResults(sortedArray);
    setSortIntructions((prev) => !prev);
  };

  const handleRowClick = (params) => {
    const rowData = params.row.SongCatalog;
    const crossData = params.row
    addToRecentSongs(params.row.SongNumber)
    navigate("/songdata", { state: { crossData, rowData, SongNumber: params.row.songNumber } });
  };

  console.log("STM pages-Dashboard.jsx:58", crossClearDataSet);

  return (
    <div>
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-10 font-medium">
          All CrossClear Reported Information
        </h1>
        <div className="flex items-center px-2 w-1/6 justify-between mr-3">
          <SearchIcon
            onClick={() => setShowSearch((prev) => !prev)}
            className="cursor-pointer"
          />
          <Button
            variant="outlined"
            startIcon={<SortByAlphaIcon />}
            onClick={sortTitlesAlphabetically}
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Sort
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="w-full h-20 mt-5 flex items-center justify-between ">
        <h1 className="text-xl ml-8 font-medium">Catalogue</h1>
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
      <SimpleDataGrid columns={columns} rows={filteredResults} onRowClick={() => {}} loading={isLoading}/>

    </div>
  );
};

export default CrossDashboard;
