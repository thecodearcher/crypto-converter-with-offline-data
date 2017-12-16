import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


/*
  Provider used to get users network connection info
*/
@Injectable()
export class NetworkProvider {

  constructor(private toast:ToastController,private network:Network) {
    
  }
 
  onConnect(){
    return this.network.onConnect();
  }

  onDisconnect() {
    return this.network.onDisconnect();
  }
  
  onChange() {
    return this.network.onchange();
  }

  getConnetionStatus(connectStatus: string){
    
    let msg ='';
      connectStatus == 'offline' ? msg = `You Are ${connectStatus} Please Note Last Market Price Would Be Used For Conversion Untill 
      Connection Is Restored`: msg = `You Are ${connectStatus}`;

   this.toast.create({
      message: msg,
      position: "top",
      duration: 3000

    }).present();
  }
}
