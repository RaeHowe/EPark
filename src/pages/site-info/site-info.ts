import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ConfirmBillPage } from '../confirm-bill/confirm-bill'
import { UserInfo } from '../head-page/head-page'
import { Http, Headers, RequestOptions } from '@angular/http';
import { Config } from './../config';

/*
  Generated class for the SiteInfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-site-info',
  templateUrl: 'site-info.html'
})
export class SiteInfoPage {

  userInfo: UserInfo; //包含了用户的电话和密码
  username: string;
  siteInfo: SiteInfo[];

  showSiteInfo : SiteInfo[];

  ip : string;
  port : string;

  starttimes : string[];
  endtimes: string[];

  day : string;
  time : string;

  showDay: string;
  showTime: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public http: Http, public alertCtrl: AlertController) {
      this.siteInfo = navParams.get('siteInfo');
      this.userInfo = navParams.get('userInfo');
      this.username = navParams.get('username');
      this.starttimes = navParams.get('starttimes');
      this.endtimes = navParams.get('endtimes');
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
      case '0':
        this.showTime = '上午';
        break;
      case '1':
        this.showTime = '下午';
        break;
      default :
        this.showTime = '错误信息';
    }


    this.showSiteInfo = [];
    for (var i = 0; i < this.siteInfo.length; i++){
      var siteObj = new SiteInfo();
      siteObj.id = this.siteInfo[i].id;
      siteObj.parknum = this.siteInfo[i].parknum;
      siteObj.start_time = this.starttimes[i];
      siteObj.end_time = this.endtimes[i];
      siteObj.start_time_system = this.siteInfo[i].start_time;
      siteObj.end_time_system = this.siteInfo[i].end_time;
      this.showSiteInfo.push(siteObj);
    }
  }

  loadView(obj: SiteInfo, userInfo: UserInfo, username: string, telephone: string, starttime: string, endtime: string){
    let loading = this.loadCtrl.create({
      content:"订单生成中",
      // dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      this.navCtrl.push(ConfirmBillPage, {
        object: obj, //车位号,开始时间,结束时间
        userInfo: userInfo, //用户电话,用户密码
        username: username, //用户姓名
        telephone: telephone, //被租车位用户电话
        id: obj.id, //车位id
        starttime: starttime,
        endtime: endtime
      }).catch(() => console.log('SiteInfoPage: push view was not dismissed'));
    },2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('SiteInfoPage: loading view was not dismissed')); //loading窗体消失
    }, 3000);
  }

  confirmBill(obj: SiteInfo, i : number) {
    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "siteno="+obj.parknum;

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
}

export class SiteInfo{
  id: number; //id
  parknum: string; //车位号
  start_time: string; //开始时间
  end_time: string; //结束时间
  start_time_system: string; //开始时间(时间戳类型)
  end_time_system: string; //结束时间(时间戳类型)
}
