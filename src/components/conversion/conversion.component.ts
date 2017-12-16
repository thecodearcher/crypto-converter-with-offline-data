import { Component } from '@angular/core';
import { ModalController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { SqlProvider } from '../../providers/sql/sql';
import { CryptoInfoProvider } from '../../providers/crypto-info/crypto-info';
import { OpenNativeSettings } from "@ionic-native/open-native-settings";


@Component({
  selector: 'app-conversion',
  templateUrl: 'conversion.component.html'
})
export class ConversionComponent {
  
  //variables for market price of btc
  btc_usd: number;
  btc_eth: number;
  btc_ngn: number;

  //variables for market price of eth
  eth_usd: number;
  eth_btc: number;
  eth_ngn: number;

  //general variables 
  user_input: number = 0;
  selected_from_type: string = 'Tap To Convert';
  total = [];
  
  constructor(private platform: Platform,private openNativeSettings: OpenNativeSettings,private alertCtrl:AlertController,private loadingCtrl: LoadingController,private modalCtrl: ModalController, private db: SqlProvider,private crypto: CryptoInfoProvider) {
      
     
  

    this.init('Getting Price Data');
     }
  
     reset(){
       this.user_input = 0;
       this.selected_from_type = 'Tap To Convert';
       this.total=[];
     }

  showConvert(){
    let modal = this.modalCtrl.create("ConvertModalPage");
    
    //get data back from modal if available
    modal.onDidDismiss(data=>{
      if(data){
        if(data.user_input){
      this.user_input = data.user_input;
      this.selected_from_type = data.type;
        
          this.total = [];
          switch (data.type) {
            case 'btc':
              this.total = [
                {
                  'price': this.convert(this.user_input, this.btc_usd),
                  'key': 'USD'
                },
                {
                  'price': this.convert(this.user_input, this.btc_ngn),
                  'key': "NGN"
                },
                {
                  'price': this.convert(this.user_input, this.btc_eth),
                  'key': 'ETH'
                }
              ];
              break;
            case 'eth':
              this.total = [
                {
                  'price': this.convert(this.user_input, this.eth_usd),
                  'key': 'USD'
                },
                {
                  'price': this.convert(this.user_input, this.eth_ngn),
                  'key': "NGN"
                },
                {
                  'price': this.convert(this.user_input, this.eth_btc),
                  'key': 'BTC'
                }
              ];
              break;
            case 'usd':
              this.total = [
                {
                  'price': this.convert(this.user_input, this.btc_usd, true),
                  'key': 'BTC'
                },
                {
                  'price': this.convert(this.user_input, this.eth_usd, true),
                  'key': "ETH"
                },
              ];
              break;
            case 'ngn':
              this.total = [
                {
                  'price': this.convert(this.user_input, this.btc_ngn, true),
                  'key': 'BTC'
                },
                {
                  'price': this.convert(this.user_input, this.eth_ngn, true),
                  'key': "ETH"
                },
              ];
              break;
            default:
              break;
          }
    }
      }

     
    });

    //show modal
    modal.present();
  }

  async init(msg){
    let loading = this.loadingCtrl.create({
      content: `${msg}, Please wait...`,
      
    });
    loading.present();
    this.db.getDatabaseState()
      .subscribe(state => {
        if (state) {
          this.crypto.getCryptoInfo()
            .subscribe(data => {
            this.db.storeOffline(data)
                .then(() => {
                  
                 
                  //store btc details in variables
                  this.btc_usd = data.BTC.USD;
                  this.btc_ngn = data.BTC.NGN;
                  this.btc_eth = data.BTC.ETH;

                  //store ether details in variables
                  this.eth_usd = data.ETH.USD;
                  this.eth_ngn = data.ETH.NGN;
                  this.eth_btc = data.ETH.BTC;
                  loading.dismiss();
                  
                }).catch(() => {
                  loading.dismiss();
                  
                });
            },
            err => {
              
              this.db.getOfflineData()
                .then(result => {
                  
                  if(result.length<=0){
                    loading.dismiss().then(()=>{
                      this.presentConfirm();
                    });
                  }else{
                  result.forEach(data => {
                  
                  
                  //store btc details in variables
                  this.btc_usd = data.btc_usd;
                  this.btc_ngn = data.btc_ngn;
                  this.btc_eth = data.btc_eth;

                  //store ether details in variables
                  this.eth_usd = data.eth_usd;
                  this.eth_ngn = data.eth_ngn;
                  this.eth_btc = data.eth_btc;
                  loading.dismiss();
                })
              }
                }
              )
                .catch((err)=>{
                  loading.dismiss();
                  
                })

            });
        }
      });

  }

  
  round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  convert(amount: any,rate:number,reverse=false) {
    if(reverse){
      amount = parseFloat(amount);
      let total = (amount / rate);
      return this.round(total, 4);
    }else{
    amount = parseFloat(amount);
      let total = (amount * rate);
      return this.round(total, 4);
    }
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Turn On Data To Get Conversion Rate',
      subTitle:"This is only required at first launch",
      message: 'Go to settings to turn on data now?',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.platform.exitApp();
            
          }
        },
        {
          text: 'Open Settings',
          handler: () => {
            this.openNativeSettings.open("settings")
            .then(()=>{
              this.platform.exitApp();
              
            }).catch(()=>this.platform.exitApp());
          }
        }
      ]
    });
    alert.present();
  }

  
}
