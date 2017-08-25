/**
 * Created by raehowe on 2017/7/25.
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from './../config';
import { UserInfo } from './../head-page/head-page'

@Component({
  selector: 'page-allday-site-info',
  templateUrl: 'allday-site-info.html'
})

export class AlldaySiteInfo {
  ip : string;
  port : string;

  parknums : string[];
  userInfo : UserInfo;
  username : string;
  day : string;
  time : string;

  showDay : string;
  showTime : string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.parknums = navParams.get('parknums');
    this.userInfo = navParams.get('userInfo'); //目前登录用户的用户信息
    this.username = navParams.get('username'); //目前登录用户的用户名
    this.day = navParams.get('day');
    this.time = navParams.get('time');
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;

    switch (this.day){
      case '0':
        this.showDay = '今天';
        break;
      case '1':
        this.showDay = '明天';
        break;
      case '2':
        this.showDay = '后天';
        break;
      default :
        this.showDay = '错误信息';
    }

    switch (this.time){
      case '2':
        this.showTime = '全天';
        break;
      default :
        this.showTime = '错误信息';
    }

  }

  confirmBill(obj, index){
    console.log('下订单');
  }

  selectForenoon(){
    console.log("租上午")
  }

  selectAfternoon(){
    console.log("租下午")
  }

  selectAllday(){
    console.log('租全天')
  }
}

export class AllDaySiteInfo{
  id: number; //id
  parknum: string; //车位号
  start_time: string; //开始时间
  end_time: string; //结束时间
  // start_time_system: string; //开始时间(时间戳类型)
  // end_time_system: string; //结束时间(时间戳类型)
  daymark: string;
  phasemark: string;
  status: string;
}
