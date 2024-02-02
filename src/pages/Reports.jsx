import {Button, Typography} from '@mui/material';
import {ReportButton} from '../components/ReportButton.jsx';
import {axiosBase, axiosBaseWithKey, base_url} from '../helpers/requests.js';
import {useContext, useEffect, useRef, useState} from 'react';
import {UserContext} from '../context/UserContext.jsx';

export default function Reports() {
  const {adminDashToken} = useContext(UserContext);
  const [savedQueries, setSavedQueries] = useState([]);

  const getSavedQueries = async () => {
    const result = await axiosBaseWithKey(adminDashToken)({
      method: 'get',
      timeout: 30000,
      url: '/getBuiltQueries',
    })
      .catch(error => {
        console.log(error);
      });
    setSavedQueries(result.data)
    console.log('STM pages-Reports.jsx:17', result); // todo remove dev item
  };

  useEffect(() => {
    getSavedQueries()
  }, []);


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
