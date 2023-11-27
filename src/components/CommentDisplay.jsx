import {Box, Button, TextField, Typography} from '@mui/material';
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
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            borderRadius: 2,
            backgroundColor: '#D1D5DB',
            justifyContent: 'center',
            py: 3
          }}
        >
          <Typography>No Comments For Song</Typography>
        </Box>
      );
    };
    const OneComment = ({comment, index}) => {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            // width: '100%',
            borderRadius: 2,
            // backgroundColor: '#D1D5DB',
            justifyContent: 'center',
            py: 3
          }}
        >
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
        </Box>
        // <div className={`flex flex-col  mb-5`}>
        // </div>
      );
    };

    return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2
      }}
    >
      <Typography sx={{fontWeight: 'bold'}}>Comments</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: 1,
        }}
      >
        {comments?.length > 0 && comments.map((comment, index) => (
          <OneComment key={index} comment={comment} index={index}/>
        ))}
        {comments?.length > 0 &&
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end'
            }}
          >
            <Typography
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
              }}
            >
              {showRemoveButton ? 'Cancel Remove Comment' : 'Remove Comment'}
            </Typography>
          </Box>}
        {comments?.length === 0 && <NoComments/>}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 1
        }}
      >
        <Typography sx={{fontWeight: 'bold'}}>Add a Comment</Typography>
        <TextField
          sx={{marginTop: 1}}
          hiddenLabel
          multiline
          rows={2}
          value={newComment}
          onChange={handleCommentChange}
          variant="outlined"
        />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              handleCreateComment(newComment);
              setNewComment('');
            }}
            sx={{
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
        </Box>
      </Box>
    </Box>);
  } catch (e) {
    console.error(e)
    return (
      <h1 style={{color: 'red', fontWeight: 'bold'}}>Error in 'CommentDisplay' Component</h1>
    )
  }
}
