import React from 'react';
import moment from 'moment';
import '../../styles/calendarView.css';
import DaysInMonth from './weekView';

let weekdayshortname = moment.weekdaysShort().map(day => {
  return(
    <th key={day} className='week-day'>
      {day}
    </th>
  );
});

let dateObject1 = moment().add(7, 'd');

export default class CalendarView extends React.Component {
  state = {
    classes : this.props.classes
  }

  handleChosenClasses(classes){
    this.props.chosenClasses(classes);
  }

  render(){
    return (
      <div>
        <h3 className = 'month'>
          {dateObject1.format("MMMM")}
        </h3>
        <table>
          <thead>
            <tr>{weekdayshortname}</tr>
          </thead>
          {this.state.classes !== {} && <DaysInMonth classes = {this.props.classes} chosenClasses = {(classes) => this.handleChosenClasses(classes)} currentChosenClasses = {this.props.currentChosenClasses} />}
        </table>    
      </div>
    );
  }
}