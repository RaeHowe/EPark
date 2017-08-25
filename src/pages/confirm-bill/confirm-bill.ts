import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { SiteInfo } from '../site-info/site-info'
import { Http, Headers, RequestOptions } from '@angular/http'
import { UserInfo } from '../head-page/head-page';
import { Config } from './../config';

/*
  Generated class for the ConfirmBill page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-confirm-bill',
  templateUrl: 'confirm-bill.html'
})
export class ConfirmBillPage {

  siteInfo: SiteInfo; //里面包含了车位号信息,开始时间,结束时间
  userInfo: UserInfo;
  username: string;
  telephone: string;
  vendorname: string;
  id: number; //车位表id
  starttime: string;
  endtime: string;

  ip : string;
  port : string;

  constructor(public navCtrl:NavController, public navParams:NavParams, public http:Http, public loadCtrl:LoadingController, public alertCtrl:AlertController) {
    this.siteInfo = navParams.get('object');
    this.userInfo = navParams.get('userInfo');
    this.username = navParams.get('username');
    this.telephone = navParams.get('telephone');
    this.id = navParams.get('id');
    this.starttime = navParams.get('starttime');
    this.endtime = navParams.get('endtime');
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;

    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "telephone="+this.telephone;

    this.http
      .post('http://'+this.ip+':'+this.port+'/selectNameOfTel', body, options)
      .subscribe(data => {
         this.vendorname = data.json().name;
      }), error => {
      console.log("ERROR!:", error);
    };
  }

  //页面跳转操作
  loadDefault() {
    let loading = this.loadCtrl.create({
      content: "下单中...",
      // dismissOnPageChange: true, //是否在切换页面之后关闭loading框
      showBackdrop: false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体

    let confirm = this.loadCtrl.create({
      content: "下单成功",
      showBackdrop: false
    });

    setTimeout(() => {
        this.navCtrl.pop().catch(()=> console.log('ConfirmBillPage: pop view was not dismissed1'));
        this.navCtrl.pop().catch(()=> console.log('ConfirmBillPage: pop view was not dismissed2'));
    }, 2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('ConfirmBillPage: loading view was not dismissed')); //loading窗体消失
      confirm.present();
      setTimeout(() => confirm.dismiss().catch(() => console.log('haha')), 1000);
    }, 2000);

  }

  //下单操作
  confirm() {
      let header = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({
        headers: header
      });

      let body = "customertel="+this.userInfo.telephone+"&customername="+this.username+"&siteno="+this.siteInfo.parknum+"&vendortel="+this.telephone+"&vendorname="+this.vendorname+"&start_time="+this.siteInfo.start_time_system+"&end_time="+this.siteInfo.end_time_system+"&id="+this.id;

      this.http
        .post('http://'+this.ip+':'+this.port+'/addBill', body, options)
        .subscribe(data => {
          var tmpState = data.json().success;
          if (tmpState == "true"){
            this.loadDefault();
          }else if(tmpState == "false"){
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '亲,您晚了一步,车位已被别人抢到~',
              buttons: ['确定']
            });
            alert.present();
          }
        }), error => {
        console.log("ERROR!:", error);
      };
    }
}
