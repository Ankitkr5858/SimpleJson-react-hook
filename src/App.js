import React, {useState, useEffect} from 'react';
import { withStyles ,makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//set styles
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minHeight: 300,
    minWidth: 400,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

//create APP

function App() {
  const [init, setInit] =useState(false);                 //App init state
  const [open, setOpen] = useState(false);                //Dialog Open state
  const [members, setMembers] = useState(undefined);      //user members state
  const [listItems, setListItems] = useState();           //user List Items
  const [history, setHistroy] = useState("");             //user visit History State
  const [modalName, setModalName] = useState("");         //modalName state
  const [date, setDate] = useState(new Date());           //current date State
  const [curIndex, setCurIndex] = useState(-1);           //current user Index State

  useEffect(() => {
    // Update the document title using the browser API
    if(init == false)
    {
      axios.get('test.json')
      .then(res => {
        debugger;
        setMembers(res.data.members);
        const itemlist = res.data.members.map((member,index) =>
          <ListItem key={index} button onClick={(event) => handleOpen(event,index)}>
            <ListItemIcon>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary={member.real_name}/>
          </ListItem>
        );
        debugger;
        setListItems(itemlist);
        setInit(true);
      });
    }
  });

  //Get History
  const getHistory = (index, historydate) => {
    let flag = 0;
    const items = members[index].activity_periods.map((history) => {
      let str = history.start_time;
      let pos = str.lastIndexOf(" ");
      let temp= new Date(str.slice(0,pos));
      if(temp.getFullYear() === historydate.getFullYear() && temp.getMonth() === historydate.getMonth() && temp.getDate() === historydate.getDate())
      {
        setHistroy(JSON.stringify(history));
        flag = 1;
      }
    });
    if(flag == 0)
      setHistroy("");
  };

  //Dialog open
  const handleOpen = (e, index) => {
    setModalName(members[index].real_name);
    setCurIndex(index);
    getHistory(index,date);
    setOpen(true);
  };

  //Dialog close
  const handleClose = () => {
    setOpen(false);
    setDate(new Date());
    setHistroy([]);
    debugger;
  };

  //Datepicker date change
  const dateChange = date => {
    setDate(date);
    getHistory(curIndex,date);
  };

  return (
    <div className="App">
      <Container  style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',marginTop: 30, minHeight: 400}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6">
              Users
            </Typography>
            <div>
              <List component="nav" aria-label="contacts">
                {listItems}
              </List>
            </div>
          </Grid>
        </Grid>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {modalName}
          </DialogTitle>
          <DialogContent dividers>
            <DatePicker
              selected={date}
              onChange={dateChange}
            />  
            <Typography gutterBottom>{history}</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Exit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default App;
