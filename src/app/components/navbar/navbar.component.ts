import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public currentUser: any = null;

  constructor( public _authService: AuthService) { }

  ngOnInit(): void {
    this._authService.currrentUser.subscribe( user =>{
      this.currentUser = user;
    });
  }
  
//NO VA AQUI
 // public logout(): void {
   // this._authService.logout();
 //s }

}
