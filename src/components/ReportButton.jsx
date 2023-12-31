import {Button, Typography} from '@mui/material';
import {base_url} from '../helpers/requests.js';


export function ReportButton({label, buttonText, onClick = () => {}, linkButton, link}){


  if(linkButton){
    return (
      <div className="w-full mt-5 flex flex-row items-center justify-start">
        <div className="w-[30%]  ml-20">
          <a href={link} target="_blank" download>
            <Button
              variant="outlined"
              onClick={onClick}
              sx={{
                width: '150px',
                borderColor: "#00b00e",
                backgroundColor: "#00b00e",
                color: "white",
                "&:hover": {
                  borderColor: "#F1EFEF",
                  backgroundColor: "#86A789",
                },
              }}
            >
              {buttonText}
            </Button>
          </a>

        </div>
        <div className="w-[70%]  ml-20">
          <Typography sx={{ fontWeight: "bold", fontSize: '30px' }}>{label}</Typography>
        </div>

      </div>
    )
  }

  return (
    <div className="w-[90%] mt-5 flex flex-row items-center justify-start">
      <div className="w-[30%]  ml-20">
          <Button
            variant="outlined"
            onClick={onClick}
            sx={{
              width: '150px',
              borderColor: "#00b00e",
              backgroundColor: "#00b00e",
              color: "white",
              "&:hover": {
                borderColor: "#F1EFEF",
                backgroundColor: "#86A789",
              },
            }}
          >
            {buttonText}
          </Button>

      </div>
      <div className="w-[70%]  ml-20">
        <Typography sx={{ fontWeight: "bold", fontSize: '30px' }}>{label}</Typography>
      </div>

    </div>
  )
}
