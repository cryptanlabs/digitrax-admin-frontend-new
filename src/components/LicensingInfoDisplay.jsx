import {TextField, Typography} from '@mui/material';


export function LicensingInfoDisplay({publishingHeaders, licensingInfoDisplay, handleChange, basicInformation}){

  try {
    return (
      <>
        <div className="w-full mt-20 flex">
          <div className="flex flex-col ml-20">
            <Typography sx={{fontWeight: 'bold'}}>
              Publishing Information
            </Typography>
            <Typography>Update the publishing information here</Typography>
          </div>
        </div>
        <div className="w-[90%] mt-10 flex flex-col border-2 border-black rounded-lg border-gray-300">
          <div className="w-full h-10 border-b flex border-gray-300">
            {publishingHeaders.map((header, index) => (
              <div
                key={index}
                className="w-[20%] flex items-center justify-center border-r border-gray-400 last:border-r-0"
              >
                <Typography sx={{fontSize: 14}}>{header}</Typography>
              </div>
            ))}
          </div>
          <div className="w-full h-20 flex">
            {/* publishingHeadersMappedToColumn */}
            {licensingInfoDisplay.map((header, index) => (
              <div
                key={index}
                className="w-[20%] h-full flex items-center justify-center border-r border-gray-400 "
              >
                <TextField
                  sx={{marginTop: 1, width: '90%'}}
                  size="small"
                  hiddenLabel
                  name={header.key}
                  onChange={handleChange}
                  value={basicInformation[header.key]}
                  variant="outlined"
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'LicensingInfoDisplay' Component</h1>
    )
  }
}
