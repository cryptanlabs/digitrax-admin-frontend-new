import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import {base_url} from '../helpers/requests.js';
import {isWhiteSpace} from '../helpers/utils.js';
import {UserContext} from '../context/UserContext.jsx';


export function Thumbnail({newSong, songNumber, thumbnailObject = {}, uploadFile = () => {}, handleMetadataChange = () => {}}){
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedMedia, setGeneratedMedia] = useState({});
    const [imageSource, setImageSource] = useState('');
    const {adminDashToken} = useContext(UserContext);
    // Form Data For Upload
    const formData = new FormData();


    useEffect(() => {
        console.log('STM components-Thumbnail.jsx:18', songNumber); // todo remove dev item
        console.log('STM components-thumbnail.jsx:12', thumbnailObject); // todo remove dev item
        setGeneratedMedia(thumbnailObject)
        if(newSong){
            setImageSource('')
        } else {
            setImageSource(`${base_url}/thumbnail/${songNumber}?x-access-token=${adminDashToken}`)
        }

    }, [thumbnailObject]);


    useEffect(() => {
        if(newSong){
            uploadThumbnail()
        }

    }, [selectedFile]);

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('STM components-Thumbnail.jsx:36', file); // todo remove dev item
            setSelectedFile(file);
            try {
                console.log('STM components-Thumbnail.jsx:33', selectedFile); // todo remove dev item
                setImageSource(URL.createObjectURL(file))
            } catch (e) {
                console.error(e)
            }
        }
    };

    const uploadThumbnail = async () => {
        if(isWhiteSpace(songNumber)) return;
        try {
            console.log('STM components-Thumbnail.jsx:52', selectedFile); // todo remove dev item
            formData.append(
                'files',
                selectedFile
            );
            formData.append(
                'songNumber',
                songNumber
            );


            await uploadFile(formData);
            // setSelectedFile(null)
        } catch (e) {
            console.error(e)
            // setSelectedFile(null)
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: 1,
                gap: 2
            }}
        >
            <Typography sx={{ fontWeight: "bold" }}>Thumbnail</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: '100%',
                    // width: '60%',
                    alignItems: 'center',
                    border: '1px solid #D1D5DB',
                    borderRadius: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        // width: '50%',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
                >
                  {imageSource && <img src={imageSource} height="200px" width="200px"/>}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        height: '100%',
                        marginLeft: '20px',
                        // width: '50%',
                        justifyContent: 'center',
                        alignContent: 'center'
                    }}
                >
                    {(selectedFile && !newSong) && (<Button
                        variant="outlined"
                        onClick={uploadThumbnail}
                        sx={{
                            marginRight: "15px",
                            borderColor: "#00b00e",
                            backgroundColor: "#00b00e",
                            color: "white",
                            "&:hover": {
                                borderColor: "#F1EFEF",
                                backgroundColor: "#86A789",
                            },
                        }}
                    >
                        upload Thumbnail
                    </Button>)}
                    {(!selectedFile && !newSong) && (<Button
                        variant="outlined"
                        onClick={handleFileUploadClick}
                        sx={{
                            marginRight: "15px",
                            borderColor: "#00b00e",
                            backgroundColor: "#00b00e",
                            color: "white",
                            "&:hover": {
                                borderColor: "#F1EFEF",
                                backgroundColor: "#86A789",
                            },
                        }}
                    >
                        Select Thumbnail
                    </Button>)}
                    {(newSong) && (<Button
                        disabled={isWhiteSpace(songNumber)}
                        variant="outlined"
                        onClick={handleFileUploadClick}
                        sx={{
                            marginRight: "15px",
                            borderColor: "#00b00e",
                            backgroundColor: "#00b00e",
                            color: "white",
                            "&:hover": {
                                borderColor: "#F1EFEF",
                                backgroundColor: "#86A789",
                            },
                        }}
                    >
                      {`${!selectedFile ? 'Select' : 'Change'} Thumbnail`}
                    </Button>)}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="*"
                    />
                </Box>
                {!newSong && (<div className="flex-none ml-8">
                    <a href={`${base_url}/thumbnail/${songNumber}?x-access-token=${adminDashToken}`} target="_blank" download>
                        <Button
                            variant="outlined"
                            onClick={() => {setShowFileUpload(true)}}
                            sx={{
                                marginRight: "15px",
                                borderColor: "#00b00e",
                                backgroundColor: "#00b00e",
                                color: "white",
                                "&:hover": {
                                    borderColor: "#F1EFEF",
                                    backgroundColor: "#86A789",
                                },
                            }}
                        >
                            Download Thumbnail
                        </Button>
                    </a>
                </div>)}
            </Box>
        </Box>
    )
}
