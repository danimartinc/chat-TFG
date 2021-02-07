import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AlertType } from '../../enums/alert-type.enum';
import { AlertService } from '../../services/alert.service';
import { Alert } from "../../classes/alert";
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  //Para validar el Login Page
  public signupForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(  private formBuilder : FormBuilder,
                private _alertService: AlertService,
                private _loadingService: LoadingService,
                public _authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
             
                this.createForm();
   }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]

    });
  }

  public submit(): void {

    if( this.signupForm.valid){

      const { firstName, lastName, email,password} = this.signupForm.value;

      //TODO call the auth service

      this.subscriptions.push(
        this._authService.signUp( firstName, lastName, email, password)
            .subscribe( success =>{
              if(success){
                this.router.navigate(['/chat']);
              }else{

                const failedSignupAlert = new Alert('Hay un problema con el inicio de sesión. Intentelo otra vez.', AlertType.Danger);
                this._alertService.alerts.next(failedSignupAlert);

              }
              this._loadingService.isLoading.next(false);
            })
      );
    
    }else{

      const failedSignedAlert = new Alert('Por favor, introduzca un nombre, email o password válidos. Intentelo otra vez.', AlertType.Danger);
      this._alertService.alerts.next(failedSignedAlert);
    }
  }

  ngOnDestroy(): void {
    
    this.subscriptions.forEach( subscription =>{
      subscription.unsubscribe();
    })
    
  }

}
