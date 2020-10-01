import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Button,
  List,
  ListItem,
  Toolbar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  CircularProgress,
  Typography
} from '@material-ui/core';
import './closingDialog.css';
import {registerStudent} from '../services/airtable';
import moment from 'moment';


export default class ClosingDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      finishedRegister: false,
      open: this.props.open,
      information: this.props.studentData,
      chosenClasses: {},
      finalClasses: this.props.totalClasses,
      isLoading: false
    });
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleClose(){
    this.props.handleClose();
  }

  handleRegister(){
    this.setLoading();
    this.updateChosenClasses();
    registerStudent({'studentData': this.state.information, 'chosenClasses': this.state.finalClasses}).then(() => {
      this.setState({
        ...this.state,
        finishedRegister: true,
        isLoading: false
      });
    });
  }

  updateChosenClasses(){
    let dates = Object.keys(this.props.currentChosenClasses);
    let tempDict = {};
    let temptemp = {...this.props.currentChosenClasses};

    dates.forEach((date) => {
      let pickedClasses = [];

      temptemp[date].forEach((record) => {
        if (this.state.finalClasses.includes(record)){
          pickedClasses.push(record);
        }
      });

      if (pickedClasses.length !== 0){
        tempDict[date] = pickedClasses;
      }
    });

    this.setState({
      ...this.state,
      chosenClasses: tempDict
    });
  }

  setLoading(){
    this.setState({
      isLoading: true
    })
  }

  handleToggle(recordId){
    let newFinal = [];
    if (this.state.finalClasses.includes(recordId)){
      this.state.finalClasses.forEach((record) => {
        if (record !== recordId) {
          newFinal.push(record);
        }
      })
      this.setState({
        ...this.state,
        finalClasses: newFinal
      });
    } else {
      newFinal = this.state.finalClasses;
      newFinal.push(recordId);
      this.setState({
        ...this.state,
        finalClasses: newFinal
      });
    }
  }

  getParsedDay(dateString){
    let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let firstDayOfMonth = () => {
      let dateObject = moment().dateObject;
      let firstDay = moment(dateObject).startOf('month').format('d');
      return parseInt(firstDay);
    }

    let firstWeekday = parseInt(firstDayOfMonth(), 10);
    let parsedDate = parseInt(dateString.split('-')[1]);
    let str = dateString.replace('-','/');
    while(str.charAt(0) === '0'){
      str = str.substring(1);
    }

    console.log(weekdayNames[((parsedDate-1) + firstWeekday) % 7] + ' ' + str);
    return (weekdayNames[((parsedDate-1) + firstWeekday) % 7] + ' ' + str);
  }

  render(){
    let dates = Object.keys(this.props.currentChosenClasses);
    dates.sort();

    return(
      <div>
        <Toolbar className='drawerTop'/>
        <Dialog fullScreen = {true} open={this.state.open} aria-labelledby="form-dialog-title">
            {!this.state.finishedRegister && 
              <div className = 'dialogContentWrapper'>

                <DialogTitle id="form-dialog-closing">Review and Register</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Verify the classes you would like to add, and uncheck the classes you want to remove. 
                  </DialogContentText>
                  <List>
                  {/* eslint-disable-next-line */}
                    {dates.map((date) => {
                      let parsedWeekday = this.getParsedDay(date);
                      if (this.props.currentChosenClasses[date].length !== 0){
                        return(
                          <div>
                            <ListItem>
                              <ListItemText dense={true} primary = {parsedWeekday}/>
                            </ListItem>
                            {this.props.currentChosenClasses[date].map((currClass) => {
                              return (
                                <List disablePadding >
                                  <ListItem className='subItem'>
                                    <ListItemText secondary = {this.props.classMappings[currClass]} />
                                    <ListItemSecondaryAction>
                                      <Checkbox
                                        edge="end"
                                        onChange={() => this.handleToggle(currClass)}
                                        checked={this.state.finalClasses.includes(currClass)}
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                </List>)
                            })}
                            <Divider component="li" />
                          </div>
                        );
                      }
                    })}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button variant = 'outlined' color="primary" onClick={this.handleClose}>
                    Go Back
                  </Button>
                  <Button variant = 'contained' onClick={this.handleRegister} color="primary">
                    Register
                  </Button>
                </DialogActions> 
              </div>
            }
            {this.state.finishedRegister && 
              <div className = 'dialogContentWrapper'>
                <DialogTitle id="form-dialog-finish-register">Thank You for Registering</DialogTitle>
                <DialogContent>
                  <Typography variant='body1'>
                    You have signed up for:
                  </Typography>
                  <List>
                    {/* eslint-disable-next-line */}
                    {Object.keys(this.state.chosenClasses).sort().map((date) => {
                      let parsedWeekday = this.getParsedDay(date);
                      if (this.state.chosenClasses[date].length !== 0){
                        return(
                          <div>
                            <ListItem>
                              <ListItemText primary = {parsedWeekday}/>
                            </ListItem>
                            {/* eslint-disable-next-line */}
                            {this.state.chosenClasses[date].map((currClass) => {
                                return (
                                  <List disablePadding >
                                    <ListItem className='subItem'>
                                      <ListItemText secondary = {this.props.classMappings[currClass]} />
                                    </ListItem>
                                  </List>)
                            })}
                            <Divider component="li" />
                          </div>
                        );
                      }
                    })}
                  </List>
                  <Typography variant='body1'>
                    Check email for your confirmation. <b>COVID-19 Notice:</b> Every student and parent entering our dojang will be required to wear a mask over nose and mouth and be temperature checked for the safety of fellow students, parents, and staff.
                  </Typography>
                </DialogContent>
              </div>
            }
          <div>
            {this.state.isLoading? <CircularProgress /> : null}
          </div>
        </Dialog>
      </div>
    );
  }
}