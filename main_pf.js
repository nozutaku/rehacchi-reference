//===== サーバープログラム ===================================

//===== 設定(ここから) =======================================
var IS_HEROKU = 1;		//デバッグオプション
//===== 設定(ここまで) =======================================


var http = require('http');
var request = require('request');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
//var pg = require('pg');

//var server = http.createServer();
//server.on('request', doRequest);
//server.listen(process.env.PORT, process.env.IP);


var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

//===== 設定(ここから) =======================================
/*
var PLACE_LATITUDE = "34.8760";     //naraba^2の場所（緯度） ★暫定
var PLACE_LONGITUDE = "135.8760";   //naraba^2の場所（経度） ★暫定
var IMAGE_OPEN = "image_open.jpg";
var IMAGE_NOT_OPEN = "image_not_open.jpg";
var STRING_OPEN = "OPENしてるよ～。早く来て！";
var STRING_OPEN2 = "はやくはやく～"
var STRING_NOT_OPEN = "まだOPENしてないよ。もうちょっと待って";
var STRING_NOT_OPEN2 = "ごめんよ～花村ねぇさんに問い合わせて";
var BGCOLOR_BLUE = "#4169e1";
var BGCOLOR_RED = "#FF7F50";

var MODE_JUDGE_SENSOR = 0;
var MODE_FORCE_OPEN = 1;
var MODE_FORCE_CLOSE = 2;
var MODE_ERROR = 99;
*/

//===== 設定(ここまで) =======================================

//var mode_openstatus = MODE_JUDGE_SENSOR;
//var likecounter = 0;

/*

if( IS_HEROKU ){   //heroku
    pg.defaults.ssl = true; 
    var connectionString = process.env.DATABASE_URL;
    var postgres_host = process.env.HOST_NAME;
    var postgres_databases = process.env.DATABASE_NAME;
    var postgres_user = process.env.USER_NAME;
    var postgres_password = process.env.PASSWORD;
}
else{               //local node.js
    var connectionString = "tcp://postgres:postgres@localhost:5432/naraba_db";
    var postgres_host = "localhost";
    var postgres_databases = "naraba_db";
    var postgres_user = "postgres";
    var postgres_password = "postgres";
}
*/



//var last_update;

//コンテンツ表示メイン処理
app.get('/', function(req, res) {
  console.log("START app.get");
  
  var data = fs.readFileSync('./views/index.ejs', 'UTF8');
  
  /*
  //強制OPEN/CLOSEか否かチェック　＆　いいねカウンタ数取得
  try{
    console.log("START connect database");
        
    var config = {
          host: postgres_host,
          user: postgres_user,
          database: postgres_databases,
          password: postgres_password,
          port: 5432,
          max: 10, // max number of clients in the pool 
          idleTimeoutMillis: 5000, 
    }; 
        
    var pool = new pg.Pool(config);

    pool.connect(function(err, client){
                      
      if(err){
        console.log("CANNOT open DB");
        mode_openstatus = MODE_JUDGE_SENSOR;
        show_page_by_sensor( res, data );
        return;
      }
            
      var sql_text = "SELECT * from settings;";            
      console.log("sql_text = "+sql_text );
        
      client.query( sql_text, function(err, result){
        if(err){
          console.log("CANNOT read table");
          mode_openstatus = MODE_JUDGE_SENSOR;
          show_page_by_sensor( res, data );
          return;
        }


        /////////////////////////////////////////////////////
        //   DBからデータ取得
        /////////////////////////////////////////////////////
        console.log("DB length= " + result.rows.length);

        if( result.rows.length == 1 ){
          mode_openstatus = result.rows[0].openstatus;
          likecounter = result.rows[0].likecount;

          console.log("openstatus = "+ mode_openstatus);
          console.log("likecount = "+ likecounter);

          if( mode_openstatus == MODE_JUDGE_SENSOR ){
            show_page_by_sensor( res, data );
          }
          else{
            send_main_display_data( res, data, 0, mode_openstatus );
          }
        }
        else{
          console.log("database length is wrong");
          mode_openstatus = MODE_JUDGE_SENSOR;
          show_page_by_sensor( res, data );
        }
        
        client.end(function (err){
          if(err){
            console.log("invalid query.");
            return;
          }
          console.log("db close1");
        });
        
	   });
		});
    pool.on('error', function (err, client) {
      console.log("idle client error", err.message, err.stack);
      mode_openstatus = MODE_JUDGE_SENSOR;
      show_page_by_sensor( res, data );
    });
        
  }catch(e){
    console.log("UNEXPECTED ERROR: cannot connect database");
		console.log(e);
    mode_openstatus = MODE_JUDGE_SENSOR;
    show_page_by_sensor( res, data );
  };
  */
  
  
  
  /* ---- コメントアウトここから
  // KintoneDBから取得
	var options = {
		url: 'https://v2urc.cybozu.com/k/v1/records.json?app=17',
		headers: {'X-Cybozu-API-Token': '4DRIq9OCEiwk8pqAkYN5WG5tmQ41QZ5Mak8FRBli'},
		json: true
	};
	request.get(options, function(error, response, body){
		if(!error && response.statusCode == 200){
				console.log("get success!");

				var num = Object.keys(body.records).length;
				console.log("num = " + num);
				var total_count=0;
				var today_count=0;
        var today_is=0;

				for (var i = 0; i < num; i++){

					today_is = isToday2( body.records[i].time.value,
                                          body.records[i].latitude.value,
                                          body.records[i].longitude.value );
                    

                    if(today_is == 1)   break;
				}

//				console.log("total_count = " + total_count);
				
				//出力！
                var open_status_image;
                var open_status_string;
                var open_status_bgcolor;
                var open_status_callbackstring;
            
            
                if( today_is == 1 ){
                    open_status_image = IMAGE_OPEN;
                    open_status_string = STRING_OPEN;
                    open_status_bgcolor = BGCOLOR_BLUE;
                    open_status_callbackstring = STRING_OPEN2;
                }
                else{
                    open_status_image = IMAGE_NOT_OPEN;
                    open_status_string = STRING_NOT_OPEN;
                    open_status_bgcolor = BGCOLOR_RED;
                    open_status_callbackstring = STRING_NOT_OPEN2;
                }
            
            console.log("open_status_string="+open_status_string+"today_is="+today_is);
            

            var data2 = ejs.render( data, {
              content1: open_status_string,
              content2: open_status_image,
              content3: open_status_bgcolor,
              content4: open_status_callbackstring
            });
   
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data2);
            res.end();



		}else{
			console.log('error: ' + response.statusCode);
		    res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write('sorry, I can NOT get DB.\n');
			res.end();

		}
	});
  --------------- コメントアウトここまで ---------------------- */

  res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
  
});


