import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AlertType } from '../../enums/alert-type.enum';
import { AlertService } from '../../services/alert.service';
import { Alert } from "../../classes/alert";
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  //Para validar el Login Page
  public loginForm: FormGroup;
  private subscriptions: Subscription[] = [];
  private returnURL: string;


  constructor( private formBuilder : FormBuilder,
               private _alertService: AlertService,
               private _loadingService: LoadingService,
               public _authService: AuthService,
               private router: Router,
               private route: ActivatedRoute) {

                    this.createForm();
   }

  ngOnInit()  {

    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/chat';

    this.subscriptions.push(
      this._authService.currrentUser.subscribe( user =>{
        if(!!user){
          this.router.navigateByUrl('/chat');
        }
      })
    )
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]

    });
  }

  public submit(): void {

    if( this.loginForm.valid){

      this._loadingService.isLoading.next(true);
     
      const {email,password} = this.loginForm.value;
      //TODO call the auth service
      //Suscripcion al login
      this.subscriptions.push(
        this._authService.login(email, password).subscribe(success =>{
          if(success){
            this.router.navigateByUrl(this.returnURL);
          }else{
            this.displayFailedLogin();
          }
            this._loadingService.isLoading.next(false);
        })
      );  
      }else{
          this._loadingService.isLoading.next(false);
          this.displayFailedLogin();       
      }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( subscription =>{
      subscription.unsubscribe();
    }); 
  }

  private displayFailedLogin(): void {

    const failedLoginAlert = new Alert('Tu email o password son incorrectos. Intentelo otra vez.', AlertType.Danger);
    this._alertService.alerts.next( failedLoginAlert);

  }

}
