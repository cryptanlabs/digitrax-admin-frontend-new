import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import List from '@mui/material/List';


export function SimpleDialog({children, title = 'dialog title', onClose, selectedValue, open }) {
  // const { onClose, selectedValue, open } = props;

  const handleCloseCancel = () => {
    onClose(false);
  };

  const handleClose = () => {
    onClose(true);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleCloseCancel} open={open}>
      <DialogTitle>{title} </DialogTitle>
      <DialogContent>
        {/*<DialogContentText>*/}
        {/*  To subscribe to this website, please enter your email address here. We*/}
        {/*  will send updates occasionally.*/}
        {/*</DialogContentText>*/}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCancel}>Cancel</Button>
        <Button onClick={handleClose}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
