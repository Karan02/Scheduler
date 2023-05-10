import React from "react";
import Scheduler,{Resource} from "devextreme-react/scheduler";
import axios from "axios";

const currentDate = new Date();
const views = [{ type: "day", intervalCount: 7 },'workWeek', 'month'];
class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments:[],
      payid:"",
      orderid:"",
      id:"",
      password:"",
      link:"",
      description:"",
      recurrenceRule:"",
      text: "",
      startDate: "",
      endDate: "",
      allDay: null,
      emp:"",
      employees:[],
      timeslot:1,
      gender:null,
      email:"",
      name:"",
      age:null
    };
    this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
    this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
    this.getData = this.getData.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.createData = this.createData.bind(this);
    this.appointmentUpdate = this.appointmentUpdate.bind(this);
    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
    this.displayRazorpay = this.displayRazorpay.bind(this);
    this.appointmentSelected = this.appointmentSelected.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
    this.getEmployee = this.getEmployee.bind(this); 
    this.applyDisableDatesToDateEditors = this.applyDisableDatesToDateEditors.bind(this);
  }

  componentDidMount(){
    this.getData();
    this.getEmployee();
  }

  appointmentSelected = (e) => {
    this.setState({...this.state,...e});
  }

  createEmployee = () => {
   
    axios.post('http://localhost:3001/createEmployee/', {
      employee:this.state.emp,
    },{
      'Access-Control-Allow-Origin' : '*',
      "Content-type": "application/json; charset=UTF-8"
    }).then((res) => {
        
        this.getEmployee();
    })
    .catch(err => console.log(err))
    this.setState({...this.state,emp:''});
  }

  getEmployee = () => {
    
    axios.get('http://localhost:3001/getEmployee/',{
      'Access-Control-Allow-Origin' : '*',
      "Content-type": "application/json; charset=UTF-8"
    })
    .then(res =>{
      this.setState({...this.state,employees:res.data.employees});
    })
    .catch(err => console.log(err))
  }
  
  displayRazorpay = async (e) => {
    
    try {
       
        const data = await fetch("http://localhost:3001/razorpay", {
            method: 'POST',
            body:{
            
            }
        }).then((t) => t.json())
       
        const options = {
            key: "rzp_test_zXoOe6U2B8fZGJ",
            currency: data.currency,
            amount: data.amount,
            target:'_blank',
            description: 'Wallet Transaction',
            image: 'http://localhost:4000/logo.jpg',
            order_id: data.id,
            handler:  async (response) => {
                const payid =  response.razorpay_payment_id;
                const orderid = response.razorpay_order_id; 
                try {
                  const response = await fetch(`http://localhost:3001/generateZoomLink`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      topic: this.state.topic,
                      userId: 'malvirinkal19@gmail.com',
                    }),
                  });
                  const data = await response.json();
                   this.setState({...this.state,link:data.joinUrl,id:data.meetingId,password:data.password,payid:payid,orderid:orderid});
                 } catch (error) {
                  console.error(error);
                }
            },
            prefill: {
                //fill out the dtails
                name: "Dr. Sharma",
                email: "kashishgupta@gamil.com",
                contact: "+917379560631"
            }
        };

       
        const paymentObject = new window.Razorpay(options)
      
        paymentObject.open();
    }
