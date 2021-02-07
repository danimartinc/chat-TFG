import { Component, OnInit } from '@angular/core';
import { Message } from '../../../../classes/message';
import { ChatroomService } from '../../../../services/chatroom.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  public newMessageText: string = '';

  constructor( private _chatroomService: ChatroomService) { }

  ngOnInit(): void {
  }

  public submit(message: string): void {

    this._chatroomService.createMessage(message)
   

    //Reset input
    this.newMessageText = '';
  }

}