function show_page_by_sensor( res, data ){
  
  /*
  
  // KintoneDBから取得
	var options = {
		url: 'https://v2urc.cybozu.com/k/v1/records.json?app=17',
		headers: {'X-Cybozu-API-Token': '4DRIq9OCEiwk8pqAkYN5WG5tmQ41QZ5Mak8FRBli'},
		json: true
	};
  
	request.get(options, function(error, response, body){
		if(!error && response.statusCode == 200){
				console.log("get success!");

				var num = Object.keys(body.records).length;
				console.log("num = " + num);
				var total_count=0;
				var today_count=0;
        var today_is=0;

				for (var i = 0; i < num; i++){

					today_is = isToday2( body.records[i].time.value,
                                          body.records[i].latitude.value,
                                          body.records[i].longitude.value );
                    

                    if(today_is == 1)   break;
				}
      
      send_main_display_data( res, data, today_is, MODE_JUDGE_SENSOR );
      
      
    }else{
			console.log('error: ' + response.statusCode);
      send_main_display_data( res, data, today_is, MODE_ERROR );


		}
	});
  */
}


function send_main_display_data( res, data, today_is, mode_and_err ){

  var open_status_image;
  var open_status_string;
  var open_status_bgcolor;
  var open_status_callbackstring;
  
  if( mode_and_err == MODE_ERROR ){
    res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('sorry, I can NOT get DB.\n');
		res.end();
    
    return;
  }
  
  if( mode_and_err == MODE_FORCE_OPEN )   today_is = 1;
  else if( mode_and_err == MODE_FORCE_CLOSE ) today_is = 0;
            
            
  if( today_is == 1 ){
    open_status_image = IMAGE_OPEN;
    open_status_string = STRING_OPEN;
    open_status_bgcolor = BGCOLOR_BLUE;
    open_status_callbackstring = STRING_OPEN2;
  }
  else{
    open_status_image = IMAGE_NOT_OPEN;
    open_status_string = STRING_NOT_OPEN;
    open_status_bgcolor = BGCOLOR_RED;
    open_status_callbackstring = STRING_NOT_OPEN2;
  }
            
  console.log("open_status_string="+open_status_string+"today_is="+today_is);
            

  var data2 = ejs.render( data, {
              content1: open_status_string,
              content2: open_status_image,
              content3: open_status_bgcolor,
              content4: open_status_callbackstring,
              content5: likecounter
            });
   
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data2);
  res.end();

}




//ロボホンからのリクエストを受ける ★★★★
app.post("/api/command/reference_talk", function(req, res, next){


	console.log("reference_talk="+req.query.content);
  
  //var result = decodeURIComponent( req.params.command );
  //console.log("result="+result);
  
  //update_database( req.params.command );
  
  if((req.query.content == "真似するな") || (req.query.content == "真似すんな")){
    res.send("してへんわー");
    return;
  }
  
  //res.send("your command receive");
  res.send( req.query.content );

});


//管理画面からの特別リクエストを受ける
app.post("/api/command/:command", function(req, res, next){

	console.log("command="+req.params.command);
  
  
  
  //update_database( req.params.command );
  
  res.send("your command receive");

});

