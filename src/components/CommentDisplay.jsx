import {Button, TextField, Typography} from '@mui/material';
import {useState} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';


export function CommentDisplay ({
                                  comments = [],
                                  handleCreateComment = () => {},
                                  handleRemoveComment = () => {}
                                }) {
  try {
    const [showRemoveButton, setShowRemoveButton] = useState(false);
    const [showTextArea, setShowTextArea] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleCommentChange = (e) => {
      const {value} = e.target;
      if (value?.length > 250) {
        return;
      }
      setNewComment(value);
    };

    const handleShowCommentDelete = () => {
      setShowRemoveButton(!showRemoveButton);
    };


    const NoComments = () => {
      return (
        <div className={`flex flex-col  mb-5`}>
          <div className="bg-gray-300 w-80 ml-10 p-2 rounded-md ">
            <Typography>No Comments For Song</Typography>
          </div>
        </div>
      );
    };
    const OneComment = ({comment, index}) => {
      return (
        <div className={`flex flex-col  mb-5`}>
          {showRemoveButton && <Button
            onClick={() => {
              handleRemoveComment(comment.CommentId);
            }}
            size="small"
            sx={{
              color: 'black',
              '&:hover': {
                borderColor: '#F1EFEF',
                backgroundColor: '#F5F7F8',
              }
            }}
          >
            <DeleteIcon></DeleteIcon>
          </Button>}
          <div className="flex flex-row items-center px-5 justify-between">
            <Typography variant="body1">{comment?.UserName}</Typography>
            <Typography variant="body2">
              {`${dayjs(comment?.CreatedAt).format('MM/DD/YYYY h:mm a')}`}
            </Typography>
          </div>
          <div className="bg-gray-300 w-80 ml-5 p-2 rounded-md ">
            <Typography>{comment?.Content}</Typography>
          </div>
        </div>
      );
    };

    return (<>
      <div className="w-full mt-10 flex">
        <div className="flex flex-col ml-20">
          <Typography sx={{fontWeight: 'bold'}}>Comments</Typography>
        </div>
      </div>
      <div className="w-[90%] mt-5 ml-20 flex flex-wrap">
        {comments?.length > 0 && comments.map((comment, index) => (
          <OneComment key={index} comment={comment} index={index}/>
        ))}
        {comments?.length === 0 && <NoComments/>}
      </div>
      <div className="w-full mt-5 flex">
        <div className="flex flex-col w-[90%] ml-20">

          <div className="flex flex-row w-full justify-between">
            <Typography sx={{fontWeight: 'bold'}}>Add a Comment</Typography>

            {comments?.length > 0 && <Typography
              onClick={handleShowCommentDelete}
              sx={{
                cursor: 'default',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#F1EFEF',
                  backgroundColor: '#F5F7F8',
                },
                '&:active': {
                  backgroundColor: '#aac9d9',
                }
              }}>{showRemoveButton ? 'Hide Comment Remove' : 'Show Comment Remove'}</Typography>}
          </div>
          <TextField
            sx={{marginTop: 1}}
            hiddenLabel
            multiline
            rows={2}
            value={newComment}
            onChange={handleCommentChange}
            variant="outlined"
          />
        </div>
      </div>
      <div className="w-[90%] mt-5 flex items-center justify-end">
        <Button
          variant="outlined"
          onClick={() => {
            handleCreateComment(newComment);
            setNewComment('');
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
          Save Comment
        </Button>
      </div>
    </>);
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CommentDisplay' Component</h1>
    )
  }
}
