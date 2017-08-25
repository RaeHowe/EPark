import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserInfo } from '../head-page/head-page'
import { Http, Headers, RequestOptions} from '@angular/http';
import { Config } from './../config';

/*
  Generated class for the SubmitSite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-submit-site',
  templateUrl: 'submit-site.html'
})
export class SubmitSitePage {
  ip : string;
  port : string;

  userInfo:UserInfo; //包括了用户的电话和密码
  username:string; //用户的姓名
  siteNo:string; //车位号

  theFirTime: string;//今天的日期+时间段
  theSecTime: string;//明天的日期+时间段
  theThrTime: string;//后天的日期+时间段

  startTime: string;//开始时间
  endTime: string;//结束时间

  telephone: string[]; //租借车位的人的联系方式数组
  daytimes: string[]; //已经提交车位的日期+时间段数组  [{01}, {12}, {22}]
  isOccupy: string[]; //保存了该车位是否已经被出租了的状态信息
  status: string[]; //保存是否提交了该车位的数组,但是不一定出租了
  notRent: string[]; //未出租的数组信息

  state1: string;
  state2: string;
  state3: string;
  state4: string;
  state5: string;
  state6: string;
  state7: string;
  state8: string;
  state9: string;
  state10: string;
  state11: string;
  state12: string;

  //这个是判断是否提交了这个车位
  judge1: boolean;
  judge2: boolean;
  judge3: boolean;
  judge4: boolean;
  judge5: boolean;
  judge6: boolean;
  judge7: boolean;
  judge8: boolean;
  judge9: boolean;
  judge10: boolean;
  judge11: boolean;
  judge12: boolean;

  //这个是判断提交的车位是否被租用
  judgeOccupy1: boolean;
  judgeOccupy2: boolean;
  judgeOccupy3: boolean;
  judgeOccupy4: boolean;
  judgeOccupy5: boolean;
  judgeOccupy6: boolean;
  judgeOccupy7: boolean;
  judgeOccupy8: boolean;
  judgeOccupy9: boolean;
  judgeOccupy10: boolean;
  judgeOccupy11: boolean;
  judgeOccupy12: boolean;

  //如果车位已经被出租了,这个就用于保存租这个车位的人的联系方式
  tel1: string;
  tel2: string;
  tel3: string;
  tel4: string;
  tel5: string;
  tel6: string;
  tel7: string;
  tel8: string;
  tel9: string;
  tel10: string;
  tel11: string;
  tel12: string;

  isSelect1: boolean;
  isSelect2: boolean;
  isSelect3: boolean;
  isSelect4: boolean;
  isSelect5: boolean;
  isSelect6: boolean;
  isSelect7: boolean;
  isSelect8: boolean;
  isSelect9: boolean;
  isSelect10: boolean;
  isSelect11: boolean;
  isSelect12: boolean;


  constructor(public navCtrl:NavController, public navParams:NavParams, public http:Http, public loadCtrl: LoadingController, private alertCtrl: AlertController) {
    this.userInfo = this.navParams.get('object');
    this.username = this.navParams.get('username');
    this.siteNo = this.navParams.get('siteNo');
    this.theFirTime = 'null'; //如果为null就说明用户没有选择任何的时间点,没有在屏幕上进行任何的操作
    this.theSecTime = 'null'; //如果为null就说明用户没有选择任何的时间点,没有在屏幕上进行任何的操作
    this.theThrTime = 'null'; //如果为null就说明用户没有选择任何的时间点,没有在屏幕上进行任何的操作
  }

  showInfo(){
    let alert = this.alertCtrl.create({
      title: '提交车位规则',
      subTitle: '您所提交的上午车位信息在没有被租出去的情况下,您可以选择删除这条车位信息。如果您提交的上午(下午)车位,但是已经被租出去了,那么您可以继续选择下午(上午)的车位进行提交,但是不能选择全天车位进行提交。如果您选择的全天车位进行提交,并且已经被租出去的情况下,您不能对该天进行任何提交车位的操作了。选项中的未出租:如果您已经提交了某天的车位信息,但是现在想收回这个车位信息不想出租了,你可以选择未出租,然后提交。这样,那天的车位信息就会收回。如果已经被出租出去了的话,您就不能进行未出租的操作。',
      buttons: ['已了解']
    });
    alert.present();
  }

  //选择今天的时间段
  selectOneTime(value: string){
    this.theFirTime = value;
  }

  //选择明天的时间段
  selectTwoTime(value: string){
    this.theSecTime = value;
  }

  //选择后天的时间段
  selectThreeTime(value: string){
    this.theThrTime = value;
  }

  ionViewDidLoad() {
    let config = new Config();
    this.ip = config.ip;
    this.port = config.port;

    let loading = this.loadCtrl.create({
      content:"正在通讯中,请稍受...",
      //  dismissOnPageChange:true, //是否在切换页面之后关闭loading框
      showBackdrop:false //是否显示遮罩层
    });
    loading.present(); //弹出loading窗体
    setTimeout(() => {
      loading.dismiss().catch(() => console.log('view was not dismissed')); //loading窗体消失
    }, 2000);

    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({
      headers: header
    });

    let body = "siteNo="+this.siteNo;

    this.http
      .post('http://'+this.ip+':'+this.port+'/selTimeAndState', body, options)
      .subscribe(data => {
        var success = data.json().success;
        if (success == 'true'){ //查询成功
          var objects = data.json().data; //一个保存了日期点,时间点,占用状态,占用车位的人的联系方式的数组
            this.daytimes = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',]; //保存提交的车位信息的数组
            this.telephone = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',]; //保存租用车位用户电话的数组
            this.isOccupy = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false']; //保存了是否被占用的数组
            for (var i = 0; i < objects.length; i++){
              this.daytimes[i] = objects[i].daymark + objects[i].phasemark;
            }

            // 01 12 22  是已经提交了的车位 this.daytimes = ['01', '12', '22'];
            var tmpStatusTab = ['00', '01', '02', '03', '10', '11', '12', '13', '20', '21', '22', '23'];
            this.status = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];

            for (var i = 0; i < this.daytimes.length; i++){ //实际的元素数量 3
              for (var j = 0; j < tmpStatusTab.length; j++){ //12
                if (tmpStatusTab[j] == this.daytimes[i]){ //表中获取到的时间和上面数组匹配到了
                  this.status[j] = 'true'; //车位信息已经提交
                  this.telephone[j] = objects[i].telephone; //电话号码
                  if (objects[i].status == true){
                    this.isOccupy[j] = 'true';
                  }
                  break;
                }
              }
            }

            //电话信息获取中....
            this.tel1 = this.telephone[0];
            this.tel2 = this.telephone[1];
            this.tel3 = this.telephone[2];
            this.tel4 = this.telephone[3];
            this.tel5 = this.telephone[4];
            this.tel6 = this.telephone[5];
            this.tel7 = this.telephone[6];
            this.tel8 = this.telephone[7];
            this.tel9 = this.telephone[8];
            this.tel10 = this.telephone[9];
            this.tel11 = this.telephone[10];
            this.tel12 = this.telephone[11];

            //哪些车位信息被提交....
            this.state1 = this.status[0];
            this.state2 = this.status[1];
            this.state3 = this.status[2];
            this.state4 = this.status[3];
            this.state5 = this.status[4];
            this.state6 = this.status[5];
            this.state7 = this.status[6];
            this.state8 = this.status[7];
            this.state9 = this.status[8];
            this.state10 = this.status[9];
            this.state11 = this.status[10];
            this.state12 = this.status[11];
            if (this.state1 == 'false' && this.state2 == 'false' && this.state3 == 'false'){ //如果今天的上午、下午、全天都没有提交车位信息,那么就默认选择了未出租这个状态
              this.state4 = 'true';
            }

            if (this.state5 == 'false' && this.state6 == 'false' && this.state7 == 'false'){ //如果明天的上午、下午、全天都没有提交车位信息,那么就默认选择了未出租这个状态
              this.state8 = 'true';
            }

            if (this.state9 == 'false' && this.state10 == 'false' && this.state11 == 'false'){ //如果后天的上午、下午、全天都没有提交车位信息,那么就默认选择了未出租这个状态
              this.state12 = 'true';
            }

            //判断哪些时间点的车位被出租出去了
            if (this.isOccupy[0] == 'true'){
              this.judgeOccupy1 = true;
              this.state1 = 'false';
            }else{
              this.judgeOccupy1 = false;
            }

            if (this.isOccupy[1] == 'true'){
              this.judgeOccupy2 = true;
              this.state2 = 'false';
            }else{
              this.judgeOccupy2 = false;
            }

            if (this.isOccupy[2] == 'true'){
              this.judgeOccupy3 = true;
              this.state3 = 'false';
            }else{
              this.judgeOccupy3 = false;
            }

            if (this.isOccupy[3] == 'true'){
              this.judgeOccupy4 = true;
              this.state4 = 'false';
            }else{
              this.judgeOccupy4 = false;
            }

            if (this.isOccupy[4] == 'true'){
              this.judgeOccupy5 = true;
              this.state5 = 'false';
            }else{
              this.judgeOccupy5 = false;
            }

            if (this.isOccupy[5] == 'true'){
              this.judgeOccupy6 = true;
              this.state6 = 'false';
            }else{
              this.judgeOccupy6 = false;
            }

            if (this.isOccupy[6] == 'true'){
              this.judgeOccupy7 = true;
              this.state7 = 'false';
            }else{
              this.judgeOccupy7 = false;
            }

            if (this.isOccupy[7] == 'true'){
              this.judgeOccupy8 = true;
              this.state8 = 'false';
            }else{
              this.judgeOccupy8 = false;
            }

            if (this.isOccupy[8] == 'true'){
              this.judgeOccupy9 = true;
              this.state9 = 'false';
            }else{
              this.judgeOccupy9 = false;
            }

            if (this.isOccupy[9] == 'true'){
              this.judgeOccupy10 = true;
              this.state10 = 'false';
            }else{
              this.judgeOccupy10 = false;
            }

            if (this.isOccupy[10] == 'true'){
              this.judgeOccupy11 = true;
              this.state11 = 'false';
            }else{
              this.judgeOccupy11 = false;
            }

            if (this.isOccupy[11] == 'true'){
              this.judgeOccupy12 = true;
              this.state12 = 'false';
            }else{
              this.judgeOccupy12 = false;
            }

            //控制radiobutton是否可选,为false就是可以选择,为true就是不能进行选择
            this.isSelect1 = false;
            this.isSelect2 = false;
            this.isSelect3 = false;
            this.isSelect4 = false;
            this.isSelect5 = false;
            this.isSelect6 = false;
            this.isSelect7 = false;
            this.isSelect8 = false;
            this.isSelect9 = false;
            this.isSelect10 = false;
            this.isSelect11 = false;
            this.isSelect12 = false;

            //******************************************判断是否可以选择哪些时间段进行出租的逻辑判断*******************************************//
            //******************************************今天*******************************************//
            //如果今天全天的车位被出租出去了,那么上午和下午的车位不能被出租(就是radiobutton控件不能选择上午和下午还有未出租这三个选项了)
            if (this.judgeOccupy3 == true){
              this.isSelect1 = true;
              this.isSelect2 = true;
              this.isSelect3 = true;
            }

            //如果今天上午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择下午的车位信息来提交
            if (this.judgeOccupy1 == true){
              this.isSelect1 = true;
              this.isSelect3 = true;
            }

            //如果今天下午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择上午的车位信息来提交
            if (this.judgeOccupy2 == true){
              this.isSelect2 = true;
              this.isSelect3 = true;
            }
            //*************************************************************************************//

            //*******************************************明天*******************************************//
            //如果明天全天的车位被出租出去了,那么上午和下午的车位不能被出租(就是radiobutton控件不能选择上午和下午还有未出租这三个选项了)
            if (this.judgeOccupy7 == true){
              this.isSelect5 = true;
              this.isSelect6 = true;
              this.isSelect7 = true;
            }

            //如果明天上午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择下午的车位信息来提交
            if (this.judgeOccupy5 == true){
              this.isSelect5 = true;
              this.isSelect7 = true;
            }

            //如果明天下午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择上午的车位信息来提交
            if (this.judgeOccupy6 == true){
              this.isSelect6 = true;
              this.isSelect7 = true;
            }
            //*************************************************************************************//

            //*******************************************后天*******************************************//
            //如果后天天全天的车位被出租出去了,那么上午和下午的车位不能被出租(就是radiobutton控件不能选择上午和下午还有未出租这三个选项了)
            if (this.judgeOccupy11 == true){
              this.isSelect9 = true;
              this.isSelect10 = true;
              this.isSelect11 = true;
            }

            //如果后天上午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择下午的车位信息来提交
            if (this.judgeOccupy9 == true){
              this.isSelect9 = true;
              this.isSelect11 = true;
            }

            //如果后天下午的车位被出租出去了,那么就不能选择全天和未出租,但是还可以选择上午的车位信息来提交
            if (this.judgeOccupy10 == true){
              this.isSelect10 = true;
              this.isSelect11 = true;
            }
            //*************************************************************************************//


            ////////****************************************************/////
            if (this.status[0] == "true"){
              this.judge1 = true;
            }else {
              this.judge1 = false;
            }

            if (this.status[1] == "true"){
              this.judge2 = true;
            }else {
              this.judge2 = false;
            }

            if (this.status[2] == "true"){
              this.judge3 = true;
            }else {
              this.judge3 = false;
            }

            if (this.status[3] == "true"){
              this.judge4 = true;
            }else {
              this.judge4 = false;
            }

            if (this.status[4] == "true"){
              this.judge5 = true;
            }else {
              this.judge5 = false;
            }

            if (this.status[5] == "true"){
              this.judge6 = true;
            }else {
              this.judge6 = false;
            }

            if (this.status[6] == "true"){
              this.judge7 = true;
            }else {
              this.judge7 = false;
            }

            if (this.status[7] == "true"){
              this.judge8 = true;
            }else {
              this.judge8 = false;
            }

            if (this.status[8] == "true"){
              this.judge9 = true;
            }else {
              this.judge9 = false;
            }

            if (this.status[9] == "true"){
              this.judge10 = true;
            }else {
              this.judge10 = false;
            }

            if (this.status[10] == "true"){
              this.judge11 = true;
            }else {
              this.judge11 = false;
            }

            if (this.status[11] == "true"){
              this.judge12 = true;
            }else {
              this.judge12 = false;
            }
        }else {
          let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: '没有查找到您提交的车位信息',
            buttons: ['确定']
          });
          alert.present();
        }
      })
  }

  //页面每次进来都会执行这个方法,有了这个方法的话,ionViewDidLoad方法也会在每次进入到这个页面的时候执行一次
  ionViewDidEnter() {

  }

  //进行时间的格式化操作
  judgeTime(whichDay: number, whichHour: number){
    var dd = new Date();
    dd.setDate(dd.getDate()+whichDay);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    dd.setHours(whichHour); //根据时间点来进行生成
    dd.setMinutes(0);
    dd.setSeconds(0);
    return y+"-"+m+"-"+d+" "+dd.getHours()+":"+dd.getMinutes()+":"+dd.getSeconds();
  }

  loadAnimateView(){
    let loading = this.loadCtrl.create({
      content:"车位信息提交中...",
      //  dismissOnPageChange:true, //是否在切换页面之后关闭loading框
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

  //上传车位信息
  submitSite() {

    var firSuccess = '';
    var secSuccess = '';
    var thrSuccess = '';

    if (this.theFirTime == 'null' && this.theSecTime == 'null' && this.theThrTime == 'null') {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '请选择好提交的时间或者您没有进行车位信息的修改操作',
        buttons: ['确定']
      });
      alert.present();
    } else {

      //**********************设置请求报文头************************//
      let header = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({
        headers: header
      });

      //*****************************当用户再次提交车位信息的时候,先会去把旧的提交的车位信息删除一遍*****************************//
      if (this.theFirTime == 'null') { //不删除该车位今天的数据信息,因为今天的选项没有改变
        if (this.theSecTime == 'null') { //不删除该车位明天的数据信息,因为明天的选项没有改变
          if (this.theThrTime == 'null') { //不删除该车位后天的数据信息,因为后天的选项没有改变
            //都没有修改,不做出任何删除操作
          } else { //只有后天的选项改了,只打算删除后天的记录
            var parameter = "siteNo=" + this.siteNo + "&day=2";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delOneOfOldSiteInfo', parameter, options) //删除的时候已经能判断出来是否已经被出租出去了,如果已经被出租出去了的话,就不会被删除
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          }
        } else { //明天的选项改了,需要删除
          if (this.theThrTime == 'null') { //不删除该车位后天的数据信息,因为后天的选项没有改变
            //这里只删除明天的记录
            var parameter = "siteNo=" + this.siteNo + "&day=1";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delOneOfOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          } else { //明天和后天的记录都需要删除
            var parameter = "siteNo=" + this.siteNo + "&firday=1&secday=2";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delTwoOfOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          }
        }
      } else { //今天的选项改了,需要删除
        if (this.theSecTime == 'null') { //不删除该车位明天的数据信息,因为明天的选项没有改变
          if (this.theThrTime == 'null') { //不删除该车位后天的数据信息,因为后天的选项没有改变
            //这里只删除今天的数据记录
            var parameter = "siteNo=" + this.siteNo + "&day=0";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delOneOfOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          } else { //第一天和第三天的记录发生了改变,需要删除
            var parameter = "siteNo=" + this.siteNo + "&firday=0&secday=2";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delTwoOfOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          }
        } else { //第二天的数据记录发生了改变
          if (this.theThrTime == 'null') { //不删除该车位后天的数据信息,因为后天的选项没有改变
            //这里只删除第一天和第二天的数据记录
            var parameter = "siteNo=" + this.siteNo + "&firday=0&secday=1";
            this.http
              .post('http://'+this.ip+':'+this.port+'/delTwoOfOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          } else {
            //三天的记录都发生了改变,都需要删除
            var parameter = "siteNo=" + this.siteNo;
            this.http
              .post('http://'+this.ip+':'+this.port+'/delAllOldSiteInfo', parameter, options)
              .subscribe(data => {

              }), error => {
              console.log("ERROR!:", error);
            };
          }
        }
      }

      //******************************新增车位信息的操作****************************//
      if (this.theFirTime != 'null') { //今天的信息发生了改变,需要重新插入数据

        var day = parseInt(this.theFirTime.substring(0, 1), 10);
        var time = parseInt(this.theFirTime.substring(1, 2), 10);
        var theFirStartTime = '';
        var theFirEndTime = '';
        let body = ' ';
        switch (time.toString()) {
          case '0': //上午
            theFirStartTime = this.judgeTime(day, 8);
            theFirEndTime = this.judgeTime(day, 12);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theFirStartTime + "&endTime=" + theFirEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addSite', body, options)
              .subscribe(data => {
                firSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '1': //下午
            theFirStartTime = this.judgeTime(day, 13);
            theFirEndTime = this.judgeTime(day, 18);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theFirStartTime + "&endTime=" + theFirEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addSite', body, options)
              .subscribe(data => {
                firSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '2': //全天,就要插入两条数据进去
            var firTime = 8;
            var secTime = 12;
            for (var i = 0; i < 2; i++) {
              theFirStartTime = this.judgeTime(day, firTime);
              theFirEndTime = this.judgeTime(day, secTime);
              body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theFirStartTime + "&endTime=" + theFirEndTime;
              this.http
                .post('http://'+this.ip+':'+this.port+'/addSite', body, options)
                .subscribe(data => {
                  firSuccess = data.json().success;
                }), error => {
                console.log("ERROR!:", error);
              };
              firTime += 5;
              secTime += 6;
            }
            break;
        }
      }


      if (this.theSecTime != 'null') { //明天的信息发生了改变,需要重新插入数据
        var day = parseInt(this.theSecTime.substring(0, 1), 10);
        var time = parseInt(this.theSecTime.substring(1, 2), 10);
        var theSecStartTime = '';
        var theSecEndTime = '';
        let body = ' ';
        switch (time.toString()) {
          case '0':
            console.log("明天上午插入数据");
            theSecStartTime = this.judgeTime(day, 8);
            theSecEndTime = this.judgeTime(day, 12);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theSecStartTime + "&endTime=" + theSecEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addsite', body, options)
              .subscribe(data => {
                secSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '1':
            console.log("明天下午插入数据");
            theSecStartTime = this.judgeTime(day, 13);
            theSecEndTime = this.judgeTime(day, 18);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theSecStartTime + "&endTime=" + theSecEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addsite', body, options)
              .subscribe(data => {
                secSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '2':
            var firTime = 8;
            var secTime = 12;
            for (var i = 0; i < 2; i++) {
              theSecStartTime = this.judgeTime(day, firTime);
              theSecEndTime = this.judgeTime(day, secTime);
              body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theSecStartTime + "&endTime=" + theSecEndTime;
              this.http
                .post('http://'+this.ip+':'+this.port+'/addSite', body, options)
                .subscribe(data => {
                  firSuccess = data.json().success;
                }), error => {
                console.log("ERROR!:", error);
              };
              firTime += 5;
              secTime += 6;
            }
            break;
        }
      }


      if (this.theThrTime != 'null') { //后天的信息发生了改变,需要重新插入数据
        var day = parseInt(this.theThrTime.substring(0, 1), 10);
        var time = parseInt(this.theThrTime.substring(1, 2), 10);
        var theThrStartTime = '';
        var theThrEndTime = '';
        let body = ' ';
        switch (time.toString()) {
          case '0':
            theThrStartTime = this.judgeTime(day, 8);
            theThrEndTime = this.judgeTime(day, 12);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theThrStartTime + "&endTime=" + theThrEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addsite', body, options)
              .subscribe(data => {
                secSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '1':
            theThrStartTime = this.judgeTime(day, 13);
            theThrEndTime = this.judgeTime(day, 18);
            body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theThrStartTime + "&endTime=" + theThrEndTime;
            this.http
              .post('http://'+this.ip+':'+this.port+'/addsite', body, options)
              .subscribe(data => {
                secSuccess = data.json().success;
              }), error => {
              console.log("ERROR!:", error);
            };
            break;
          case '2':
            var firTime = 8;
            var secTime = 12;
            for (var i = 0; i < 2; i++) {
              theThrStartTime = this.judgeTime(day, firTime);
              theThrEndTime = this.judgeTime(day, secTime);
              body = "telephone=null" + "&state=0" + "&siteno=" + this.siteNo + "&day=" + day + "&time=" + time + "&startTime=" + theThrStartTime + "&endTime=" + theThrEndTime;
              this.http
                .post('http://'+this.ip+':'+this.port+'/addSite', body, options)
                .subscribe(data => {
                  firSuccess = data.json().success;
                }), error => {
                console.log("ERROR!:", error);
              };
              firTime += 5;
              secTime += 6;
            }
            break;
        }
      }

      if (firSuccess == "false" || secSuccess == "false" || thrSuccess == "false") {
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '上传车位信息失败,请联系系统管理员',
          buttons: ['确定']
        });
        alert.present();
      } else if (this.theFirTime != 'null' || this.theSecTime != 'null' || this.theThrTime != 'null') {
        this.loadAnimateView();
      }
    }
  }
}
