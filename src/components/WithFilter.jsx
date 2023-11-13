import {MenuItem, Select, TextField, Typography} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';


export default function WithFilters ({field, fieldType, queryFieldModifiers, setQueryFieldModifiers, queryFields, setQueryFields}) {
  // const fieldType = availableFields[field]
  const isNumeric = ['Int', 'Decimal'].includes(fieldType)
  const isBoolean = fieldType === "Boolean";
  const isDate = fieldType === 'DateTime'



  if(isBoolean){
    return (
      <div className="flex flex-col ml-20 mt-2 w-[15%]">
        <Typography sx={{fontWeight: 'bold'}}>{field}</Typography>
        <Select
          sx={{marginTop: 1}}
          name={field}
          value={queryFields[field]}
          onChange={setQueryFields}
        >
          {['true','false'].map((value, index) => (
            <MenuItem key={index} value={value}>{value}</MenuItem>
          ))}
        </Select>
      </div>
    )
  }

  if(isDate){
    return (
      <div className="flex flex-col ml-20 mt-2 w-[15%]">
        <Typography sx={{fontWeight: 'bold'}}>{field}</Typography>
        <div className="flex flex-row">
          <Select
            sx={{marginTop: 1}}
            name={field}
            value={queryFieldModifiers[field]}
            onChange={setQueryFieldModifiers}
          >
            {['=', '>','>=','<','<='].map((value, index) => (
              <MenuItem key={index} value={value}>{value}</MenuItem>
            ))}
          </Select>
          <DatePicker
            sx={{marginTop: 1}}
            value={queryFields[field]}
            onChange={(val) => {setQueryFields({target: {value: val, name: field}})}}
          />
        </div>

      </div>
    )
  }


  return (
    <div className="flex flex-col ml-20 mt-2 w-[15%]">
      <Typography sx={{fontWeight: 'bold'}}>{field}</Typography>
      <div className="flex flex-row">
        {isNumeric && <Select
          sx={{marginTop: 1}}
          name={field}
          value={queryFieldModifiers[field]}
          onChange={setQueryFieldModifiers}
        >
          {['=', '>','>=','<','<='].map((value, index) => (
            <MenuItem key={index} value={value}>{value}</MenuItem>
          ))}
        </Select>}
        <TextField
          sx={{marginTop: 1}}
          hiddenLabel
          name={field}
          value={queryFields[field]}
          onChange={setQueryFields}
          variant="outlined"
        />
      </div>
    </div>
  )
}
