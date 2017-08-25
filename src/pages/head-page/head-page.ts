import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { CarUserRegPage } from '../car-user-reg/car-user-reg'
import { NomUserRegPage } from '../nom-user-reg/nom-user-reg'
import { CarUserSelStylePage } from '../car-user-sel-style/car-user-sel-style'
import { NomUserStylePage } from  '../nom-user-style/nom-user-style'
import { Config } from '../config'
import { Retroaction } from './../retroaction/retroaction'

@Component({
  selector: 'page-head-page',
  templateUrl: 'head-page.html'
})
export class HeadPagePage {
  ip : string;
  port : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public http: Http, public alertCtrl: AlertController) {

  }

  userInfo: UserInfo={
    telephone:'',
    password:''
  };

  //页面跳转操作
  loadDefault(obj: UserInfo, userType: string, name: string, siteno: string){
    let loading = this.loadCtrl.create({
      content:"登录中...",
       // dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      if (userType == 'caruser'){ //跳转到车位用户选择功能页面
        this.navCtrl.push(CarUserSelStylePage, {
          object: obj,
          username: name,
          siteNo: siteno
        }).catch(() => console.log('view was not dismissed'));
      }else if(userType == 'nomuser'){ //跳转到无车位用户选择功能页面
        this.navCtrl.push(NomUserStylePage, {
          object: obj,
          username: name
        }).catch(() => console.log('view was not dismissed'));
      }
    }, 2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('view was not dismissed')); //loading窗体消失
    }, 3000);
  }


  loadCustom(){
    let loading = this.loadCtrl.create({
      spinner:"dots",// apinner既是loading框上的图标
      duration:5000 // loading框持续的时间，默认在触发DidDismiss之后关闭，除非设置了该属性
      });
    loading.onDidDismiss(()=>{
      console.log("Dismissed loading");
    });
    loading.present();
  }

  loadText(){
    let loading = this.loadCtrl.create({
      spinner:"hide",
      content:"loading",
      duration:3000
    });
    loading.present();
  }

  login() {
    if (this.userInfo.telephone == '' || this.userInfo.password == '') {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请完整填入登录信息',
        buttons: ['确定']
      });
      alert.present();
    } else {
      let header = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({
        headers: header
      });

      let body = "telephone=" + this.userInfo.telephone + "&password=" + this.userInfo.password;

      this.http
        .post('http://'+this.ip+':'+this.port+'/login', body, options)
        .subscribe(data => {
          var userType = data.json().type;
          var name = data.json().name;
          var siteno = data.json().siteno;
          if (name != 'null') { //说明登录成功,用户存在
              this.loadDefault(this.userInfo, userType, name, siteno);
          } else {
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '用户名或密码错误',
              buttons: ['确定']
            });
            alert.present();
          }
        }), error => {
        console.log(JSON.stringify(error.json()));
      }
    }
  }

  //跳转到车位用户注册页面
  carUserReg(){
    this.navCtrl.push(CarUserRegPage)
  }

  //跳转到无车位用户注册页面
  nomUserReg(){
    this.navCtrl.push(NomUserRegPage)
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;
  }

  //反馈
  feedBack(){
    this.navCtrl.push(Retroaction)
  }
}

export class UserInfo {
  telephone:string;
  password:string;
}
