import {Button, TextField, Typography} from '@mui/material';
import {useState} from 'react';


export function CommentDisplay({comments = [], handleCreateComment  = () => {}}){
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setNewComment(value);
  };

  return (<>
    <div className="w-full mt-20 flex">
      <div className="flex flex-col ml-20">
        <Typography sx={{ fontWeight: "bold" }}>Comments</Typography>
      </div>
    </div>
    <div className="w-[90%] mt-10 flex overflow-x-scroll">
      {comments.map((comment, index) => (
        <div key={index} className="flex flex-col ml-10 mb-10">
          <div className="flex flex-row items-center p-5">
            <Typography variant="body1">{comment?.UserName}</Typography>
            <Typography sx={{ marginLeft: 10 }} variant="body2">
              {comment?.date}
            </Typography>
          </div>
          <div className="bg-gray-300 w-80 ml-5 p-2 rounded-md rounded-tl-none">
            <Typography>{comment?.Content}</Typography>
          </div>
        </div>
      ))}
    </div>
    <div className="w-full mt-10 flex">
      <div className="flex flex-col w-[90%] ml-20">
        <Typography sx={{ fontWeight: "bold" }}>Add a Comment</Typography>
        <TextField
          sx={{ marginTop: 1 }}
          hiddenLabel
          multiline
          rows={4}
          value={newComment}
          onChange={handleCommentChange}
          variant="outlined"
        />
      </div>
    </div>
    <div className="w-[90%] mt-5 flex items-center justify-end">
      <Button
        variant="outlined"
        onClick={handleCreateComment}
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
        Save Comment
      </Button>
    </div>
  </>)
}
