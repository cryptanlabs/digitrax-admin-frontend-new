import {Checkbox, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';


export function FileDetails({file}) {
  // File name
  const [changeFilename, setChangeFilename] = useState(false);
  const [differentFilename, setDifferentFilename] = useState(false);
  const [fileNameChanged, setFileNameChanged] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');

  const handleDifferentFilenameCheckbox = (e) => {
    const {checked} = e.target;
    setChangeFilename(checked);
    // if (!checked && selectedFiles) {
    //   setCurrentFileName(selectedFiles?.name);
    //   setDifferentFilename(selectedFiles?.name?.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
    // }
  };

  const handleFileNameChange = (e) => {
    const {name, value} = e.target;
    setCurrentFileName(value);
    setFileNameChanged(true);
    try {
      // setDifferentFilename(value.split('.')[0].replace(/-\w$/, '').replace(/^\w/, '').toString() !== songNumber);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <li className="flex flex-row justify-between  m-2  w-48">
      <span>{file.name}</span>
      <span>{file.type}</span>
      {/*<div className="flex flex-col justify-center ml-4">*/}
      {/*<Typography sx={{fontWeight: 'bold'}}>{file.name}</Typography>*/}
      {/*</div>*/}
      {/*<div className="flex flex-col mt-2 w-52">*/}
      {/*  <Typography sx={{fontWeight: 'bold'}}>Description</Typography>*/}
      {/*  <TextField*/}
      {/*    hiddenLabel*/}
      {/*    name="description"*/}
      {/*    value={file.name}*/}
      {/*    variant="outlined"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div className="flex flex-col mt-2 w-52">*/}
      {/*  <Typography sx={{fontWeight: 'bold'}}>Description</Typography>*/}
      {/*  <TextField*/}
      {/*    hiddenLabel*/}
      {/*    name="description"*/}
      {/*    value={file.type}*/}
      {/*    variant="outlined"*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div className={`flex-none mt-2 ${changeFilename ? '' : 'ml-56'}`}>*/}
      {/*  <div className={`flex-none mt-2`}>*/}
      {/*  {differentFilename && <Typography*/}
      {/*    sx={{*/}
      {/*      color: '#af1a1a',*/}
      {/*      width: '180px',*/}
      {/*      overflowWrap: 'break-word',*/}
      {/*      fontSize: '11px',*/}
      {/*      marginTop: '5px'*/}
      {/*    }}>File name doesn't match catalog #</Typography>}*/}

      {/*  <div className="flex flex-row  w-52">*/}
      {/*    <Checkbox checked={changeFilename} onChange={handleDifferentFilenameCheckbox}/>*/}
      {/*    <span style={{paddingTop: '9px'}}>Use Different Filename</span>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*{changeFilename && <div className="flex-none ml-8">*/}
      {/*  <div className="flex flex-col  w-48">*/}
      {/*    <Typography sx={{fontWeight: 'bold'}}>New Filename</Typography>*/}
      {/*    <TextField*/}
      {/*      sx={{marginTop: 1}}*/}
      {/*      hiddenLabel*/}
      {/*      name="add"*/}
      {/*      value={currentFileName}*/}
      {/*      onChange={handleFileNameChange}*/}
      {/*      variant="outlined"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>}*/}
      {/*</div>*/}
    </li>
  )
}
