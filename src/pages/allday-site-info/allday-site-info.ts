/**
 * Created by raehowe on 2017/7/25.
 */

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Config } from './../config';
import { UserInfo } from './../head-page/head-page'
import { Http, Headers, RequestOptions } from '@angular/http';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
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

  confirmBill(parkNum: string){
    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "siteno="+parkNum;

    this.http
        .post('http://'+this.ip+':'+this.port+'/selTelWithSiteno', body, options) //根据车位号查询出用户的电话信息
        .subscribe(data => {
          var tmpState = data.json().success;
          var telephone = data.json().telephone; //查找到的车位信息,可能为一条数据,也能能是多条数据组成的数组
          if (tmpState == "true"){ //说明查找到了车位信息
            this.loadView(obj, this.userInfo, this.username, telephone, this.starttimes[i], this.endtimes[i]);
          }else if(tmpState == "false"){
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '没有查找到相关车位信息',
              buttons: ['确定']
            });
            alert.present();
          }
        }), error => {
      console.log("ERROR!:", error);
    };
  }

  selectForenoon(parkNum: string){
    this.confirmBill(parkNum)
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
  daymark: string;
  phasemark: string;
  status: string;
}
