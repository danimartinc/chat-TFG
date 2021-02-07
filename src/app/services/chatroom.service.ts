import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { LoadingService } from './loading.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  public chatrooms: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;

  constructor( private database: AngularFirestore,
               private _loadingService: LoadingService,
               private _authService: AuthService) {

                this.selectedChatroom = this.changeChatroom.pipe(
                  switchMap( chatroomID =>{
                    if(chatroomID){
                      console.log('Seleccionado chatroom');
                      return database.doc(`chatrooms/${chatroomID}`).valueChanges();               
                    }
                    return of(null);
                  }));

                  this.selectedChatroomMessages= this.changeChatroom.pipe(
                    switchMap( chatroomID =>{
                      if(chatroomID){
                        console.log('Seleccionado chatroomMENSAJE');
                        return database.collection(`chatrooms/${chatroomID}/messages`, ref =>{
                          return ref.orderBy('createdAt', 'desc').limit(100);
                        })
                          .valueChanges()
                          .pipe(map( array => array.reverse()));               
                      }
                      return of(null);
                    }));
                 
        this.chatrooms = database.collection('chatrooms').valueChanges();
   }

   public createMessage(text: string):void {
     const chatroomID = this.changeChatroom.value;
     const message = {
       message: text,
       createdAt: new Date(),
       sender: this._authService.currentUserSnapshot
     };

     this.database.collection(`chatrooms/${chatroomID}/messages`).add(message);
   }
}
