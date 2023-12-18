import {Checkbox, MenuItem, Select, TextField, Typography} from '@mui/material';
import React from 'react';


export function BucketName({preSetBucketTo, createBucket, bucketName, localGeneratedSets, handleChckboxChange, handleBucketNameChange}) {

  if (preSetBucketTo) {

    return (
      <>
        <div className="flex flex-col  w-52">
          <Typography sx={{fontWeight: 'bold'}}>Bucket Name</Typography>
          <TextField
            sx={{marginTop: 1}}
            hiddenLabel
            name="addBucket"
            defaultValue={preSetBucketTo}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col  w-52">
        <Typography sx={{fontWeight: 'bold'}}>Folder Name</Typography>
        {createBucket ? (
          <TextField
            sx={{marginTop: 1}}
            hiddenLabel
            name="addBucket"
            value={bucketName}
            onChange={handleBucketNameChange}
            variant="outlined"
          />
        ) : (
          <Select
            sx={{marginTop: 1}}
            value={bucketName}
            onChange={handleBucketNameChange}
          >
            {localGeneratedSets.map((value, index) => (
              <MenuItem key={index} value={value}>{value}</MenuItem>
            ))}
          </Select>
        )}

      </div>
      <div className="flex flex-row  w-52">
        <Checkbox checked={createBucket} onChange={handleChckboxChange}/>
        <span style={{paddingTop: '9px'}}>Create Folder</span>
      </div>
    </>
  );
};
