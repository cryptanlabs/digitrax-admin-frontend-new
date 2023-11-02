import {TextField, Typography} from '@mui/material';






function TextFields40Pct ({onChange, value, name, label}) {

  return (
    <div className="flex flex-col ml-20 w-[40%]">
    <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>
    <TextField
      sx={{ marginTop: 1 }}
      hiddenLabel
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
    />
  </div>
  )
}


function TextFields15Pct ({onChange, value, name, label})  {

  return (
    <div className="flex flex-col  w-[15%]">
      <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>
      <TextField
        sx={{ marginTop: 1 }}
        hiddenLabel
        name={name}
        value={value}
        onChange={onChange}
        variant="outlined"
      />
    </div>
  )
}




export {
  TextFields40Pct,
  TextFields15Pct
}
