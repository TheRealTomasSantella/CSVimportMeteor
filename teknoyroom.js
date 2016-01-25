Sales =new  Meteor.Collection("sales");

if (Meteor.isClient) {

 /*Template.ban.helpers({
  category: [
    {select: "Name"},
    {select: "Course"}
  ]
 });

 Template.addSection.helpers({
  checkbox: [
    {value: "Monday", label: "Monday"},
    {value: "Tuesday", label: "Tuesday"},
    {value: "Wednesday", label: "Wednesday"},
    {value: "Thursday", label: "Thursday"}  
  ],
  checkbox2: [
     {value: "Friday", label: "Friday"},
      {value: "Saturday", label: "Saturday"},
       {value: "Sunday", label: "Sunday"}
  ],
  period: [
    {time: "7:30 AM"},
    {time: "8:00 AM"},
    {time: "8:30 AM"},
    {time: "9:00 AM"},
     {time: "9:30 AM"},
    {time: "10:00 AM"},
     {time: "10:30 AM"},
    {time: "11:00 AM"},
     {time: "11:30 AM"},
    {time: "12:00 noon"},
     {time: "12:30 noon"},
    {time: "1:00 PM"},
    {time: "1:30 PM"},
    {time: "2:00 PM"},
    {time: "2:30 PM"},
    {time: "3:00 PM"},
    {time: "3:30 PM"},
    {time: "4:00 PM"},
    {time: "4:30 PM"},
    {time: "5:00 PM"},
    {time: "5:30 PM"},
    {time: "6:00 PM"},
    {time: "6:30 PM"},
    {time: "7:00 PM"},
    {time: "7:30 PM"},
    {time: "8:00 PM"},
    {time: "8:30 PM"},
    {time: "9:00 PM"}  
  ],
  schedule: [
    {date: "01/01/2015"},
    {date: "02/01/2015"},
    {date: "03/01/2015"},
    {date: "04/01/2015"},
    {date: "05/01/2015"},
    {date: "06/01/2015"},
    {date: "07/01/2015"},
    {date: "08/01/2015"},
    {date: "09/01/2015"},
    {date: "10/01/2015"},
    {date: "11/01/2015"},
    {date: "12/01/2015"}
  ],
  school: [
    {course: "BSIT"},
    {course: "BSME"},
    {course: "BSEE"},
    {course: "BSCE"},
  ]
 });
  Template.course.helpers({
  variable: [
    {section: "G1"},
    {section: "F1"},
    {section: "H1"},
    {section: "B1"},
    {section: "Z1"}
    ]
  });*/

  Template.upload.onCreated( () =>{
      Template.instance().uploading = new ReactiveVar(false);
});
  Template.upload.helpers({
    uploading() {
      return Template.instance().uploading.get();
    }
  });

 Template.upload.events({
  'change [name="uploadCSV"]' (event, template){
    template.uploading.set(true);

    Papa.parse(event.target.files[0],{
      header : true,
      complete(results, file ){
        Meteor.call('parseUpload', results.data, (error, response) => {
          if(error){
            console.log(error.reason);
          }else{
            template.uploading.set(false);
            Bert.alert('Upload complete', 'success', 'growl-top-right');
          }
        });
      }
    });
  }
 });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
   parseUpload( data ) {
    check( data, Array );

    for ( let i = 0; i < data.length; i++ ) {
      let item   = data[ i ],
          exists = Sales.findOne( { salesId: item.salesId } );

      if ( !exists ) {
        Sales.insert( item );
      } else {
        console.warn( 'Rejected. This item already exists.' );
      }
    }
  }
  });
}
