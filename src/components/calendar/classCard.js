import React from 'react';
import {
  // Card,
  // Grid,
  // CardContent,
  Button,
  Box
  // FormControlLabel,
  // Checkbox,
  // Tooltip
} from '@material-ui/core';
import '../../styles/classCard.css';


export default class ClassCard extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      clicked: this.props.isChosen
    });
  }

  handleAddClass(classId){
    let clickedState = this.state.clicked? false: true
    this.setState({
      clicked: clickedState
    });
    this.props.chosenClass({'classId': classId, 'clicked': clickedState});
  }

  render(){
    const session = this.props.session;
    // const dayOfWeek = this.props.dayOfWeek;
    const {clicked} = this.state;

    return(
      // <Card className = {clicked? 'cardClicked': 'cardUnClicked'}>
      //   <CardContent>
      //     <div className = 'cardHeader'>
      //       {session['className'] + ' (' + session['time'][0].toString() + ')'}
      //     </div>
      //     <Grid container direction='row' justify='space-between'>
      //       <Grid item>
      //         <div className = 'classStatus'>
      //           {'Capacity: ' + session['status'] + "/2"}
      //         </div>
      //         {/* <Tooltip arrow = {true} title = {"Add all available " + dayOfWeek.toString() + " (" + session['time'][0].toString() + ") " + session['className'] + "es"}>
      //           <FormControlLabel
      //             value={1}
      //             control={<Checkbox name="checkedA" />}
      //             label="Add for month"
      //           />
      //         </Tooltip> */}
      //       </Grid>
            
      //       <Grid item>
              <Button size='large' variant = 'contained' disableElevation color = {clicked? 'secondary':'primary'} onClick={() => {this.handleAddClass(session['classId'])}} className='classCardButton'> 
                <Box display='flex' className='containerBox'>
                  <Box flexShrink={1} className='timeBox'> 
                    {session['time'][0].toString()}                  
                  </Box>
                  <Box flexShrink={1} className='nameBox'>
                    {session['className']}
                  </Box>
                  <Box display='flex' flexGrow={2} className='capacityBox' alignItems='flex-end'>
                    {session['status'] + "/25"}
                  </Box>
                </Box>
              </Button> 
    //         </Grid>
    //       </Grid>
    //     </CardContent>
    //   </Card>
    );
  }
}
