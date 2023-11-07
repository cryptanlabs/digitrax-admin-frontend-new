import {Button, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';


export default function Reports() {


  return (
    <>
      <div className="w-full mt-4 flex items-center justify-between">
        <div className="flex flex-col ml-20">
        <h1 className="text-4xl ml-10 font-medium">
          Reports
        </h1>
          <ReportButton
          label="Cleared By CrossClear"
          buttonText="Retreive"
          />
          <ReportButton
            label="Cleared By CrossClear"
            buttonText="Retreive"
          />
          <ReportButton
            label="Cleared By CrossClear"
            buttonText="Retreive"
          />
        </div>
      </div>
    </>
  )
}
