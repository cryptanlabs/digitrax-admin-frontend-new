import React from 'react';
import {Button, CircularProgress, Typography} from '@mui/material';
import {useDropzone} from 'react-dropzone';

export function FileSelect({songNumber, uploadingProgress, submitFile, uploadEnabled, differentFilename, fileInputRef, handleFileChange}){

  function Plugin(props) {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
      getFilesFromEvent: event => myCustomFileGetter(event)
    });

    console.log('STM FileUpload-FileUpload.jsx:354', acceptedFiles); // todo remove dev item
    const files = acceptedFiles.map(f => (
      <li key={f.name}>
        {f.name} has <strong>myProps</strong>: {f.myProp === true ? 'YES' : ''}
      </li>
    ));

    return (
      <section className="container" style={{backgroundColor: 'gray'}}>
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    );
  }

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
      <div className="flex flex-col">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="*"
        />
        {/*  video/x-cdg,video/mp4,audio/mpeg */}
      </div>
      <Plugin />
    </>
  )
}
