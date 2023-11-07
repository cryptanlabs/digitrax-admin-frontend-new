import {
  DataGrid,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  GridToolbarContainer,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext
} from "@mui/x-data-grid";
import {createSvgIcon} from '@mui/material/utils';
import {Button} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

export function SimpleDataGrid({rows = [], columns = [], loading, onRowClick = () => {}}) {

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
    <div className="w-full flex justify-center">
      <div className="w-[95%] h-[40rem] border border-gray-400 rounded-xl ">
        <DataGrid
          rows={rows}
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
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  )
}
