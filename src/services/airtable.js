import airtable from 'airtable';

let API_KEY = 'keySCoKA0j0MYnttj';

let base = new airtable({apiKey: API_KEY}).base('appFMfdHgnKfbwxmX');

const bcClasses = ["Basic Class", "Family Class", "Demo Class"];
const bbtIcClasses = ["Basic Class", "Advanced Class", "Family Class", "Demo Class"]; 
const otherClasses = ["Basic Class", "Family Class", "Demo Class", "Advanced Class"];

export async function retrieveClassTypes(){
  let allClassTypes = {};

  await base('Class Type').select({
    // view: 'Grid View'
  }).eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      allClassTypes[record.get('Name')] = record.id;
    });

    fetchNextPage();
  });

  return allClassTypes;
}

export async function retrieveAllClasses(studentType){
  let allClasses = {};
  let classMappings = {};

  allClasses['dates'] = [];

  let availableClasses;
  if (studentType === 'bc'){
    availableClasses = bcClasses;
  } else if (studentType === 'bbt'){
    availableClasses = bbtIcClasses;
  } else {
    availableClasses = otherClasses;
  }

  await base('Classes').select({
      // view: 'Grid View'
      sort: [{field: "Order", direction: "asc"}]
  }).eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      // if (availableClasses.includes(record.get('Class Name')[0]) && record.get('Status') < 15){
      if (record.get('Status') < 20){

        let parsedDate = record.get('Date').substring(5);
        allClasses["dates"].push(parsedDate);
        let currRecord = {
          'date': record.get('Date'),
          'name': record.get('Name'),
          'status': record.get('Status'),
          'time': record.get('Time'),
          'className': record.get('Class Name'),
          'classId': record.id,
          'classType': record.get('Class Type'),
        }
        if (!(parsedDate in allClasses)){
          allClasses[parsedDate] = [];
        } 
        allClasses[parsedDate].push(currRecord);
        classMappings[currRecord['classId']] = (currRecord['className']+ ' (' + currRecord['time'][0].toString() + ')');
      }
      
    });

    fetchNextPage();
  });

  return {'allClasses': allClasses, 'classMappings': classMappings}
}

export async function registerStudent(registerData){
  await base('Students').create([
    {
      "fields": {
        "Name": registerData['studentData'].name,
        "Classes Registered": registerData['chosenClasses'],
        "Email": registerData['studentData'].to_email
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });
}