app.post('/', function (req, res) {
  res.send('POST request work well');
});

/* ----------------------------
// kintone databaseから情報を取り出す（本処理をメイン処理doRequestに入れるので下記利用しない）
function getDB(){


	// KintoneDBから取得
	var options = {
		url: 'https://v2urc.cybozu.com/k/v1/records.json?app=17',
		headers: {'X-Cybozu-API-Token': '4DRIq9OCEiwk8pqAkYN5WG5tmQ41QZ5Mak8FRBli'},
		json: true
	};
	request.get(options, function(error, response, body){
		if(!error && response.statusCode == 200){
				console.log("get success!");

				var num = Object.keys(body.records).length;
				console.log("num = " + num);
				var total_count=0;

				for (var i = 0; i < num; i++){

					total_count = total_count + parseInt(body.records[i].count.value);
					last_update = body.records[i].time.value;

//					console.log("count = " + body.records[i].count.value);
//					console.log("time = " + body.records[i].time.value);
				}

				console.log("total_count = " + total_count);
				return(parseInt(total_count));



		}else{
			console.log('error: ' + response.statusCode);

		}
	});

return(0);

}
----------------------- */

/* ---------------
function isToday( iso_date ){	// "2015-12-16T20:29:00Z"というString
	var ret;

	iso_date_formatted = new Date( iso_date );
	nowDate = new Date();
	
//	console.log("iso_date_formatted = " + iso_date_formatted.getDate() );
//	console.log("nowDate = " + nowDate.getDate() );

	if( iso_date_formatted.getDate() == nowDate.getDate() ){
		ret = 1;
	}else{
		ret = 0;
	}
//    console.log("isToday="+ret);
	
	return( ret );

}
function isToday2( iso_date, latitude, longitude ){	// "2015-12-16T20:29:00Z"というString
	var ret=0;
    
//    console.log("parseFloat(latitude)="+parseFloat(latitude) + "parseFloat(longitude)="+parseFloat(longitude));

    

    if( isToday( iso_date ) == 1 ){
        if(( parseFloat(latitude) == parseFloat(PLACE_LATITUDE) ) 
           && ( parseFloat(longitude) == parseFloat(PLACE_LONGITUDE) )){
            ret = 1;
        }
        console.log("isToday2="+ret+" parseFloat(latitude)="+parseFloat(latitude) + " parseFloat(longitude)="+parseFloat(longitude));
    }
//    console.log("isToday2="+ret);

	return( ret );

}
--------------------- */


/* --------------------------------------------
 Postgres databaseをupdate
 引数：
  command = force_open → DBのopenstatusカラムを DB_OPENSTATUS_OPENにセット
  command = force_close→DBのopenstatusカラムを DB_OPENSTATUS_CLOSEにセット
  command = judge_sensor →DBのopenstatusカラムを DB_OPENSTATUS_DEFAULTにセット
  command = increment_like →DBのlikecountカラムを１追加
  command = reset_like →DBのlikecountカラムを DB_LIKECOUNT_NONE にセット
  command = set_all_default →DBのDBのopenstatusカラムとlikecountカラムをデフォルトに戻す
  -------------------------------------------- */
 /*
function update_database( command ){
 
    try{
        console.log("START connect database");
        
        var config = {
                host: postgres_host,
                user: postgres_user,
                database: postgres_databases,
                password: postgres_password,
                port: 5432,
                max: 10, // max number of clients in the pool 
                idleTimeoutMillis: 5000, 
        }; 
        
        var pool = new pg.Pool(config);

        pool.connect(function(err, client){
            
            
            if(err){

                console.log("CANNOT open DB");
                //get_booklist_now( req, res );
                return;
            }
            
            var sql_text = make_sql_text(command);
            
            console.log("sql_text = "+sql_text );
        
            client.query( sql_text, function(err, result){
                if(err){
                    console.log("CANNOT read table");
                }
              
                client.end(function (err){
                  if(err){
                    console.log("invalid query.");
                    return;
                  }
                  console.log("db close2");
                });  
			     });
		    });
        pool.on('error', function (err, client) {
            console.log("idle client error", err.message, err.stack);
        });
        
    }catch(e){
        console.log("UNEXPECTED ERROR: cannot connect database");
		console.log(e);
        
    };
    
    
}
*/

/*
function make_sql_text( command ){
	var text = "UPDATE settings SET ";

	switch( command ){
		case "force_open":
			text = text + "openstatus = 1;";
			break;
		case "force_close":
			text = text + "openstatus = 2;";
			break;
		case "judge_sensor":
			text = text + "openstatus = 0;";
			break;
		case "reset_like":
			text = text + "likecount = 0;";
			break;
		case "increment_like":
			text = text + "likecount = likecount+1;";
			break;
    case "set_all_default":
		default:
			text = text + "openstatus = 0,likecount = 0;";
			break;
	}
	return( text );
}
*/