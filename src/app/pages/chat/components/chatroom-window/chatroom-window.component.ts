import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatroomService } from '../../../../services/chatroom.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  public chatroom: Observable<any>;
  private subscriptions: Subscription[] = [];
  public messages: Observable<any>;

 /*//TODO replace witn FirebaseData
  public dummyData = [
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel orci tempor, facilisis lorem eu, posuere justo. Nulla sit amet leo vestibulum, ornare lectus eget, hendrerit magna. Morbi rhoncus maximus neque, a finibus urna fringilla ac. Vestibulum dapibus eleifend gravida. Aliquam eu justo volutpat, laoreet orci a, varius magna. Praesent convallis massa egestas nisi elementum elementum. Cras interdum ex eu odio congue, ut lobortis elit maximus. Morbi et mi nec turpis maximus viverra. Donec non neque nec mi sagittis sodales non nec urna. ',
      createdAt: new Date(),
      sender: {
         firstName: 'Steve',
         lastName: 'Smith',
         photoURL: 'http://via.placeholder.com/50x50'
      }
    },

    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel orci tempor, facilisis lorem eu, posuere justo. Nulla sit amet leo vestibulum, ornare lectus eget, hendrerit magna. Morbi rhoncus maximus neque, a finibus urna fringilla ac. Vestibulum dapibus eleifend gravida. Aliquam eu justo volutpat, laoreet orci a, varius magna. Praesent convallis massa egestas nisi elementum elementum. Cras interdum ex eu odio congue, ut lobortis elit maximus. Morbi et mi nec turpis maximus viverra. Donec non neque nec mi sagittis sodales non nec urna.',
      createdAt: new Date(),
      sender: {
         firstName: 'Bob',
         lastName: 'Anderson',
         photoURL: 'http://via.placeholder.com/50x50'
      }
    },

    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel orci tempor, facilisis lorem eu, posuere justo. Nulla sit amet leo vestibulum, ornare lectus eget, hendrerit magna. Morbi rhoncus maximus neque, a finibus urna fringilla ac. Vestibulum dapibus eleifend gravida. Aliquam eu justo volutpat, laoreet orci a, varius magna. Praesent convallis massa egestas nisi elementum elementum. Cras interdum ex eu odio congue, ut lobortis elit maximus. Morbi et mi nec turpis maximus viverra. Donec non neque nec mi sagittis sodales non nec urna.',
      createdAt: new Date(),
      sender: {
         firstName: 'Steve',
         lastName: 'Smith',
         photoURL: 'http://via.placeholder.com/50x50'
      }
    },

    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel orci tempor, facilisis lorem eu, posuere justo. Nulla sit amet leo vestibulum, ornare lectus eget, hendrerit magna. Morbi rhoncus maximus neque, a finibus urna fringilla ac. Vestibulum dapibus eleifend gravida. Aliquam eu justo volutpat, laoreet orci a, varius magna. Praesent convallis massa egestas nisi elementum elementum. Cras interdum ex eu odio congue, ut lobortis elit maximus. Morbi et mi nec turpis maximus viverra. Donec non neque nec mi sagittis sodales non nec urna.',
      createdAt: new Date(),
      sender: {
         firstName: 'Steve',
         lastName: 'Smith',
         photoURL: 'http://via.placeholder.com/50x50'
      }
    }
  ];*/

  constructor(private route: ActivatedRoute,
              private _chatroomService: ChatroomService,
              private _loadingService: LoadingService) {
               
                this.subscriptions.push(
                  this._chatroomService.selectedChatroom.subscribe( chatroom =>{
                    this.chatroom = chatroom;
                  }));
        
                this.subscriptions.push(
                    this._chatroomService.selectedChatroomMessages
                        .subscribe( messages => {
                         this.messages = messages;
                      })
                );
                
                
       
    }

  ngOnInit() {

    this.scrollToBottom();

           this.subscriptions.push(
            this.route.paramMap.subscribe( params =>{
              const chatroomID = params.get('chatroomID');
              this._chatroomService.changeChatroom.next(chatroomID);
            })
          )

  }

  ngOnDestroy(){
    this.subscriptions.forEach( subscription => subscription.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
    
  }

  private scrollToBottom(): void{
    try{
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }catch(error){}
  }

}
