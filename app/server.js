var express = require("express");
var router = express.Router();
var bodyParser = require("./../node_modules/body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});

var pg = require('pg');
var conf = require('./conf/db');
var pool = new pg.Pool(conf.postgresql); //创建连接池


//登录
router.post("/login", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: "false", error: err});
      res.end();
      return ;
    }else {
      var obj = req.body;
      var data = [obj.telephone, obj.password];
      client.query("select name from parkuser where telephone = $1 and password = $2", data, function (usererror, userresults) {
        done();
        if (usererror){
          console.log(usererror)
        }else {
          if (userresults.rowCount > 0 ){ //说明查找到了用户,但是不确定用户的身份是有车位用户还是无车位用户
            var tmpData = [obj.telephone];
            client.query("select parknum from parkspace where ownertelephone = $1", tmpData, function (spaceerror, spaceresults) {
              done();
              if (spaceerror){
                console.log(spaceerror);
              }else {
                if (spaceresults.rowCount > 0){  //说明该用户为有车位的用户
                  res.send({name: userresults.rows[0].name, siteno: spaceresults.rows[0].parknum, type: 'caruser'});
                  res.end();
                }else {  //说明该用户为无车位用户
                  res.send({name: userresults.rows[0].name, siteno: 'null', type: 'nomuser'});
                  res.end();
                }
              }
            });
          }else {  //说明没有查找到用户
            res.send({name: 'null', siteno: 'null', type: 'null'});
            res.end();
          }
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//车位用户注册 这里面涉及到了要向两个表添加数据的操作
router.post("/carUserReg", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: "false", error: err});
      res.end();
      return ;
    }else {
      var obj = req.body;
      var parkuserData = [obj.telephone, obj.name, obj.carnum ,obj.password];
      client.query("insert into parkuser (telephone, name, carnum, password ) values ($1, $2, $3, $4);", parkuserData, function (usererror, userresults) {
        done();
        if (usererror){
          console.log(usererror);
        }else {
          var parkspaceData = [obj.telephone, obj.telephone, obj.siteno];
          client.query("insert into parkspace(currentownertelephone, ownertelephone, parknum) values ($1, $2, $3);", parkspaceData, function (spaceerror, spaceresults) {
            done();
            if (spaceerror){
              console.log(spaceerror);
            }else {
              res.send({success: "true"});
              res.end();
            }
          });
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//无车位用户注册
router.post("/nomUserReg", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function(err, client, done){
    if (err){
      console.log('error fetching client from pool', err);
      res.send({success: "false", error: err});
      return;
    }else {
      var obj = req.body;
      var data = [obj.telephone, obj.name, obj.carnum ,obj.password];
      client.query("insert into parkuser (telephone, name, carnum, password ) values ($1, $2, $3, $4);", data, function (error, results) {
        done();
        if (error){
          console.log(error)
        }else {
          res.send({success: "true", error: 'null'});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//查询车位信息
router.post("/selSiteInfo", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', data: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.day, obj.time];

      //根据时间段来查询车位,并且要求车位没有被出租
      client.query("select id, parknum, daymark, phasemark, start_time, end_time, status from parkinfo where daymark = $1 and phasemark = $2 and status = false;", data, function (error, results) {
        done();
        if (error){
          console.log(error);
        }else {
          if (results.rowCount > 0) { //说明查找到了数据信息
            var starttimes = [];
            var endtimes = [];
            for (var i = 0; i < results.rows.length; i++){
              var tmpStartTime = results.rows[i].start_time.toString();
              var tmpEndTime = results.rows[i].end_time.toString();
              starttimes.push(tmpStartTime);
              endtimes.push(tmpEndTime);
            }
            res.send({ success: 'true', data: results.rows, starttimes: starttimes, endtimes: endtimes});
            res.end();
          } else { //没有查找到数据
            res.send({success: 'false', data: 'null'});
            res.end();
          }
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//有车位用户查询一个车位信息(就是说查出来的车位信息不能包括自己已经提交的车位信息了)
router.post('/carUserSelSiteInfo', urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if(err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', data: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.day, obj.time, obj.parknum];

      client.query("select id, parknum, start_time, end_time from parkinfo where daymark = $1 and phasemark = $2 and status = false and parknum != $3", data, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else{
          if (results.rowCount > 0){ //说明查找到了数据信息
            var starttimes = [];
            var endtimes = [];
            for (var i = 0; i < results.rows.length; i++){
              var tmpStartTime = results.rows[i].start_time.toString();
              var tmpEndTime = results.rows[i].end_time.toString();
              starttimes.push(tmpStartTime);
              endtimes.push(tmpEndTime);
            }
            res.send({success: 'true', data: results.rows, starttimes: starttimes, endtimes: endtimes});
            res.end();
          }else{
            res.send({success: 'false', data: 'null'});
            res.end();
          }
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//根据车位号查询出电话号码(从parkspace表)和姓名(从parkuser表)
router.post("/selTelWithSiteno", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', telephone: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.siteno];
      client.query("select a.currentownertelephone, b.name from parkspace AS a INNER JOIN parkuser AS b ON a.currentownertelephone=b.telephone where a.parknum = $1", data, function (error, results) {
        done();
        if (error){
          console.log(error)
        }else {
          if (results.rowCount > 0){
            res.send({success: 'true', telephone: results.rows[0].currentownertelephone, name: results.rows[0].name});
            res.end();
          }
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

//根据电话信息查询出姓名
router.post("/selectNameOfTel", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', name: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.telephone];
      client.query("select name from parkuser where telephone = $1", data, function (error, results) {
        done();
        if (error){
          console.log(error)
        }else {
          res.send({success: "true", name:results.rows[0].name});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//新增订单信息
router.post("/addBill", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",'3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'error'});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.customertel, obj.customername, obj.siteno, obj.vendortel, obj.vendorname, obj.start_time, obj.end_time];
      var updateData = [obj.customertel, obj.id];
      client.query("update parkinfo set status='true', telephone=$1 where id=$2 and status='false';", updateData, function (updateError, updateResults) { //防止同时进行车位申请的操作,然后没更新成功,用户不知道什么情况
        done();
        if(updateError){
          console.log(updateError);
        }else{
          if (updateResults.rowCount == 0){ //更新不成功,已经被租出去了
            res.send({success:'false'});
            res.end();
          }else { //可以被租
            client.query("INSERT INTO bill (customertel, customername, siteno, vendortel, vendorname, starttime, endtime) values ($1, $2, $3, $4, $5, $6, $7)", data, function (error, results) {
              done();
              if (error){
                console.log(error)
              }else {
                res.send({success: "true"});
                res.end();
              }
            })
          }
        }
      });
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//新增车位信息
router.post("/addSite", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', data: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.siteno, obj.startTime, obj.endTime, obj.day, obj.time, obj.state, obj.telephone];
      client.query("insert into parkinfo (parknum, start_time, end_time, daymark, phasemark, status, telephone) values ($1, $2, $3, $4, $5, $6, $7);", data, function (error, results) {
        done();
        if (error){
          console.log(error);
        }else {
          res.send({success: "true"});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//根据车位时间查询时间信息以及车位是否被占用的状态
router.post("/selTimeAndState", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false', data: err});
      res.end();
      return;
    }else {
      var obj = req.body;
      var body = [obj.siteNo];
      client.query("select daymark, phasemark, status, telephone from parkinfo where parknum = $1", body, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else {
          res.send({success: 'true', data:results.rows});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//当用户点击提交车位的时候,如果选中了未出租状态,就把当天的提交数据删除一遍(删除一天的记录)
router.post("/delOneOfOldSiteInfo", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var obj = req.body;
      var body = [obj.siteNo, obj.day];
      client.query("delete from parkinfo where parknum = $1 and daymark = $2 and status = 'false'", body, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else {
          res.send({success: 'true'});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//当用户点击提交车位的时候,如果选中了未出租状态,就把当天的提交数据删除一遍(删除两天的记录)
router.post("/delTwoOfOldSiteInfo", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var obj = req.body;
      var body = [obj.siteNo, obj.firday, obj.secday];
      client.query("delete from parkinfo where parknum = $1 and (daymark = $2 or daymark = $3) and status = 'false'", body, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else {
          res.send({success: 'true'});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//当用户点击提交车位的时候,如果选中了未出租状态,就把当天的提交数据删除一遍(三天信息全部删除)
router.post("/delAllOldSiteInfo", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');

  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var obj = req.body;
      var body = [obj.siteNo];
      client.query("delete from parkinfo where parknum = $1 and status = 'false'", body, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else {
          res.send({success: 'true'});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//查询已经下了订单的车位信息
router.get("/selBillSite", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');

  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var customer = req.query["customerName"];
      var body = [customer];

      client.query("select * from bill where customertel = $1", body, function (error, results) {
        done();
        if(error){
          console.log(error);
        }else {
          if (results.rowCount > 0){
            var starttimes = [];
            var endtimes = [];
            for (var i = 0; i < results.rows.length; i++){
              var tmpStartTime = results.rows[i].starttime.toString();
              var tmpEndTime = results.rows[i].endtime.toString();
              starttimes.push(tmpStartTime);
              endtimes.push(tmpEndTime);
            }
            res.send({success: 'success', data: results, starttimes: starttimes, endtimes: endtimes});
            res.end();
          }else { //说明没有该用户的账单记录
            res.send({success: 'false'});
            res.end();
          }
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

//保存反馈信息
router.post("/submitRetroaction", urlencodedParser, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');

  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var obj = req.body;
      var data = [obj.information];
      client.query("insert into retroaction (information) values ($1);", data, function (error, results) {
        done();
        if(error){
          res.send({success: 'false', message: error});
          res.end();
        }else {
          res.send({success: 'true'});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

router.get("/selAllDaySiteInfo", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');

  pool.connect(function (err, client, done) {
    if (err){
      console.error('error fetching client from pool', err);
      res.send({success: 'false'});
      res.end();
      return;
    }else {
      var daymark = req.query["daymark"];
      var phasemark = req.query["phasemark"];
      var data = [daymark, phasemark];
      client.query("select distinct parknum from parkinfo where daymark = $1 and phasemark = $2;", data, function (error, results) {
        done();
        if(error){
          res.send({success: 'false', message: error});
          res.end();
        }else {
          res.send({success: 'true', parknums: results.rows});
          res.end();
        }
      })
    }
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  });
});

module.exports = router;
