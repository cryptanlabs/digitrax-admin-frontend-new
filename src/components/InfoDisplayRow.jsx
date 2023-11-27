import {Box, MenuItem, Select, TextField, Typography} from '@mui/material';
import {
  dropDownColumns,
  dropDownOptionMap,
  dropDownOptionSets, statusOptionsText,
} from '../helpers/constants.js';


export function InfoDisplayRow ({infoToDisplay, headerMap, handleChange = () => { }, title = '', subTitle = '', multiRow }) {

  try {
    let infoToDisplayLocal = {};
    if (multiRow) {
      if (Array.isArray(infoToDisplay) && infoToDisplay?.length > 0) {
        infoToDisplayLocal = infoToDisplay[0];
      } else {
        infoToDisplayLocal = infoToDisplay;
      }
    } else {
      infoToDisplayLocal = infoToDisplay;
    }

    const calculateWidths = Math.floor(200 / Object.keys(infoToDisplayLocal)?.length);


    const DropDownType = ({keyValue, value, onChange}) => {
      let options = [];

      if (dropDownColumns.includes(keyValue)) {
        options = dropDownOptionSets[dropDownOptionMap[keyValue]];
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Select
            sx={{marginTop: 1}}
            name={keyValue}
            value={value}
            onChange={onChange}
          >
            {options.map((value, index) => (
              <MenuItem key={index} value={value}>{statusOptionsText[value] ?? value}</MenuItem>
            ))}
          </Select>
        </Box>
      );
    };

    const shouldUseDropDown = (val) => {
      return dropDownColumns.includes(val);
    };

    const DetailRow = ({keyValue, detailValue}) => {

      return (
        <Box
          sx={{
            borderTop: '1px solid #D1D5DB',
            py: 2,
            px: 3
          }}
        >
          <Box>
            {shouldUseDropDown(keyValue) ? (
              <DropDownType
                keyValue={keyValue}
                value={detailValue}
                onChange={handleChange}
              />
            ) : (
              <TextField
                sx={{marginTop: 1, width: '90%'}}
                size="small"
                hiddenLabel
                name={keyValue}
                onChange={handleChange}
                value={detailValue}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      );
    };

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mb: 3
          }}
        >
          <Typography sx={{fontWeight: 'bold'}}>
            {title}
          </Typography>
          <Typography>{subTitle}</Typography>
        </Box>

        {/* Information */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            border: '1px solid #D1D5DB',
            borderRadius: 1
          }}
        >
          {Object.keys(infoToDisplayLocal).map((key, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRight: index === Object.keys(infoToDisplayLocal).length - 1 ? 'none' : '1px solid #D1D5DB',
                width: `${calculateWidths}%`
              }}
            >
              <Box
                sx={{
                  py: 1
                }}
              >
                <div style={{textAlign: 'center'}}>
                  {headerMap ? headerMap[key] : key}
                </div>
              </Box>
              {!multiRow ? (
                <DetailRow
                  keyValue={key}
                  detailValue={infoToDisplayLocal[key]}
                  onChange={handleChange}
                />
              ) : infoToDisplay.map((entry, idx) => (
                <DetailRow
                  key={`${key}-${idx}`}
                  keyValue={key}
                  detailValue={entry[key]}
                  onChange={handleChange}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  } catch (e) {
    console.error(e)
    return null;
  }
}
