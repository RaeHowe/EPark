import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Config } from './../config'

@Component({
  selector: 'page-car-user-reg',
  templateUrl: 'car-user-reg.html'
})

export class CarUserRegPage {

  telephone: string;
  password: string;
  name: string;
  carNumber: string;
  siteNumber: string;

  ip : string;
  port : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadCtrl: LoadingController, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;
  }

  //提示注册成功并且进行页面跳转
  loadDefault(){
    let loading = this.loadCtrl.create({
      content:"注册成功",
      // dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      this.navCtrl.pop().catch(() => console.log('view was not dismissed'));
    }, 2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('view was not dismissed')); //loading窗体消失
    }, 3000);
  }

  //注册
  register(){
    if (this.telephone == null || this.telephone.trim() == '' || this.password == null || this.password.trim() == '' || this.name == null || this.name.trim() == '' || this.carNumber == null || this.carNumber.trim() == '' || this.siteNumber == null || this.siteNumber.trim() == ''){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请完整填入注册信息',
        buttons: ['确定']
      });
      alert.present();
    }else {
      let header = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({
        headers: header
      });

      let body = "telephone="+this.telephone+"&password="+this.password+"&name="+this.name+"&carnum="+this.carNumber+"&siteno="+this.siteNumber;

      this.http
        .post('http://'+this.ip+':'+this.port+'/carUserReg', body, options)
        .subscribe(data => {
          var tmpState = data.json().success;
          if (tmpState == "true"){
            this.loadDefault();
          }else if(tmpState == "false"){
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '注册失败,请联系系统管理员',
              buttons: ['确定']
            });
            alert.present();
          }
        }), error => {
        console.log("ERROR!:", error);
      };
    }
  }
}
