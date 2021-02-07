import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from './classes/alert';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {


  private subscriptions: Subscription[] = [];
  public alerts : Array<Alert> = [];
  public loading: boolean = false;

  //Conectamos con el servcio de alerta
  constructor( private _alertService: AlertService,
               private _loadingService: LoadingService ){


  }

  ngOnInit() {

    this.subscriptions.push(
      this._alertService.alerts.subscribe( alert =>{
        this.alerts.push(alert);
      })
    )

    this.subscriptions.push(
      this._loadingService.isLoading.subscribe(isLoading =>{
        this.loading = isLoading;
      })
    )
  }

  ngOnDestroy(): void {
    
    this.subscriptions.forEach( subscription =>
       subscription.unsubscribe());
    
  }
}
