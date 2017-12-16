import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ConversionComponent } from '../../components/conversion/conversion.component';
import { ConvertModalPage } from '../convert-modal/convert-modal';



/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(ConversionComponent) conversion: ConversionComponent;
  @ViewChild(ConvertModalPage) convertModal: ConvertModalPage;
  
  constructor() {
   
  }

  async doRefresh(refresher){
     await this.conversion.init('Refreshing')
      .then(status=>{
        refresher.complete();

      }).catch(()=>{
        
      })
  }

  ionViewDidLeave() {
    
    this.convertModal.onConnect.unsubscribe();
    this.convertModal.onDisconnect.unsubscribe();

  }
  
}
