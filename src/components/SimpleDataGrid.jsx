import {
  DataGrid,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext
} from '@mui/x-data-grid';
import {createSvgIcon} from '@mui/material/utils';
import {Button} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import {useState} from 'react';

export function SimpleDataGrid ({
                                  rows = [],
                                  columns = [],
                                  loading,
                                  onRowClick = () => {},
                                  columnVisibilityModel,
                                  autoHeight,
                                  rowSelectionModel = [],
                                  setRowSelectionModel = () => {},
                                  checkboxSelection
                                }) {

  //
  const getRowsFromCurrentPage = ({apiRef}) =>
    gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

  const getUnfilteredRows = ({apiRef}) => gridSortedRowIdsSelector(apiRef);

  const getFilteredRows = ({apiRef}) => gridExpandedSortedRowIdsSelector(apiRef);

  const ExportIcon = createSvgIcon(
    <path
      d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>,
    'SaveAlt',
  );

  function CustomToolbar () {
    const apiRef = useGridApiContext();

    const handleExport = (options) => apiRef.current.exportDataAsCsv(options);

    const buttonBaseProps = {
      color: 'primary',
      size: 'small',
      startIcon: <ExportIcon/>,
    };

    return (
      <GridToolbarContainer>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport()}
        >
          All
        </Button>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({getRowsToExport: getRowsFromCurrentPage})}
        >
          Current page rows
        </Button>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({getRowsToExport: getFilteredRows})}
        >
          Filtered rows
        </Button>
        <Button
          {...buttonBaseProps}
          onClick={() => handleExport({getRowsToExport: getUnfilteredRows})}
        >
          Unfiltered rows
        </Button>
      </GridToolbarContainer>
    );
  }

  const propObject = {
    rows: rows.map((item, index) => {
      if(item.id){
        return item
      } else if(item.Id){
        item.id = item.Id
        return item
      } else {
        item.id = index
        return item
      }

    }),
    slots: {toolbar: CustomToolbar, loadingOverlay: LinearProgress},
    loading: loading,
    columns: columns,
    onRowClick: onRowClick,
    initialState: {
      pagination: {
        paginationModel: {
          pageSize: 20,
        },
      },
    }
  };

  if (columnVisibilityModel) {
    propObject.initialState.columns = {columnVisibilityModel}
  }

  if(autoHeight){
    propObject.autoHeight = true
  }

  if(rowSelectionModel && setRowSelectionModel){
    propObject.onRowSelectionModelChange = (newRowSelectionModel) => {
      console.log('STM components-SimpleDataGrid.jsx:96', newRowSelectionModel); // todo remove dev item
      setRowSelectionModel(newRowSelectionModel);
    }
    propObject.rowSelectionModel = rowSelectionModel
  }

  if(checkboxSelection){
    propObject.checkboxSelection = true
  }


  return (
    <div className="w-full flex justify-center mb-5">
      <div className={`w-[95%] ${autoHeight ? "" : "h-[40rem]"} border border-gray-400 rounded-xl`}>
        <DataGrid

          rows={rows}
          // slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
          sx={{
            '& .MuiDataGrid-virtualScroller': {
              '&::-webkit-scrollbar': {
                width: 9,
                height: 9,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey',
                borderRadius: '5px',
              },
            },
          }}
          loading={loading}
          columns={columns}
          onRowClick={onRowClick}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[5]}

          disableRowSelectionOnClick
          {...propObject}
        />
      </div>
    </div>
  );
}
