import {Button, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useContext, useRef, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';
import ApiUsers from './ApiUsers.jsx';
import Users from './Users.jsx';
import UploadBatch from '../components/UploadBatch.jsx';
import UploadOrUpdateSingleColumn from '../components/UploadSingleColumn.jsx';
import {DataTableData} from '../context/DataTableContext.jsx';

export default function Upload () {
  const {columnNames} = useContext(DataTableData);
  const [isBatchUpload, setIsBatchUpload] = useState(true);

  const showOtherTypeOfUpload = () => {
    setIsBatchUpload(!isBatchUpload)
  }

  return (
    <>
      <div className="w-full flex ">
        <div className="w-[90%] flex flex-row mt-10 items-center justify-center">
          <Button
            variant="outlined"
            onClick={showOtherTypeOfUpload}
            sx={{
              marginRight: '100px',
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Add multiple songs
          </Button>
          <Button
            variant="outlined"
            onClick={showOtherTypeOfUpload}
            sx={{
              marginRight: '15px',
              borderColor: '#00b00e',
              backgroundColor: '#00b00e',
              color: 'white',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#86A789',
              },
            }}
          >
            Upload or Update a Column
          </Button>
        </div>
      </div>
      {isBatchUpload && <UploadBatch/>}
      {!isBatchUpload && <UploadOrUpdateSingleColumn columnNames={columnNames}/>}
    </>
  );
}