catch (error) {
    console.error('Error while fetching or processing payment details:', error)
}
}
 
  getData = () => {
    fetch('http://localhost:3001/appointments',{
      method:'GET',
      headers: {
        'Access-Control-Allow-Origin' : '*',
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(res => res.json())
    .then(data => this.setState({
      ...this.state,
      appointments:data,
      
    }))
  }
  appointmentUpdate = (data) => {
    axios.post('http://localhost:3001/appointmentsChange',
      
      {
        ...data
      },{
        'Access-Control-Allow-Origin' : '*',
        "Content-type": "application/json; charset=UTF-8"
      }
    )
    .then(() => {
      this.getData();
    }).catch(err => {
      console.log(err);
    })
  }

  deleteData = (data) => {
    
    fetch('http://localhost:3001/appointment',{
      method:'DELETE',
      headers: {
        'Access-Control-Allow-Origin' : '*',
        "Content-type": "application/json; charset=UTF-8"
      },
      body:JSON.stringify({
        ...data
      })
    })
    .then(() =>{
      this.getData();
    })
    .catch(err => console.log(err))
  }

  createData = (data) => {
    fetch('http://localhost:3001/appointment',{
      method:'POST',
      headers: {
        'Access-Control-Allow-Origin' : '*',
        "Content-type": "application/json; charset=UTF-8"
      },
      body:JSON.stringify({
        ...data
      })
    })
    .then(() => {
      this.getData();
    }).catch(err =>{
      console.log(err);
    })
  }


  onAppointmentFormOpening(e) {
    e.popup.option('showTitle', true);
    e.popup.option('title', e.appointmentData.text ? 
        e.appointmentData.text : 
        'Create a new appointment');
    const form = e.form;
    let formItems = form.option("items");
    if (!formItems.find(function(i) { return i.dataField === "name" })) {
      formItems.push({
          colSpan: 2,
          label: { text: "Name" },
          editorType: "dxTextBox",
          dataField: "name"
      });    
    }
    if (!formItems.find(function(i) { return i.dataField === "age" })) {
      formItems.push({
          colSpan: 2,
          label: { text: "Age" },
          editorType: "dxTextBox",
          dataField: "age"
      });    
    }
    if (!formItems.find(function(i) { return i.dataField === "email" })) {
      formItems.push({
          colSpan: 2,
          label: { text: "Email" },
          editorType: "dxTextBox",
          dataField: "email"
      });    
    }
    if (!formItems.find(function(i) { return i.dataField === "gender" })) {
      formItems.push({
          colSpan: 2,
          label: { text: "Gender" },
          editorType: "dxRadioGroup",
          editorOptions:{
            items:['Male','Female']
          },
          dataField: "gender",
      });    
    }
    if(this.state.id){
      if (!formItems.find(function(i) { return i.dataField === "id" })) {
        formItems.push({
            colSpan: 2,
            label: { text: "Meeting ID" },
            editorType: "dxTextBox",
            dataField: "id",
            disabled:true
        });    
      }
    }
    if(this.state.link){
      if (!formItems.find(function(i) { return i.dataField === "link" })) {
          formItems.push({
              colSpan: 2,
              label: { text: "Meeting Link" },
              editorType: "dxTextBox",
              dataField: "link",
              disabled:true
          });
      }
    }
    if(this.state.password){
      if (!formItems.find(function(i) { return i.dataField === "password" })) {
        formItems.push({
            colSpan: 2,
            label: { text: "Meeting Password" },
            editorType: "dxTextBox",
            dataField: "password",
            disabled:true
        });    
      }
    }
    
    if (!formItems.find(function(i) { return i.dataField === "payment-button" }) && (this.state.link == "")){
      formItems.push({
          label: { text: "Payment Button" },
          itemType:'button',
          dataField: "payment-button",
          buttonOptions:{
            onClick: (e) => this.displayRazorpay(e),
            text:"Pay Now",
            type:'default',
          },
      });    
    }
    form.option("items", formItems);
    this.applyDisableDatesToDateEditors(e.form);
  }

 
   applyDisableDatesToDateEditors = (form) => {
 
  };


  render() {
    return (
      <div className="container">
        <h1 className="title-office">Dr. Sharma's Appointment</h1>
     
     
      <React.Fragment>
        <Scheduler
          timeZone="America/Los_Angeles"
          id="scheduler"
          dataSource={this.state.appointments}
          views={views}
          height={850}
          width={1000}
          startDayHour={10}
          endDayHour={17}
          allDayPanelMode={'hidden'}
          editing={true}
          onAppointmentAdded={(e) => {
            this.onAppointmentAdd(e.appointmentData);
          }
          }
          onAppointmentDeleted={(e) => this.onAppointmentRemove(e.appointmentData)}
          onAppointmentUpdated = {(e) =>{
            let data = {...e.appointmentData};
            this.appointmentUpdate(data);
            this.setState({  
                ...this.state  
                ,payid:"",
                orderid:"",
                id:"",
                password:"",
                link:"",
                description:"",
                recurrenceRule:"",
                text: "",
                startDate: "",
                endDate: "",
                allDay: null,
                timeslot:1,
                gender:null,
                email:"",
                name:"",
                age:null
                })
          } }
          onAppointmentFormOpening={this.onAppointmentFormOpening}
         
          onAppointmentClick={(e) => {
            this.appointmentSelected(e.appointmentData);
            }
          } 
        >
        </Scheduler>
      </React.Fragment>
      </div>
    );
  }
  onAppointmentRemove(e) {
      this.deleteData(e);
      this.setState({  
        ...this.state  
        ,payid:"",
        orderid:"",
        id:"",
        password:"",
        link:"",
        description:"",
        recurrenceRule:"",
        text: "",
        startDate: "",
        endDate: "",
        allDay: null,
        timeslot:1,
        gender:null,
        email:"",
        name:"",
        age:null        
      })
  }
  onAppointmentAdd(e) {
    // this.generateZoomLink(e);
    let obj = {...this.state,...e,appointments:null};
    this.createData(obj);
    this.setState({  
    ...this.state  
    ,payid:"",
    orderid:"",
    id:"",
    password:"",
    link:"",
    description:"",
    recurrenceRule:"",
    text: "",
    startDate: "",
    endDate: "",
    allDay: null,
    timeslot:1,
    gender:null,
    email:"",
    name:"",
    age:null    
  })
  }
  onListDragStart(e) {
    e.cancel = true;
  }
  onItemDragStart(e) {
    e.itemData = e.fromData;
  }
  onItemDragEnd(e) {
    if (e.toData) {
      e.cancel = true;
    }
  }
}
export default Booking;