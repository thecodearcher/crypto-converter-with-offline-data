import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
import { CRYPTO } from '../../model/crypto/crypto.interface';
import { BehaviorSubject } from 'rxjs/Rx';


/**
*  Provider Class For SQLite Database Operations
*/
@Injectable()
export class SqlProvider {

  private databaseReady: BehaviorSubject<boolean>;
  db:SQLiteObject;
  constructor(private sql:SQLite,private platform:Platform) {
     this.init(); 
  }

  init(){
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready()
      .then(() => {
        this.sql.create({
          name: "bcryptconverter",
          location: "default",
        }).then((db: SQLiteObject) => {
          this.db = db;
          this.databaseReady.next(true);
        }).then(() => {
          this.createDbTable();
        })
      })

  }

  createDbTable(){
    let sql = "CREATE TABLE IF NOT EXISTS rate(id INTEGER PRIMARY KEY AUTOINCREMENT , btc_ngn TEXT, btc_usd TEXT, btc_eth TEXT, eth_ngn TEXT, eth_usd TEXT, eth_btc TEXT )";
    this.db.executeSql(sql,[]).then(()=>{
        let sql = "CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY AUTOINCREMENT , set_btc BOOLEAN, low_btc TEXT, high_btc TEXT, set_eth BOOLEAN,low_eth TEXT,high_eth TEXT )";
        this.db.executeSql(sql,[]).then(()=>{
          this.countsettings()
          .then(ref=>{
            if(ref.rows.length<=0){
            this.creatSettingsTable()
              .then(()=> {})
              .catch(()=> {});
            }
          })
          .catch(()=>{});
        }).catch(()=>{})   
    })
    .catch(()=>{});
  }

  storeOffline(rate: CRYPTO) {
    let sql = "update rate set btc_usd=?,btc_ngn=?,btc_eth=?,eth_usd=?,eth_ngn=?,eth_btc=?";
    return this.db.executeSql(sql, [rate.BTC.USD, rate.BTC.NGN, rate.BTC.ETH,rate.ETH.USD, rate.ETH.NGN, rate.ETH.BTC])
      .then(ref => {
        if (ref.rowsAffected == 0) {
          let sql = "insert into rate (btc_usd,btc_ngn,btc_eth,eth_usd,eth_ngn,eth_btc) values (?,?,?,?,?,?)";
          return this.db.executeSql(sql, [rate.BTC.USD, rate.BTC.NGN, rate.BTC.ETH, rate.ETH.USD, rate.ETH.NGN, rate.ETH.BTC])
            .then(ref =>{})
            .catch(() => {});
        }
      })
  }
  

  data = [];
  getOfflineData(){
    let sql = "select * from rate";
    this.data = [];
    return this.db.executeSql(sql, [])
      .then(data => {
        for (var i = 0; i < data.rows.length; i++) {
          this.data.push(data.rows.item(i));
        }
        
        return this.data;
      })
      .catch(e => {
        return [];
      });
  }

 
  countsettings(){
    let sql = "select id from settings";
    this.data = [];
    return this.db.executeSql(sql, [])
      .then(data => {
     return  data;  
      }).catch(err=>{})
}
  getSettings() {
    let sql = "select * from settings";
    this.data = [];
    return this.db.executeSql(sql, [])
      .then(data => {
        for (var i = 0; i < data.rows.length; i++) {
          this.data.push(data.rows.item(i));
        }
        
        return this.data;
      })
      .catch(err => {
        for (var i = 0; i < err.rows.length; i++) {
          this.data.push(err.rows.item(i));
        }
        return this.data;
      });
  }

  setBtc(type,value){
    let sql='';
    switch (type) {
      case 'btc':
        sql = "update settings set set_btc=?,low_btc=?,high_btc=?";
        break;
      case 'eth':
         sql = "update settings set set_eth=?,low_eth=?,high_eth=?";
      default:
        break;
    }
    return this.db.executeSql(sql, value)
    .then(()=>{})
    .catch(()=>{});
  }

  creatSettingsTable(){
    let sql = "update settings set set_btc=?,low_btc=?,high_btc=?,set_eth=?,low_eth=?,high_eth=?";
    return this.db.executeSql(sql, [false, 0, 0,false,0,0])
      .then(ref => {
        if (ref.rowsAffected == 0){
        let sql = "insert into settings (set_btc,low_btc,high_btc,set_eth,low_eth,high_eth) values (?,?,?,?,?,?)";
        return this.db.executeSql(sql, [false,0, 0,false, 0,0])
          .then(() => {})
          .catch(() =>{});
        }
    })
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }
}
