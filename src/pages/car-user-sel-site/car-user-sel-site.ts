import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import { SiteInfoPage } from "../site-info/site-info"
import { UserInfo } from "../head-page/head-page";
import { Config } from './../config';
import { SelBillSite, BillInfo } from './../sel-bill-site/sel-bill-site'

/*
  Generated class for the CarUserSelSite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-car-user-sel-site',
  templateUrl: 'car-user-sel-site.html'
})
export class CarUserSelSitePage {

  userInfo: UserInfo;
  username: string;
  siteNo: string;

  day: string;
  time: string;

  ip : string;
  port : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadCtrl: LoadingController, public alertCtrl: AlertController) {
    this.userInfo = navParams.get('object');
    this.username = navParams.get('username');
    this.siteNo = navParams.get('siteNo');

    this.day = '0';
    this.time = '0';
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;
  }

  //日期选择
  selectDay(value: string){
    this.day = value;
  }

  //时间选择
  selectTime(value: string){
    this.time = value;
  }

  //车位租赁历史记录
  wasSel(){
    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    this.http
      .get('http://'+this.ip+':'+this.port+'/selBillSite?customerName='+this.userInfo.telephone+'', options) //根据车位号查询出用户的电话信息
      .subscribe(data => {
        var tmpState = data.json().success;
        if (tmpState == "success"){ //说明查找到了车位信息
          var billInfo = data.json().data;
          var starttimes = data.json().starttimes;  //转了的时间
          var endtimes = data.json().endtimes;  //转了的时间
          //页面跳转
          this.loadDefault(billInfo.rows, starttimes, endtimes)
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

  loadDefault(billInfos: BillInfo[], starttimes: string[], endtimes: string[]){
    let loading = this.loadCtrl.create({
      content:"查询中...",
      dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      this.navCtrl.push(SelBillSite, {
        billInfos: billInfos,
        starttimes: starttimes,
        endtimes: endtimes
      }).catch(() => console.log('view was not dismissed'));
    }, 2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('view was not dismissed')); //loading窗体消失
    }, 3000);
  }

  //查询操作
  select(){

    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "day="+this.day+"&time="+this.time+"&parknum="+this.siteNo;
    this.http
      .post('http://'+this.ip+':'+this.port+'/carUserSelSiteInfo', body, options)
      .subscribe(data => {
        var tmpState = data.json().success;
        var result = data.json().data; //查找到的车位信息,可能为一条数据,也能能是多条数据组成的数组.这里面包括了车位信息,开始时间,结束时间
        var starttimes = data.json().starttimes;
        var endtimes = data.json().endtimes;

        if (tmpState == "true"){ //说明查找到了车位信息
          this.navCtrl.push(SiteInfoPage , {
            siteInfo: result, //车位号,开始时间,结束时间数组
            userInfo: this.userInfo, //电话, 密码
            username: this.username, //姓名
            starttimes: starttimes,
            endtimes: endtimes

          }).catch(() => console.log('view was not dismissed'));
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
