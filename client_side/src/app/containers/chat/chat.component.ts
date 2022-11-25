import { ChatServiceService } from './../../chat-service.service';
import { Component, OnInit ,EventEmitter} from '@angular/core';
import * as io from 'socket.io-client';
const urls = `localhost:3000`;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userName = '';
  message = '';
  messageList: {message: string, userName: string, mine: boolean}[] = [];
  userList: any[] = [];
  socket: any;
  sender: any;
  receiver: any;
  receiverId:any;
  userdata:any;
  elm : any
  event:any
  rdata:any
 list:any
  constructor(private chatservice: ChatServiceService) {
    
   }
   //where we place any initialisation logic for our component
   ngOnInit(){
     this.chatservice.get().subscribe((res)=>{
       this.userdata = res['data']
       this.userList =  this.userdata;
       for(let element of this.userdata ){
         this.elm =  element.id
         this.receiver= element.sender
        }
        console.log("this.receiver==",this.sender)
        this.socket = io.io(`http://localhost:3000/?userName=${this.sender}`);
      })
     
   }
  userNameUpdate(name: string): void {
    console.log("name==",name)
    this.socket = io.io(`http://localhost:3000/?userName=${name}`);
    this.userName = name;
    this.chatservice.get().subscribe((res)=>{
      this.userdata = res['data']
      for(let element of this.userdata ){
        this.elm =  element.id
        this.receiver= element.sender
      }
      })
    //sender declared
    this.sender = name;
    console.log(" this.sender", this.sender)
    this.socket.emit('set-user-name', name);
    const data1 ={
      sender :this.sender,
    }
    this.chatservice.add(data1).subscribe((res)=>{
      console.log("res",res)
     })
     this.userList =  this.userdata;

    this.socket.on('message-broadcast', (data: {message: string, userName: string}) => {
      if (data) {
        console.log("data of the broadcast",data)
        this.messageList.push({message: data.message, userName: data.userName, mine: false});
      }     
    });
    this.ngOnInit()
  }
 
  sendMessage(list): void {
    this.socket.emit('message', this.message, list.sender);
    // this.messageList.push({message: this.message, userName: list.sender, mine: true});
    this.message = '';
    // const id_1=this.socket.id
    this.sender = '';
    this.userList =this.userList
    console.log("this.elm",this.elm)
    const data ={
      message : this.message,
      receiver : list.sender,
      user_id: list.id
    }
    console.log("data",data)
    this.chatservice.addchat(data).subscribe((res)=>{
      console.log("res",res)
     })  
  }

  leaveMessage(): void {
    this.socket.emit('disconnect', this.userName);
    return this.socket.disconnect();
  }

  getuser(event){
    this.messageList =[]
   console.log("event",event)
   this.event = event
   this.receiverId =event.id
   this.receiver = event.sender
   this.chatservice.getOne(this.receiverId).subscribe((res1)=>{
    this.rdata= res1['data']
    for(let receivedata of this.rdata){
      console.log("res1",receivedata);
      this.messageList.push({message: receivedata.messages, userName: receivedata.receiver, mine: true});
    }
    this.socket.emit('receiver', this.receiverId);
   })
  }
  

}


