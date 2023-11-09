import {Button, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';
import {useRef, useState} from 'react';
import {SimpleDataGrid} from '../components/SimpleDataGrid.jsx';

export default function UploadBatch () {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const formData = new FormData();

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log('STM pages-Reports.jsx:16', file); // todo remove dev item
    if (file) {
      setSelectedFile(file);
      formData.append(
        'batch',
        file
      );

      const result = await axiosBase({
        method: 'post',
        url: '/convertCsv',
        data: formData
      })
        .catch(error => {
          console.log(error);
        });

      console.log('STM pages-Upload.jsx:34', result.data); // todo remove dev item
      console.log('STM pages-Reports.jsx:32', result); // todo remove dev item
      const rowsTemp = result.data.map((item, index) => {
        item.id = index;
        return item;
      });

      setColumnHeaders(Object.keys(result.data[0]))

      const columnsTemp = Object.keys(result.data[0]).map((item, index) => {
        return {
          field: item,
          headerName: item,
          width: 150
        };
      });
      setRowData(rowsTemp);
      setColumns(columnsTemp);
      return result.data;

    }

  };

  return (
    <div>
      <div className="w-full mt-4 flex flex-col items-center justify-between">
        <div className="w-full mt-4 flex items-center justify-between">
          <div className="flex flex-col ml-20">
            <h1 className="text-4xl ml-10 font-medium">
              UpLoad (In progress)
            </h1>
            <div className="flex-1 pb-5">
              <Button
                variant="outlined"
                onClick={handleFileUploadClick}
                sx={{
                  marginTop: '30px',
                  borderColor: 'gray',
                  color: 'black',
                  height: '60px',
                  backgroundColor: '#00b00e',
                  '&:hover': {
                    borderColor: '#F1EFEF',
                    backgroundColor: '#F5F7F8',
                  },
                }}
              >
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="text/csv"
              />
            </div>

          </div>
        </div>
        <SimpleDataGrid
          rows={rowData}
          columns={columns}
        />
      </div>
    </div>
  );
}
