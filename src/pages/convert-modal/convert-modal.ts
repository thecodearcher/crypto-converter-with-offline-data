import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NetworkProvider } from '../../providers/network/network';
import { Subscription } from 'rxjs';

/**
 * Class for conversion modal page
 */

@IonicPage()
@Component({
  selector: 'page-convert-modal',
  templateUrl: 'convert-modal.html',
})
export class ConvertModalPage {
  onConnect: Subscription;
  onDisconnect: Subscription;
  //variables for market price of btc
  btc_usd: number;
  btc_eth: number;
  btc_ngn: number;

  //variables for market price of eth
  eth_usd: number;
  eth_btc: number;
  eth_ngn: number;

  //general variables 
  user_input:number;
  selected_from_type:string = 'btc';
  rate:number;

  constructor(private platform: Platform,private network: NetworkProvider,private viewCtrl: ViewController) {
    this.getNetworkStatus();
  }



  navToResult(){
    this.viewCtrl.dismiss({ 'type': this.selected_from_type, 'user_input': this.user_input });
  }

  changeType(type){
    this.selected_from_type = type;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getNetworkStatus() {
    this.platform.ready()
      .then(() => {
        this.onConnect = this.network.onConnect()
          .subscribe(() => {
            setTimeout(() => {
              this.network.getConnetionStatus("online, pull down to refresh");
              //this.init('Refreshing');
            }, 3000);
            console.log("online");
          });


        this.onDisconnect = this.network.onDisconnect()
          .subscribe(data => {
            this.network.getConnetionStatus("offline");
            console.log("offline");
          });

      });
  }
}