import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchBar from "../components/Searchbar";
import { useState } from "react";

const Dashboard = () => {
  const [showSearch, setShowSearch] = useState(false)
  
    return (
    <div>
      <div className="w-full mt-4 flex items-center justify-between">
        <h1 className="text-4xl ml-10 font-medium">
          Catalogue Management Dashboard
        </h1>
        <div className="flex items-center px-2 w-1/4 justify-between mr-3">
          <SearchIcon onClick={() => setShowSearch(prev => !prev)} className="cursor-pointer" />
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
      <div className="w-full h-20 mt-10 flex items-center justify-between ">
        <h1 className="text-xl ml-8 font-medium">Catalogue</h1>
        <div className="w-1/5 mr-8 flex items-center justify-center">
        {showSearch && <SearchBar />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
