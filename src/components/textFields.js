import {TextField, Typography} from '@mui/material';






const textFields40pct = ({onChange, value, name, label}) => {

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
  </div>)
}


const textFields15pct = ({onChange, value, name, label}) => {

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
  textFields40pct,
  textFields15pct
}
