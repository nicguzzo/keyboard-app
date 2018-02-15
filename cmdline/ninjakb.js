
var fs = require('fs');
var conf = JSON.parse(fs.readFileSync('../conf/conf.json', 'utf8'));
var scancodes = JSON.parse(fs.readFileSync('../frontend/public/scancodes.json', 'utf8'));
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
  baudRate: 115200
});
function sendKeys(layer,side){
  const { layers } = conf;
  layers[layer][side].map( (key, i) => {
    const n =`0${i}`.slice(-2);
    //console.log(this.scancodes);
    let t='c';
    let k=null;
    if( scancodes.modifiers.indexOf(key)>=0){
      t='m';
      k=key;
    }else{
      k=scancodes.codes[key];
    }
    if(k){
      const cmd = `${side.slice(0,1)}${layer}${n}${t}${k}`;
      //this.socket.send(cmd);
      
      port.write(cmd,function(){
        port.flush();
      });
      //setTimeout(function() {
      //  console.log('...');
      //}, 500);
      console.log(cmd);
    }
    return true;
  });
  
}
port.on("open",function(){
  sendKeys(1,'left');
  sendKeys(1,'right');
  port.write("save");
});
