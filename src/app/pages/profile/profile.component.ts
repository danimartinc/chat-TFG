import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public currentUser: any = null;
  public user: User;
  private subscriptions: Subscription[] = [];

  constructor( private _auth: AuthService,
               private _loadingService: LoadingService,
               private route: ActivatedRoute,
               private database: AngularFirestore ) {
                 
                this._loadingService.isLoading.next(true);
               }

  ngOnInit(): void {
    this.subscriptions.push(
      this._auth.currrentUser.subscribe( user =>{
        this.currentUser = user;
        this._loadingService.isLoading.next(false);
      }));
    
      this.subscriptions.push(
        this.route.paramMap.subscribe( params =>{
          const userID = params.get('userID');
          const userRef : AngularFirestoreDocument<User> = this.database.doc(`users/${userID}`);
          
          userRef.valueChanges().subscribe( user => this.user = user);
        })
      )
  }

  ngOnDestroy(){
    this.subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
