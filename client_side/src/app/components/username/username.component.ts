import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import * as io from 'socket.io-client';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent{
  @Output() userNameEvent = new EventEmitter <string> ()

  userName = '';

  constructor() { }

  setUserName(): void{
    this.userNameEvent.emit(this.userName)
  }


}
