/*eslint-env node*/
/*********************************************/
/* bar, single serie, 24h
/*********************************************/
function makeBar(filestring, title, subtitle){
    "use strict";
  let sin = [];
  d3.csv(filestring, function (error, data) {
    for (var i = 0; i < 23; i++) {
      sin.push({hour: data[i].heure, val: data[i].kWh});
    }
    let dat = [
      {key: "Bars", values: sin}
    ];
    let dac = document.getElementById("ttl");
    dac.innerHTML = '<h1>'+ title + ' ' +  subtitle + '</h1>';
    nv.addGraph(function() {
      let chart = nv.models.discreteBarChart()
        .x(function(d) { return d.hour; })
        .y(function(d) { return +d.val; })
        .staggerLabels(true)
        //.tooltips(true)
        .showValues(false);
      chart.yAxis.tickFormat(d3.format('.0f'));
      chart.tooltip.enabled(true);
      d3.select('#chart1 svg')
        .datum(dat)
        .transition().duration(10)
        .call(chart);
        nv.utils.windowResize(chart.update);
      return chart;
    });
  });
}

/*********************************************/
/* Document height
/*********************************************/
function getDocHeight(doc) {
    "use strict";
  let D = doc;
  return Math.min(
    D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight
  );
}

/*********************************************/
/* Adjust height chart
/*********************************************/
function adjust(){
    "use strict";
  let hauteur = getDocHeight(document) - 130;
  let largeur = document.body.clientWidth;
  let doc = document.getElementById("chart1");
  let hautDef = Math.min(hauteur, largeur * 0.66);
  doc.style.height = hautDef + "px";
  return hautDef;
}

/*********************************************/
/* line, single serie, selector
/*********************************************/
function makeLineFocus(filestring, title, subtitle){
    "use strict";
  let sin = [];
  d3.csv(filestring, function (error, data) {
    for (var i = 0; i < 100; i++) {
    sin.push({hour: data[i].heure, val: data[i].kWh});
    }
    let dat = [
    {key: "Bars", values: sin}
    ];
    let dac = document.getElementById("ttl");
    dac.innerHTML = '<h1>'+ title + ' ' +  subtitle + '</h1>';
    nv.addGraph(function() {
      var chart = nv.models.lineWithFocusChart();
      chart.brushExtent([50,70]);
      chart.xAxis.tickFormat(d3.format(',f'));
      chart.x2Axis.tickFormat(d3.format(',f'));
      chart.yAxis.tickFormat(d3.format(',.2f'));
      chart.y2Axis.tickFormat(d3.format(',.2f'));
      chart.useInteractiveGuideline(true);
      d3.select('#chart svg')
        .datum(testData())
        .call(chart);
      nv.utils.windowResize(chart.update);
      return chart;
    });
  });
}

/*********************************************/
/* bar, single serie, selector
/*********************************************/
function makeMultiBar(){
   /*var testdata = [
        {
            "key" : "Quantity" ,
            "bar": true,
            "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
        },
        {
            "key" : "" ,
            "disabled": true,
            "values" : [ [ 1136005200000 , 0] , [ 1138683600000 , 0] , [ 1141102800000 , 0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 0] , [ 1162270800000 , 0] , [ 1164862800000 , 0] , [ 1167541200000 , 0] , [ 1170219600000 , 0] , [ 1172638800000 , 0] , [ 1175313600000 , 0] , [ 1177905600000 , 0] , [ 1180584000000 , 0] , [ 1183176000000 ,0] , [ 1185854400000 , 0] , [ 1188532800000 , 0] , [ 1191124800000 , 0] , [ 1193803200000 , 0] , [ 1196398800000 , 0] , [ 1199077200000 , 0] , [ 1201755600000 , 0] , [ 1204261200000 , 0] , [ 1206936000000 , 0] , [ 1209528000000 , 0] , [ 1212206400000 , 0] , [ 1214798400000 , 0] , [ 1217476800000 , 0] , [ 1220155200000 , 0] , [ 1222747200000 , 0] , [ 1225425600000 , 0] , [ 1228021200000 , 0] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0] , [ 1256961600000 ,0] , [ 1259557200000 , 0] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 ,0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 ,0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0] ]
        }
    ].map(function(series) {
            series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
            return series;
        });*/
       "use strict";
    let sin = [];
  d3.csv(ener.csv, function (error, data) {
    var sin = [];
    var lgth = data.length;
    for (var i = 0; i < lgth; i++) {
      sin.push({hour: data[i].heure, val: data[i].kWh});
    }
    let dat = [
      {key: "Bars", values: sin}
    ];

    var chart;
    nv.addGraph(function() {
        chart = nv.models.linePlusBarChart()
            .margin({top: 50, right: 60, bottom: 30, left: 70});
            //.legendRightAxisHint(' [Using Right Axis]');
           // .color(d3.scale.category10().range());
           
        chart.color(["#1f77b4"]);
        chart.xAxis.tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d));
            })
            .showMaxMin(false);
        //chart.y1Axis.tickFormat(function(d) { return '$' + d3.format('100,f')(d) });
        //chart.bars.forceY([0]).padData(false);
        chart.x2Axis.tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d));
        }).showMaxMin(false);
        
        d3.select('#chart1 svg')
            .datum(dat)
            .call(chart);
        
        nv.utils.windowResize(chart.update);
        //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
  });
}

/*********************************************/
/* Request lien synchrone
/*********************************************/
function retSync(lien) {
    "use strict";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', lien, false); // false = synchrone
  xmlhttp.send(null);
  if (xmlhttp.status === 200) {
    var val = xmlhttp.responseText;
    //console.log('val ' + val);
    return val;
    }
}

/*********************************************/
/* Apply menu to div id topmenu
/*********************************************/
function includeMenu() {
    "use strict";
  const menuText = `
    <div id='menuMAIN' class=''>	
      <table id='menuLINE' class='rootVoices' cellspacing='0' cellpadding='0' border='0'>
        <tr class='TabLine'>			<td class='rootVoice'><a href='./deviceutility'>Home</a></td>
          <td class='rootVoice'>    <a href='./rainjs.html'>Pluie</a>    </td>			
          <td class='rootVoice'>    <a href='./rain24js.html'>Pl.24h</a>    </td>
          <td class='rootVoice'>    <a href='./tempjs.html'>Temp</a>    </td>
          <td class='rootVoice'>    <a href='./enerjs.html'>Ener</a>    </td>
          <td class='rootVoice'>    <a href='./ener24js.html'>En.24H</a>    </td>	
        </tr> 
          <td class='rootVoice'>    <a href='./meteojs.html'>Dashb</a>    </td>
          <td class='rootVoice'>    <a href='./lapsejs.html'>Lapse</a>    </td>
          <td class='rootVoice'>    <a href='./tensiojs.html'>Tensio</a>    </td>
          <td class='rootVoice'>    <a href='./memjs.html'>Server</a>    </td>	
          <td class='rootVoice'>    <a href='./crueC3.html'>Crues</a>    </td>	
          <td class='rootVoice'>    <a href='http://meteo.noiset.free.fr'>Wan</a>    </td>
        </tr>	
      </table>
    </div>
    `;
  document.getElementById("topmenu").outerHTML=menuText;
}
