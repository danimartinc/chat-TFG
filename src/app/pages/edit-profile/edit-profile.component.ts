import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { User } from 'src/app/interfaces/user';
import { AlertService } from '../../services/alert.service';
import { AlertType } from 'src/app/enums/alert-type.enum';
import { Alert } from 'src/app/classes/alert';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public currentUser: any = null;
  public userID: string = '';
  private subsubcriptions: Subscription[] = [];
   public uploadPercent: Observable<number>;
  public downloadURL: Observable<string>;

  constructor( private _auth: AuthService,
               private _loadingService: LoadingService,
               private route: ActivatedRoute,
               private storage: AngularFireStorage,
               private database: AngularFirestore,
               private location: Location,
               private _alertService: AlertService) {

                this._loadingService.isLoading.next(true);
  }

  ngOnInit(): void {
    this.subsubcriptions.push(
      this._auth.currrentUser.subscribe( user =>{
        this.currentUser = user;
        this._loadingService.isLoading.next(false);
      })
    );

    this.subsubcriptions.push(
      this.route.paramMap.subscribe( params =>{
        this.userID = params.get('userID');
      })
    )
  }

  public uploadFile(event): void{

    const file = event.target.files[0];
    const filePath = `${file.name}_${this.currentUser.id}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);


    //Observe the percentage changes
    this.subsubcriptions.push(
      task.percentageChanges().subscribe(percentage =>{
        if(percentage <100){
          this._loadingService.isLoading.next(true);
        }else{
          this._loadingService.isLoading.next(false);
        }
        this.uploadPercent = task.percentageChanges();
      })
    );
    
    console.log(filePath);

    //Get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL()))
                                                 .subscribe()
  }

  public save(): void {

    let photo;

    if(this.downloadURL){
      photo = this.downloadURL;
    }else{
      photo = this.currentUser.photoURL; 
    }

    const user = Object.assign({}, this.currentUser, {photoURL: photo});
    const userRef: AngularFirestoreDocument<User> = this.database.doc(`users/${user.id}`);
    console.log('guardado uno');
    userRef.set(user);
    console.log('guardado dos');
    this._alertService.alerts.next(new Alert('Tu perfil se ha actualizado correctamente!!', AlertType.Success));
    this.location.back();

  }

  ngOnDestroy(){
    this.subsubcriptions.forEach( subscription => subscription.unsubscribe());
  }

}
