import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AlertType  } from "./../enums/alert-type.enum";
import { Observable } from 'rxjs';
import { User } from "../interfaces/user";
import { AlertService } from './alert.service';
import { Alert } from '../classes/alert';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currrentUser: Observable<User | null>;
  public currentUserSnapshot: User | null;

  constructor( private router: Router,
               private _alertService: AlertService,
               public afAuth: AngularFireAuth,
               private database: AngularFirestore) {
                
      this.currrentUser = this.afAuth.authState
                              .pipe(
                              switchMap((user) => {
                                if(user){
                                  return this.database.doc<User>(`users/${ user.uid }`)
                                             .valueChanges();
                                }else{
                                  return of(null);
                                }
                              }))
      
          this.setcurrenteUserSnapshot();
  }

  public signUp( firstName: string, lastName: string, email:string, password: string ): Observable<boolean>{

    var observableFromPromise = from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
          .then((user) =>{
            const userRef: AngularFirestoreDocument<User> = this.database.doc(`users/${ user.user.uid }`);
            const updatedUser = {
              id: user.user.uid,
              email: user.user.email,
              firstName,
              lastName,
              photoURL: 'https://firebasestorage.googleapis.com/v0/b/chat-app-9ce7a.appspot.com/o/default_profile_pic.jpg?alt=media&token=709a7ac3-d768-4eee-8d8f-dd421ad6688b',
              quote: 'Life is like a box of chocolates, you never know what you are gonna get!!',
              bio: 'Bio is under construction...'
            }

            userRef.set(updatedUser);
            return true;
          })
          .catch((error) => false)
    );

  
     return observableFromPromise;
  }

  public login( email: string, password: string): Observable<boolean>{
     
    var observableFromPromise2 =  from(
      this.afAuth.signInWithEmailAndPassword( email, password)
          .then( (user) => true)
          .catch( (error) => false)

          
    );
    console.log('pasa1');
    return observableFromPromise2;
  }

  public logout(): void{
    
    this.afAuth.signOut()
        .then(()=>{
          this.router.navigate(['/login']);
          const signedOutAlert = new Alert('Ha cerrado sesión');
          this._alertService.alerts.next(signedOutAlert);
        });
  }

  private setcurrenteUserSnapshot(): void {
    this.currrentUser.subscribe( user => this.currentUserSnapshot = user);
  }
}
