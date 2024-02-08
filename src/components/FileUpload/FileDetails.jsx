import {Button, Checkbox, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';


export function FileDetails({file, removeFile = () => {}}) {


  return (
    <li className="flex flex-row justify-between  m-2  w-72 border-b-2 ">
      <span>{file.name}</span>
      <span>{file.type}</span>
      <Button
        onClick={() => removeFile(file.name)}
        sx={{

          borderColor: 'gray',
          color: 'black',
          '&:hover': {
            borderColor: '#F1EFEF',
            backgroundColor: '#F5F7F8',
          },
        }}
      >
        <CloseIcon></CloseIcon>
      </Button>
    </li>
  )
}
