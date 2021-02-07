import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Alert } from '../classes/alert';
import { AlertService } from '../services/alert.service';
import { AlertType } from "./../enums/alert-type.enum";
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { nextTick } from 'process';


@Injectable({
  providedIn: 'root'
})
export class IsOwnerGuard implements CanActivate {

  constructor( private _auth: AuthService,
               private router: Router,
               private _alertService: AlertService){

               }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> {
    
      return this._auth.currrentUser.pipe(
        take(1),
        map((currentUser) => !!currentUser && currentUser.id === next.params.userID),
        tap((IsOwner)=>{
          if(!IsOwner){
            this._alertService.alerts.next(new Alert('USted solo puede editar su perfil', AlertType.Danger));
            this.router.navigate(['/login'],{queryParams:{returnURL: state.url}});
          }
        })
      );
  }
  
}
