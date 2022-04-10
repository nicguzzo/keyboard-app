
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('../conf/conf.json', 'utf8'));
const scancodes = JSON.parse(fs.readFileSync('../frontend/public/scancodes.json', 'utf8'));
const {SerialPort} = require('serialport');

const port = new SerialPort({
  path: conf['device'],
  baudRate: 115200
});

async function processKey(key, i, side, layer){
  const n =`0${i}`.slice(-2);
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
    console.log(cmd);
  }
}
async function sendKeys(layer,side){
  const { layers } = conf;
  const keys = layers[layer][side];
  console.log(keys);
  for (let i=0; i<keys.length; i++){
    await processKey(keys[i], i, side, layer);
  }
}

port.on("open",function(){
  sendKeys(1,'left');
  sendKeys(1,'right');
  port.write("save");
  console.log('All keys sent');
});
