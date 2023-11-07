import {DataGrid} from '@mui/x-data-grid';


export function SimpleDataGrid({rows, columns, onRowClick = () => {}}) {

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] h-[40rem] border border-gray-400 rounded-xl ">
        <DataGrid
          rows={rows}
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
