import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserInfo } from './../head-page/head-page';
import { SubmitSitePage } from '../submit-site/submit-site';
import { CarUserSelSitePage } from '../car-user-sel-site/car-user-sel-site';

@Component({
  selector: 'page-car-user-sel-style',
  templateUrl: 'car-user-sel-style.html'
})

export class CarUserSelStylePage {

  userInfo : UserInfo;
  username: string;
  siteNo: string;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userInfo = navParams.get("object");
    this.username = navParams.get("username");
    this.siteNo = navParams.get('siteNo');
  }

  ionViewDidLoad() {
  }

  submitSite(){
    this.navCtrl.push(SubmitSitePage, {
      object: this.userInfo,
      username: this.username,
      siteNo: this.siteNo
    })
  }

  getSite(){
    this.navCtrl.push(CarUserSelSitePage, {
      object: this.userInfo,
      username: this.username,
      siteNo: this.siteNo
    })
  }
}
