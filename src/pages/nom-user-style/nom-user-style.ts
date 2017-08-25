import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserInfo } from './../head-page/head-page';
import { SiteInfoPage } from './../site-info/site-info';
import { Http, Headers, RequestOptions} from '@angular/http';
import { Config } from './../config';
import { SelBillSite } from './../sel-bill-site/sel-bill-site'
import { BillInfo } from './../sel-bill-site/sel-bill-site'
import { AlldaySiteInfo } from './../allday-site-info/allday-site-info'

/*
  Generated class for the NomUserStyle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-nom-user-style',
  templateUrl: 'nom-user-style.html'
})
export class NomUserStylePage {

  userInfo: UserInfo;
  username: string;
  day: string;
  time: string;

  ip : string;
  port : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadCtrl: LoadingController, private alertCtrl: AlertController) {
    this.userInfo = navParams.get("object");
    this.username = navParams.get("username");
    this.day = '0';
    this.time = '0';
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;
  }

  select(){
    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "day="+this.day+"&time="+this.time;

    this.http
      .post('http://'+this.ip+':'+this.port+'/selSiteInfo', body, options)
      .subscribe(data => {
        var tmpState = data.json().success;
        var result = data.json().data; //查找到的车位信息,可能为一条数据,也能能是多条数据组成的数组.这里面包括了车位信息,开始时间,结束时间
        var starttimes = data.json().starttimes;
        var endtimes = data.json().endtimes;

        if (tmpState == "true"){ //说明查找到了车位信息
          if (this.time == '2'){ //选择的整天车位信息查询,跳转到全天车位信息查看页面
            this.http
              .get('http://'+this.ip+':'+this.port+'/selAllDaySiteInfo?daymark='+this.day+'&phasemark='+this.time+'', options)
              .subscribe(data => {
                var state = data.json().success;
                var parknums = data.json().parknums;
                if (state == 'true'){
                  console.log(result);
                  this.navCtrl.push(AlldaySiteInfo, {
                    parknums: parknums, //指定某天全天的车位信息的车位号码数组
                    userInfo: this.userInfo, //电话, 密码
                    username: this.username, //姓名
                    day: this.day,
                    time: this.time
                  }).catch(() => console.log('view was not dismissed'))
                }
              });
          } else {
            this.navCtrl.push(SiteInfoPage , {
              siteInfo: result, //车位号,开始时间,结束时间数组
              userInfo: this.userInfo, //电话, 密码
              username: this.username, //姓名
              starttimes: starttimes,
              endtimes: endtimes,
              day: this.day,
              time: this.time
            }).catch(() => console.log('view was not dismissed'));
          }
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
          var billInfo = data.json().data;  //没转的时间
          var starttimes = data.json().starttimes;  //转了的时间
          var endtimes = data.json().endtimes;  //转了的时间
          //页面跳转
          this.loadDefault(billInfo.rows, starttimes, endtimes);
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

  //页面跳转操作
  loadDefault(billInfos: BillInfo[], starttimes: string[], endtimes: string[]){
    let loading = this.loadCtrl.create({
      content:"查询中...",
      // dismissOnPageChange:true, //是否在切换页面之后关闭loading框
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

  //选择日期
  selectDay(value: string){
    this.day = value;
  }

  //选择时间段
  selectTime(value: string){
    this.time = value;
  }
}
