import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel
} from '@material-ui/core';
import '../styles/openingDialog.css';


export default class OpeningDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      finished: false,
      open: true,
      information: {    
        "to_email": '',
        "name": '',
        "student_type": ''
      },
      emailError: false,
      nameError: false
    });
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleAddClass(){
    this.setState({
      clicked: this.state.clicked? false: true
    });
  }

  handleClose(){
    const {information, emailError, nameError} = this.state;
    let curEmailError = emailError;
    let curNameError = nameError;
    if (information.to_email=== ""){
      this.setState({
        emailError: true
      });
      curEmailError = true;
    } else {
      this.setState({
        emailError: false
      })
      curEmailError = false;
    }
    if (information.name === ""){
      this.setState({
        nameError: true
      })
      curNameError = true;
    } else {
      this.setState({
        nameError: false
      })
      curNameError = false;
    }
    console.log(emailError + " " + nameError);
    if (curEmailError === false && curNameError === false){
      console.log("hits");
      this.setState({
        open: false
      });

      this.props.studentData(this.state.information);
    } 
  }

  setName(name){
    const newInfo = {...this.state.information, 'name': name};
    this.setState({
      information: newInfo
    });
  }

  setEmail(email){
    console.log(email);
    const newInfo = {...this.state.information, 'to_email': email};
    this.setState({
      information: newInfo
    });
  }

  handleChange(event){
    const newInfo = {...this.state.information, 'student_type': event.target.value};
    this.setState({
      information: newInfo
    });
  }

  render(){
    const {open,nameError, emailError} = this.state;

    return(
      <Dialog open={open} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Sign-in</DialogTitle>
          <DialogContent>
            <DialogContentText>
             Welcome to TKC Class Registration! Please sign-in.<br></br>
             Note: You may submit one registration for your entire family. Add all names into the Name field
            </DialogContentText>
            <TextField
              // autoFocus="false"
              margin="normal"
              id="name"
              label="Name(s) of Participants"
              type="text"
              required
              fullWidth
              error = {nameError}
              onChange = {event => this.setName(event.target.value)}
            />
            <TextField
              // autoFocus = "false"
              margin="normal"
              id="email"
              label="Email Address"
              type="email"
              required
              fullWidth
              error = {emailError}
              onChange = {event => this.setEmail(event.target.value)}
            />
            <DialogContentText>
              
            </DialogContentText>
            {/* <div className = 'labelPadding'>
              <FormLabel>Course Type</FormLabel>
            </div>
            <RadioGroup aria-label="studenttype" name="studenttype" onChange={this.handleChange}>
              <FormControlLabel value="bc" control={<Radio />} label="Basic Belts" />
              <FormControlLabel value="bbt" control={<Radio />} label="Advance Belts" />
              <FormControlLabel value="other" control={<Radio />} label="N/A" />
            </RadioGroup> */}
          </DialogContent>
          <DialogActions>
            <Button variant = 'contained' onClick={this.handleClose} color="primary">
              Sign-in
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
