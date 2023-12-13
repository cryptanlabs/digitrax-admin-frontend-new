import React, {useRef} from 'react';
import {Button, CircularProgress, Typography} from '@mui/material';
import {useDropzone} from 'react-dropzone';

export function FileSelect({songNumber, uploadingProgress, submitFile, uploadEnabled, differentFilename, handleFileChange}){
  const fileInputRef = useRef(null);

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    getFilesFromEvent: event => myCustomFileGetter(event)
  });
  function Plugin(props) {


    console.log('STM FileUpload-FileUpload.jsx:354', acceptedFiles); // todo remove dev item
    // const files = acceptedFiles.map(f => (
    //   <li key={f.name}>
    //     {f.name}
    //   </li>
    // ));

    return (
      <section className="container" style={{backgroundColor: 'gray', height: '100px'}}
               onClick={handleFileUploadClick}>
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        {/*<aside>*/}
        {/*  <h4>Files</h4>*/}
        {/*  <ul>{files}</ul>*/}
        {/*</aside>*/}
      </section>
    );
  }

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChangeLocal = (event) => {
    const files = event.target.files;
    const collectedFiles = []
    console.log('STM FileUpload-FileSelect.jsx:35', files); // todo remove dev item
    if (files) {
      for(let file of files){
        collectedFiles.push(file)
      }
      handleFileChange(collectedFiles)
    }
  };

  async function myCustomFileGetter(event) {
    const files = [];
    const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    console.log('STM FileUpload-FileUpload.jsx:378', event); // todo remove dev item
    for (var i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);

      // Object.defineProperty(file, 'myProp', {
      //   value: true
      // });

      files.push(file);
    }

    return files;
  }

  return (
    <>
      <div className="w-full flex flex-col">
        <input
          multiple
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChangeLocal}
          accept="*"
        />
        <section className="container" style={{backgroundColor: 'gray', height: '100px'}}
                 onClick={handleFileUploadClick}>
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          {/*<aside>*/}
          {/*  <h4>Files</h4>*/}
          {/*  <ul>{files}</ul>*/}
          {/*</aside>*/}
        </section>
        <div className="flex flex-row">
        {/*  video/x-cdg,video/mp4,audio/mpeg */}
        {/*<Button*/}
        {/*  variant="outlined"*/}
        {/*  onClick={handleFileUploadClick}*/}
        {/*  sx={{*/}
        {/*    borderColor: differentFilename ? '#af1a1a' : 'gray',*/}
        {/*    color: differentFilename ? '#af1a1a' : 'black',*/}
        {/*    marginTop: differentFilename ? 'auto' : '25px',*/}
        {/*    height: '60px',*/}
        {/*    '&:hover': {*/}
        {/*      borderColor: '#F1EFEF',*/}
        {/*      backgroundColor: '#F5F7F8',*/}
        {/*    },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  Select File*/}
        {/*  /!*{currentFileName !== '' ? currentFileName : 'Select File'}*!/*/}
        {/*</Button>*/}
        {/*<Plugin />*/}
        </div>
      </div>


    </>
  )
}
