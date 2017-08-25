import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from './../config'


@Component({
  selector: 'page-sel-bill-site',
  templateUrl: 'sel-bill-site.html'
})

export class SelBillSite {
  ip : string;
  port : string;

  billInfos: BillInfo[];

  showSiteInfo: BillInfo[];
  starttimes: string[];
  endtimes: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.billInfos = navParams.get("billInfos");
    this.starttimes = navParams.get("starttimes");
    this.endtimes = navParams.get("endtimes");
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;

    this.showSiteInfo = [];
    for (var i = 0; i < this.billInfos.length; i++){
      var billObj = new BillInfo();
      billObj.customertel = this.billInfos[i].customertel;
      billObj.customername = this.billInfos[i].customername;
      billObj.siteno = this.billInfos[i].siteno;
      billObj.vendortel = this.billInfos[i].vendortel;
      billObj.vendorname = this.billInfos[i].vendorname;
      billObj.starttime_system = this.billInfos[i].starttime;
      billObj.endtime_system = this.billInfos[i].endtime;
      billObj.starttime = this.starttimes[i];
      billObj.endtime = this.endtimes[i];

      this.showSiteInfo.push(billObj);
    }
  }
}

export class BillInfo{
  customertel: string; //租赁车位用户的电话
  customername: string; //租赁车位用户的用户名
  siteno: string; //车位号
  vendortel: string; //被租赁车位用户的电话
  vendorname: string; //被租赁车位用户的用户名
  starttime: string; //开始时间(界面展示)
  endtime: string; //结束时间(界面展示)
  starttime_system: string; //开始时间(时间戳类型的数据)
  endtime_system: string; //结束时间(时间戳类型的数据)
}
