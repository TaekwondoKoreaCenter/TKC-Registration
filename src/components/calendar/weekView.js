import React from 'react';
import moment from 'moment';
import '../../styles/weekView.css';
import DateButton from './dateButton';

export default class DaysInMonth extends React.Component{
  constructor(props){
    super(props);
    this.classes = props.classes;
    this.state = {
      loaded: false
    }
  }

  handleChosenClasses(classes){
    this.props.chosenClasses(classes);
  }

  render(){
    return(
      <tbody>
        {this.classes !== {} && this.renderDays(this.classes)}
      </tbody>
    );
  }

  renderDays(classes){

  
    let firstDayOfMonth = () => {
      let dateObject1 = moment().add(7, 'd');
      let firstDay = dateObject1.startOf('month').format('d');
      return firstDay;
    }
    
    let blanks = [];
    for (let i = 0; i < firstDayOfMonth(); i++) {
      blanks.push(
        <td className="empty">{""}</td>
      );
    }
  
    let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let daysInMonth = [];
  
    let currentWeekday = parseInt(firstDayOfMonth(), 10);
  
    let lastDayOfMonth = moment().daysInMonth();
  
    for (let d = 1; d <= lastDayOfMonth; d++) {
      console.log('days in month' + lastDayOfMonth);
      let result = this.isDayWithClass(classes, d.toString());
      if (result.length > 0){
        daysInMonth.push(
          <td key={d} className={(result[1].length > 0) ? ((Object.keys(this.props.currentChosenClasses).includes(result[0]) && this.props.currentChosenClasses[result[0]].length > 0) ? "calendar-day chosen-class": "calendar-day class-day"): "calendar-day no-class"} >
            <DateButton onlyDate = {d} date = {result[0]} classesThisDay = {result[1]} dayOfWeek = {weekdayNames[((d-1) + currentWeekday) % 7]} chosenClasses={(classes) => this.handleChosenClasses(classes)} currentChosenClasses = {this.props.currentChosenClasses} />
          </td>
        );
      } else {
        daysInMonth.push(
          <td key={d} className={"calendar-day no-class"} >
            {d}
          </td>
        );
      }
    }
    
    let trailingBlanks = [];
    for (let i=0; i< (35-(blanks.length + daysInMonth.length)); i++){
      trailingBlanks.push(
        <td className="empty">{""}</td>
      )
    }
    
    var totalSlots = [...blanks, ...daysInMonth, ...trailingBlanks];
    let rows = [];
    let cells = [];
    
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows 
        cells = []; // empty container 
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) { // when end loop we add remain date
        rows.push(cells);
      }
    });
    
    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });
  
    return daysinmonth;
  }
  
  isDayWithClass (classes, date) {
    let month = moment().add(7, 'd').format('MM');
    let dateString = month + '-' +(date<10 ? '0' + date : date);
    let classDates = classes['dates'];  
    let flag = false;
  
    if (classDates.includes(dateString)){
      classes[dateString].forEach((session) => {
        if (session['status'] < 20){
          flag = true;
        }
      });
    }
  
    if (flag){
      return [dateString, classes[dateString]];
    }else {
      return [];
    }
  }
    
}


