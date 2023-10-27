import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "../components/Searchbar";
import { useState, useContext } from "react";
import { Typography, Paper, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {DataTableData} from '../context/DataTableContext'

const Dashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const {currentDataSet, columnNames, columnDetails} = useContext(DataTableData);

  const columns = columnDetails
  const headers = columnNames ?? [
    "ID",
    "gnrId",
    "isoId",
    "sgmId1",
    "sgmId2",
    "catDescription",
    "catRecordingIdNumber",
    "catRecordingTitle",
    "catInTheStyleOfArtist",
    "catHfaSongCode",
    "catISWC",
    "catRecordingType",
    "catRecordingArtist",
    "catLabel",
    "catISRCCAMixVocal",
    "catISRCCCMixKaraoke",
    "catISRCCDMixInstrumental",
    "catISRCAAMixVocal",
    "catISRCACMixKaraoke",
    "catISRCADMixInstrumental",
    "catReleaseYear",
    "catDuration",
    "catGenre",
    "catSongKey",
    "catHFALicenseNumber",
    "catMechanicalRegistrationNumberA",
    "catMechanicalRegistrationNumberC",
    "catMechanicalRegistrationNumberD",
    "catUpdatedAt",
    "catCreatedAt",
    "catSentForIngestion",
    "catSongCrossId",
    "catCheckMixes",
    "catCrossIdA",
    "catCrossIdC",
    "catCrossIdD",
    "catTimestamp",
  ];

  const data = Array.from(Array(10).keys());

  console.log('STM pages-Dashboard.jsx:58', currentDataSet); // todo remove dev item

  return (
    <div>
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-10 font-medium">
          Catalogue Management Dashboard
        </h1>
        <div className="flex items-center px-2 w-1/4 justify-between mr-3">
          <SearchIcon
            onClick={() => setShowSearch((prev) => !prev)}
            className="cursor-pointer"
          />
          <Button
            variant="outlined"
            startIcon={<MenuIcon />}
            sx={{
              borderColor: "gray",
              color: "black",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#F5F7F8",
              },
            }}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortByAlphaIcon />}
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
          {showSearch && <SearchBar />}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-[95%] h-[40rem] border border-gray-400 rounded-xl overflow-x-scroll overflow-y-scroll scrollbar">
          <DataGrid
            rows={currentDataSet}
            columns={columns}
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
          {/*
          <Grid container  wrap="nowrap">
             Table Headers
            <Grid
              item
              container
              spacing={2}
              wrap="nowrap"
            >
              {headers.map((header, index) => (
                <Grid
                  item
                  key={index}
                  style={{
                    height: 60,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid grey",
                    minWidth: 350

                  }}
                >
                  <Typography style={{ color: "#696969", marginRight: 5, fontSize: 15 }} variant="h6">
                    {header}
                  </Typography>
                  <ArrowDownwardIcon style={{color: 'gray'}} />
                </Grid>
              ))}
            </Grid>
          </Grid>*/}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
