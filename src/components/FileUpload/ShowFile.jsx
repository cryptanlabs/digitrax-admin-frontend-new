import React, {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import {base_url} from '../../helpers/requests.js';
import EditIcon from '@mui/icons-material/Edit.js';
import CloseIcon from '@mui/icons-material/Close.js';
import SaveIcon from '@mui/icons-material/Save.js';
import DeleteIcon from '@mui/icons-material/Delete.js';


export function ShowFile ({mediaItem = {}, songNumber, handleMetadataChange, handleRequestDeleteMediaEntry}) {
  const [editExisting, setEditExisting] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [mediaMetaData, setMediaMetaData] = useState({
    digitraxId: '',
    fileType: '',
    generatedSet: '',
    videoDimension: '',
    description: '',
    fullFilename: '',
    requestString: ''
  });

  useEffect(() => {
    setMediaMetaData({
      digitraxId: mediaItem.digitraxId,
      fileType: mediaItem.fileType,
      generatedSet: mediaItem.generatedSet,
      videoDimension: mediaItem.videoDimension,
      description: mediaItem.description,
      fullFilename: mediaItem.fullFilename,
      requestString: mediaItem.requestString
    });
  }, [mediaItem]);
  const handleChange = (e) => {
    const {name, value} = e.target;

    setMediaMetaData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!songNumber) return;
    await handleMetadataChange({
      requestString: mediaMetaData.requestString,
      videoDimension: mediaMetaData.videoDimension,
      description: mediaMetaData.description,
    });
    setEditExisting(false);
  };

  const handleDelete = () => {
    setOpenConfirmDeleteDialog(true);
  };

  const handleCancel = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleOkToDelete = async () => {
    setOpenConfirmDeleteDialog(false);
    handleRequestDeleteMediaEntry(mediaItem.requestString);
  };

  const handleEdit = () => {
    // if (!preSetBucketTo) {
    //   submit(formData);
    //   setSelectedFile(null);
    //   setBucketName('');
    //   setUploadEnabled(false);
    //   setCreateBucket(false);
    //   setCurrentFileName('');
    //   setShowFileUpload(false);
    //   setDifferentFilename(false);
    //   setChangeFilename(false);
    // }
    setEditExisting(!editExisting);
  };

  return (
    < >
      <div className={`w-full flex flex-row  justify-between items-center`}>
        <div className={`w-full flex flex-row flex-wrap justify-between items-center`}>
          <div className="flex-none ml-8">
            <div className="flex flex-col   ">
              <Typography sx={{fontWeight: 'bold'}}>Digitrax Id</Typography>
              <div className="w-52 h-14 mt-2 border border-gray-300 rounded-md">
                <Typography sx={{margin: 2}}>{mediaMetaData.digitraxId}</Typography>
              </div>
            </div>
          </div>
          <div className="flex-none ml-8">
            <div className="flex flex-col  ">
              <Typography sx={{fontWeight: 'bold'}}>Filename</Typography>
              <div className="w-52 h-14 mt-2 border border-gray-300 rounded-md">
                <Typography sx={{margin: 2}}>{mediaMetaData.fullFilename}</Typography>
              </div>
            </div>
          </div>
          <div className="flex-none ml-8">
            <div className="flex flex-col  ">
              <Typography sx={{fontWeight: 'bold'}}>Resolution</Typography>
              {!editExisting && (
                <div className="flex flex-col w-52 h-14 mt-2 border border-gray-300 rounded-md">
                  <Typography sx={{margin: 2}}>{mediaMetaData.videoDimension}</Typography>
                </div>)}
              {editExisting && (<TextField
                sx={{marginTop: 1}}
                hiddenLabel
                name="videoDimension"
                value={mediaMetaData.videoDimension}
                onChange={handleChange}
                variant="outlined"
              />)}
            </div>
          </div>
          <div className="flex-none ml-8">
            <div className="flex flex-col  ">
              <Typography sx={{fontWeight: 'bold'}}>Description</Typography>
              {!editExisting && (<div
                className="flex flex-col justify-around grow w-52 h-14 border border-gray-300 rounded-md items-center self-center">
                <Typography sx={{marginLeft: 1}}>{mediaMetaData.description}</Typography>
              </div>)}
              {editExisting && (<TextField
                sx={{marginTop: 1}}
                hiddenLabel
                name="description"
                value={mediaMetaData.description}
                onChange={handleChange}
                variant="outlined"
              />)}
            </div>
          </div>
        </div>
        <div className="flex-none ml-8">
          <a href={`${base_url}/fileGetInternal/${mediaItem.requestString}`} target="_blank"
             download>
            <Button
              variant="outlined"
              onClick={() => {
              }}
              sx={{
                marginRight: '15px',
                borderColor: '#00b00e',
                backgroundColor: '#00b00e',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#86A789',
                },
              }}
            >
              Download File: {mediaItem.fullFilename}
            </Button>
          </a>
        </div>
        <div className="shrink content-start">
          <div className="flex flex-row">
            <div className="flex flex-col">
              {!editExisting && (
                <Button
                  onClick={handleEdit}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 0,
                    borderColor: 'gray',
                    color: 'black',
                    '&:hover': {
                      borderColor: '#F1EFEF',
                      backgroundColor: '#F5F7F8',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 10 }}>Edit</Typography>
                  <EditIcon></EditIcon>
                </Button>
              )}
              {editExisting && (
                <>
                  <Button
                    onClick={handleEdit}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderColor: 'gray',
                      color: 'black',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 10 }}>Close</Typography>
                    <CloseIcon></CloseIcon>
                  </Button>
                  <Button
                    onClick={handleSave}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderColor: 'gray',
                      color: 'black',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 10 }}>Save</Typography>
                    <SaveIcon></SaveIcon>
                  </Button>
                  <Button
                    onClick={handleDelete}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderColor: 'gray',
                      color: 'black',
                      '&:hover': {
                        borderColor: '#F1EFEF',
                        backgroundColor: '#F5F7F8',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: 10 }}>Remove</Typography>
                    <DeleteIcon></DeleteIcon>
                  </Button>
                </>

              )}
            </div>

          </div>
        </div>
        <Dialog
          open={openConfirmDeleteDialog}
        >
          <DialogTitle>
            Confirm Delete Media File.
          </DialogTitle>
          <DialogContent>

            Note That This Cannot Be Undone
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              sx={{
                borderColor: 'gray',
                backgroundColor: 'red',
                color: 'white',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#7e2121',
                },
              }}
              onClick={handleOkToDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </>

  );
};
