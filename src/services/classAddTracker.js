import moment from 'moment';

export default class ClassTracker {
  constructor() {
    this.allAddedClasses = {};
    this.classLimit = 0;
    this.allAddedClassesByWeek = {};
  }

  setClassLimit(studentType){
    this.classLimit = 4;
  }

  updateClasses(classes){
    let date = Object.keys(classes)[0];
    let isValid = this.validateClassesAdded(classes);
    if (isValid){
      this.allAddedClasses[date] = classes[date];
      return this.allAddedClasses;
    } else {
      throw Error("Too many classes added for the week");
    }
  }

  validateClassesAdded(classes) {
    let date = Object.keys(classes)[0];
  
    let firstDayOfMonth = () => {
      let dateObject1 = moment().add(7, 'd');
      let firstDay = moment(dateObject1).startOf('month').format('d');
      return parseInt(firstDay);
    }
  
    let parsedDate = parseInt(date.split('-')[1]);
    //TODO: fix the math here
    let week = Math.floor((parsedDate + firstDayOfMonth())/7) + 1;

    //TODO: fix this
    if (!Object.keys(this.allAddedClassesByWeek).includes(week.toString())){
      if (classes[date].length > this.classLimit){
        return false;
      } else {
        this.allAddedClassesByWeek[week.toString()] = classes;
      }
    } else {
      let temp = {...this.allAddedClassesByWeek[week.toString()]};
      temp[date] = classes[date];

      let count = 0;
      Object.keys(temp).forEach((date)=> {
        count = count + temp[date].length;
      });

      if (count > this.classLimit) {
        return false;
      } else {
        this.allAddedClassesByWeek[week.toString()] = temp;
      }
    }
    return classes;
  }

  getTotalClasses(){
    let total = []

    Object.keys(this.allAddedClasses).forEach((date) => {
      this.allAddedClasses[date].forEach((record) => {
        total.push(record);
      });
    });

    return total;
  }
}

