import {MenuItem, Select, TextField, Typography} from '@mui/material';
import {
  dropDownColumns,
  dropDownOptionMap, dropDownOptionSets,
} from '../helpers/constants.js';


export function InfoDisplayRow({infoToDisplay, headerMap, handleChange = () => {}, title = '', subTitle = ''}){

  const calculateWidths = Math.ceil(100/Object.keys(infoToDisplay)?.length);


  const DropDownType = ({keyValue, value, onChange}) => {
    let options = []

    if(dropDownColumns.includes(keyValue)){
      options = dropDownOptionSets[dropDownOptionMap[keyValue]]
    }

    return (
      <div className="w-[90%]">
        <Select
          sx={{ marginTop: 1 }}
          name={keyValue}
          value={value}
          onChange={onChange}
        >
          {options.map((value, index) => (
            <MenuItem key={index} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </div>
    )
  }

  const shouldUseDropDown = (val) => {
    return dropDownColumns.includes(val)
  }

  return (
    <>
      <div className="w-full mt-20 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <Typography>{subTitle}</Typography>
        </div>
      </div>
      <div className="w-[90%] mt-10 flex flex-row flex-1 border-2 rounded-lg border-gray-300">
        {Object.keys(infoToDisplay).map((key, index) => (
          <div key={index} className={`w-[${calculateWidths}%] h-full flex flex-col  items-center justify-start border-b border-gray-300`}>
            <div key={index} className={`w-full h-10 pt-2 border-b border-r border-gray-400`}>
              <div style={{textAlign: 'center'}}>
                {headerMap ? headerMap[key] : key}
              </div>
            </div>
            <div className="w-full h-20 flex items-center justify-center border-r border-gray-400">
              <div style={{textAlign: 'center'}}
                className=" h-full   pt-3  "
              >
                {shouldUseDropDown(key) ? (
                  <DropDownType
                    keyValue={key}
                    value={infoToDisplay[key]}
                    onChange={handleChange}
                    />
                ) : (
                    <TextField
                      sx={{ marginTop: 1, width: "90%" }}
                      size="small"
                      hiddenLabel
                      name={key}
                      onChange={handleChange}
                      value={infoToDisplay[key]}
                      variant="outlined"
                    />
                  )}

              </div>
            </div>
          </div>
        ))}

      </div>
    </>
  )
}
