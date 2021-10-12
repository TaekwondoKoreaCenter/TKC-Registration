import React from 'react';
import {
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogContentText,
  // DialogActions,
  Divider,
  Button,
  List,
  ListItem,
  // Toolbar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  CircularProgress,
  Typography
} from '@material-ui/core';
import '../styles/closingDialog.css';
import {registerStudent} from '../services/airtable';
import moment from 'moment';
import EmailSender from '../services/emailSender';


export default class ClosingDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      finishedRegister: false,
      open: this.props.open,
      information: this.props.studentData,
      chosenClasses: {},
      finalClasses: this.props.totalClasses,
      isLoading: false,
      formattedClasses: ''
    });
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.emailSender = new EmailSender(this.props.studentData);
  }

  handleClose(){
    this.props.handleClose();
  }

  handleRegister(){
    this.setLoading();
    let chosenClasses = this.updateChosenClasses();
    registerStudent({'studentData': this.state.information, 'chosenClasses': this.state.finalClasses}).then(() => {
      this.setState({
        ...this.state,
        finishedRegister: true,
        isLoading: false
      });
    });
    this.props.handleRegister();
    this.emailSender.sendEmail(chosenClasses);
  }

  updateChosenClasses(){
    let dates = Object.keys(this.props.currentChosenClasses).sort();
    let tempDict = {};
    let temptemp = {...this.props.currentChosenClasses};
    let formattedList = '<ul>';


    dates.forEach((date) => {
      let pickedClasses = [];
      let tempSubList = '<ul>';
      temptemp[date].forEach((record) => {
        if (this.state.finalClasses.includes(record)){
          pickedClasses.push(record);
          tempSubList = tempSubList + '<li style="text-align: left;">' + this.props.classMappings[record] + '</li>';
        }
      });
      tempSubList = tempSubList + '</ul>';

      if (pickedClasses.length !== 0){
        formattedList = formattedList + '<li style="text-align: left;">' + this.getParsedDay(date) + '</li>' + tempSubList;
        tempDict[date] = pickedClasses;
      }
    });
    formattedList = formattedList + '</ul>';
    console.log(formattedList);

    this.setState({
      ...this.state,
      chosenClasses: tempDict,
      formattedClasses: formattedList
    });

    return formattedList;
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
      let dateObject = moment().add(7, 'd');
      let firstDay = dateObject.startOf('month').format('d');
      return parseInt(firstDay);
    }

    let firstWeekday = parseInt(firstDayOfMonth(), 10);
    let parsedDate = parseInt(dateString.split('-')[1]);
    let str = dateString.replace('-','/');
    while(str.charAt(0) === '0'){
      str = str.substring(1);
    }

    return (weekdayNames[((parsedDate-1) + firstWeekday) % 7] + ' ' + str);
  }

  render(){
    let dates = Object.keys(this.props.currentChosenClasses);
    dates.sort();

    return(
      <div>
            {!this.state.finishedRegister && 
              <div className = 'dialogContentWrapper'>
                  <Typography variant='h5' className='bottomPadding'>
                    Review and Register
                  </Typography>
                  <Typography variant='body1' align='left'>
                    Review your classes. Uncheck any classes you want to remove.                  
                  </Typography>
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
                  <div className='bottomPadding'/>

                  <div className = 'buttons'>
                    <Button variant = 'outlined' color="secondary" onClick={this.handleClose}>
                      Go Back
                    </Button>
                    <Button variant = 'contained' onClick={this.handleRegister} color="primary">
                      Register
                    </Button>
                  </div>
              </div>
            }
            {this.state.finishedRegister && 
              <div className = 'dialogContentWrapper'>
                  <Typography variant='h5' className='bottomPadding'>
                    Registration Confirmation
                  </Typography>
                  <Typography variant='body1' align='left'>
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
                  <div className='bottomPadding'/>
                  <Typography variant='body1'>
                    Check email for your confirmation. <b>COVID-19 Notice:</b> Every student and parent entering our dojang will be required to wear a mask over nose and mouth in accordance with State guidelines.
                  </Typography>
              </div>
            }
          <div>
            {this.state.isLoading? <CircularProgress /> : null}
          </div>
      </div>
    );
  }
}
