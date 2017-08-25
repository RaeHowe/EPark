import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { Config } from './../config'


@Component({
  selector: 'page-retroaction',
  templateUrl: 'retroaction.html'
})

export class Retroaction {
  ip : string;
  port : string;

  information: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public http: Http, public loadCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;

  }

  loadDefault(){
    let loading = this.loadCtrl.create({
      content:"提交成功,感谢您的支持^_^",
      // dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      this.navCtrl.pop().catch(() => console.log('view was not dismissed'))
    }, 2000);
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('view was not dismissed')); //loading窗体消失
    }, 3000);
  }


  submit(){
    if (this.information == ''){
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请完整填入登录信息',
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

      let body = "information=" + this.information;

      console.log(this.information);

      this.http
        .post('http://'+this.ip+':'+this.port+'/submitRetroaction', body, options)
        .subscribe(data => {
          var res = data.json().success;
          if (res == "true"){ //提交成功
            this.loadDefault();
          }else { //提交失败
            let alert = this.alertCtrl.create({
              title: '提示',
              subTitle: '提交反馈失败',
              buttons: ['确定']
            });
            alert.present();
          }
        })
    }
  }
}
