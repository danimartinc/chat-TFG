import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Alert } from '../classes/alert';
import { AlertService } from '../services/alert.service';
import { AlertType } from "./../enums/alert-type.enum";
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _authService: AuthService,
               private router: Router,
               private _alertService: AlertService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

      return this._authService.currrentUser.pipe(
        take(1),
        map((currentUser) => !!currentUser),
        tap((loggedIn) => {
            if(!loggedIn){
              this._alertService.alerts.next(new Alert('Debe estar loageado para entrar en esta página.', AlertType.Danger));
              this.router.navigate(['/login'],{queryParams: { returnURL: state.url }});
            }
        })
      )
  }
  
}
