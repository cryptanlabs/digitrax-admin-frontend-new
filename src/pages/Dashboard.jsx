import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { createSvgIcon } from '@mui/material/utils';
import LinearProgress from '@mui/material/LinearProgress';
import SearchBar from "../components/Searchbar";
import { useState, useContext, useEffect } from "react";
import {
  DataGrid,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext
} from "@mui/x-data-grid";
import { DataTableData } from "../context/DataTableContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { currentDataSet, columnDetails, addToRecentSongs } = useContext(DataTableData);
  const [filteredResults, setFilteredResults] = useState([]);
  const [sortInstructions, setSortIntructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if(currentDataSet?.length > 0) setIsLoading(false)
    setFilteredResults(currentDataSet);
  }, [currentDataSet]);

  const columns = columnDetails;

  useEffect(() => {
    console.log("Columns", columns);
  }, []);

  const sortTitlesAlphabetically = () => {
    const sortedArray = [...currentDataSet].sort((a, b) => {
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
    console.log('STM pages-Dashboard.jsx:56', params); // todo remove dev item
    const rowData = params.row;
    addToRecentSongs(params.row.SongNumber)
    navigate("/songdata", { state: { rowData } });
  };

  const handleCellClick = (params) => {
    console.log('STM pages-Dashboard.jsx:56', params); // todo remove dev item
  };

  const getRowsFromCurrentPage = ({ apiRef }) =>
    gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

  const getUnfilteredRows = ({ apiRef }) => gridSortedRowIdsSelector(apiRef);

  const getFilteredRows = ({ apiRef }) => gridExpandedSortedRowIdsSelector(apiRef);

  const ExportIcon = createSvgIcon(
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
    'SaveAlt',
  );

  function CustomToolbar() {
    const apiRef = useGridApiContext();

    const handleExport = (options) => apiRef.current.exportDataAsCsv(options);

    const buttonBaseProps = {
      color: 'primary',
      size: 'small',
      startIcon: <ExportIcon />,
    };

    return (
      <GridToolbarContainer>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
        >
          Current page rows
        </Button>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
        >
          Filtered rows
        </Button>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
        >
          Unfiltered rows
        </Button>
      </GridToolbarContainer>
    );
  }


  return (
    <div>
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-10 font-medium">
          Catalogue Management Dashboard
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
              currentDataSet={currentDataSet}
              filteredResults={filteredResults}
              setFilteredResults={setFilteredResults}
            />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-[95%] h-[40rem] border border-gray-400 rounded-xl ">

          <DataGrid
            rows={filteredResults}
            slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                "&::-webkit-scrollbar": {
                  width: 5,
                  height: 5,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "grey",
                  borderRadius: "5px",
                },
              },
            }}
            loading={isLoading}
            columns={columns}
            onRowClick={handleRowClick}
            onCellClick={handleCellClick}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
