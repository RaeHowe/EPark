import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage'
import { Data } from '../providers/data'
import { HeadPagePage } from '../pages/head-page/head-page'
import { CarUserRegPage } from '../pages/car-user-reg/car-user-reg'
import { NomUserRegPage } from '../pages/nom-user-reg/nom-user-reg'
import { CarUserSelStylePage } from '../pages/car-user-sel-style/car-user-sel-style'
import { NomUserStylePage } from '../pages/nom-user-style/nom-user-style'
import { SiteInfoPage } from '../pages/site-info/site-info'
import { ConfirmBillPage } from '../pages/confirm-bill/confirm-bill'
import { SubmitSitePage } from '../pages/submit-site/submit-site'
import { CarUserSelSitePage } from '../pages/car-user-sel-site/car-user-sel-site'
import { SelBillSite } from '../pages/sel-bill-site/sel-bill-site'
import { Retroaction } from './../pages/retroaction/retroaction'
import { AlldaySiteInfo } from './../pages/allday-site-info/allday-site-info'

@NgModule({
  declarations: [
    MyApp,
    HeadPagePage,
    CarUserRegPage,
    NomUserRegPage,
    CarUserSelStylePage,
    NomUserStylePage,
    SiteInfoPage,
    ConfirmBillPage,
    SubmitSitePage,
    CarUserSelSitePage,
    SelBillSite,
    Retroaction,
    AlldaySiteInfo
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HeadPagePage,
    CarUserRegPage,
    NomUserRegPage,
    CarUserSelStylePage,
    NomUserStylePage,
    SiteInfoPage,
    ConfirmBillPage,
    SubmitSitePage,
    CarUserSelSitePage,
    SelBillSite,
    Retroaction,
    AlldaySiteInfo
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, Data]
})

export class AppModule {}
