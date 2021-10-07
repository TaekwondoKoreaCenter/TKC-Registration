import React from 'react';
import CalendarView from './calendar/calendarView';
import {retrieveAllClasses} from '../services/airtable';
import {
  Button,
  CircularProgress,
  AppBar,
  Typography,
  Snackbar,
  Badge,
  Toolbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stepper,
  Step,
  StepLabel
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import OpeningDialog from './openingDialog';
import CloseIcon from '@material-ui/icons/Close';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import ClassTracker from '../services/classAddTracker';
import ClosingDialog from './closingDialog';
import '../styles/App.css';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      classes: {},
      finishedSignin: false,
      studentInfo: {},
      currentChosenClasses: {},
      closingDialogOpen: false,
      classMappings: {},
      errorCaught: false,
      totalClassCount: [],
      addSuccess: false,
      errorStatement: '',
      helpClicked: false,
      currentStep: 0
    }
    this.classTracker = new ClassTracker();
    this.renderClosingDialog = this.renderClosingDialog.bind(this);
    this.handleErrorClose = this.handleErrorClose.bind(this);
    this.handleSuccessClose = this.handleSuccessClose.bind(this);
    this.handleHelpDialogOpen = this.handleHelpDialogOpen.bind(this);
    this.handleHelpDialogClose = this.handleHelpDialogClose.bind(this);
  }

  retrieveClassData(studentData){
    retrieveAllClasses(studentData['student_type']).then((data) => {
      this.setState({
          ...this.state,
          classes: data['allClasses'],
          isLoading: false,
          classMappings: data['classMappings']
      });
    });
  }

  handleChosenClasses(classes) {    
    try {
      let result = this.classTracker.updateClasses(classes);
      let total = this.classTracker.getTotalClasses();
      this.setState({
        ...this.state,
        currentChosenClasses: result,
        totalClassCount: total,
        addSuccess: true
      });
    } catch (e) {
      console.log('error caught');
      this.handleError();
    }
  }

  handleError(){
    this.setState({
      ...this.state,
      errorCaught: true
    });
  }

  handleErrorClose(){
    this.setState({
      ...this.state,
      errorCaught: false
    });
  }

  handleSuccessClose(){
    this.setState({
      ...this.state,
      addSuccess: false
    });
  }

  handleStudentData(data){
    this.setState({
      ...this.state,
      finishedSignin: true,
      studentInfo: data
    });
    console.log(data);
    this.retrieveClassData(data);
    this.classTracker.setClassLimit(data['student_type']);
  }

  handleClosingDialog(){
    this.setState({
      ...this.state,
      closingDialogOpen: false,
      currentStep: 0
    });
  }

  handleHelpDialogOpen(){
    this.setState({
      ...this.state,
      helpClicked: true
    });
  }

  handleHelpDialogClose(){
    this.setState({
      ...this.state,
      helpClicked: false
    });
  }

  handleRegister(){
    this.setState({
      ...this.state,
      currentStep: 2
    });
  }

  renderCalendar(){
    return(
      <div>
        {this.state.classes !== {} && <CalendarView classes = {this.state.classes} chosenClasses={(classes) => this.handleChosenClasses(classes)} currentChosenClasses = {this.state.currentChosenClasses}/>}
      </div>
    );
  }

  renderDialog(){
    return(
      <div>
        <OpeningDialog studentData = {(data) => this.handleStudentData(data)}/>
      </div>
    );
  }

  renderClosingDialog() {
    this.setState({
      ...this.state,
      closingDialogOpen: true,
      currentStep: 1
    });
  }

  render(){
    const steps = ['Select classes', 'Review added classes', 'Finish registration'];
    return (
      <div className="App">
        <AppBar position = 'sticky' elevation = {0}> 
          <Toolbar >
            {/* <Typography align = 'left' variant = 'h6'>
              {this.state.studentInfo['name']}
            </Typography> */}
            <Typography align = 'center' variant = 'h2'>
              TKC Class Sign-Up
            </Typography>
            <IconButton onClick={this.handleHelpDialogOpen}>
              <HelpIcon className = 'helpIcon'/>
            </IconButton>
            {/* { !this.state.closingDialogOpen && */}
              <Badge badgeContent={this.state.totalClassCount.length} color="secondary" invisible ={this.state.totalClassCount.length === 0 || this.state.closingDialogOpen}>
                <Button variant = 'outlined' color='primary' className = 'reviewButton' onClick = {this.renderClosingDialog}  disabled={this.state.totalClassCount.length === 0 || this.state.closingDialogOpen}>
                    Review and Register
                </Button>
              </Badge>
            {/* }  */}
          </Toolbar>
        </AppBar>  

        {this.state.finishedSignin  &&
          <Stepper activeStep={this.state.currentStep} alternativeLabel>
            {steps.map((label) => {
              return(<Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>)
            })}
          </Stepper>
        }
        {/* {this.state.finishedSignin  &&
        <div className = "textGen">
          <p className="textBlurb">
            Select your desired classes below, and click "Review and Register" at the right top corner to complete registration.<br></br>
            Note: 2 max classes per week for Basic Course and monthly members.           
          </p>
        </div>} */}

        <Snackbar open={this.state.errorCaught} autoHideDuration={6000} onClose={this.handleErrorClose} >
          <MuiAlert variant='filled' onClose={this.handleErrorClose} severity="error">
            {/* Too many classes added! You can add up to {this.state.studentInfo['student_type'] === 'bbt'? 3 : 2} classes for each week. */}
            Too many classes added! 
          </MuiAlert>
        </Snackbar>

        <Snackbar open={this.state.addSuccess} autoHideDuration={1000} onClose={this.handleSuccessClose} >
          <MuiAlert variant='filled' onClose={this.handleSuccessClose} severity="success">
            Successfully updated!
          </MuiAlert>
        </Snackbar>
        {this.state.helpClicked? <Dialog open = {this.state.helpClicked}>
          <DialogTitle>
            Need Help?
            <IconButton className='closeIcon' onClick={this.handleHelpDialogClose}>
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            Please email us at info@TKCUSA.com or call us at (630) 708-3132 for issues. We will work together to complete your registration.
            </DialogContentText>
          </DialogContent>
        </Dialog> : null}
        {(this.state.finishedSignin === false) ? this.renderDialog() : null}
        {(this.state.closingDialogOpen) ? <ClosingDialog open = {this.state.closingDialogOpen} handleClose = {() => {this.handleClosingDialog()}}studentData = {this.state.studentInfo} currentChosenClasses = {this.state.currentChosenClasses} totalClasses = {this.state.totalClassCount} classMappings = {this.state.classMappings} handleRegister = {() => this.handleRegister()}/>: null}

        <div>
          {!this.state.finishedSignin || this.state.closingDialogOpen? null :
            this.state.isLoading? <CircularProgress /> : this.renderCalendar()
          }
        </div>
      </div>
    );
  }
}

