import {Button, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, base_url} from '../helpers/requests.js';

export default function Reports() {

  return (
    <>
      <div className="w-full mt-4 flex items-center justify-between">
        <div className="flex flex-col ml-20">
        <h1 className="text-4xl ml-10 font-medium">
          Reports
        </h1>
          <ReportButton
          label="Removed From CrossClear"
          buttonText="Retreive"
          link={`${base_url}/removedFromCrossClear?format=csv`}
          linkButton
          />
          <ReportButton
            label="Publisher Shares with Totals"
            buttonText="Retreive"
            link={`${base_url}/getPublishersSharesSummed?format=csv`}
            linkButton
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
