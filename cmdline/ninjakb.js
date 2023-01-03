
const fs = require('fs');
const conf = JSON.parse(fs.readFileSync('../conf/conf.json', 'utf8'));
const scancodes = JSON.parse(fs.readFileSync('../frontend/public/scancodes.json', 'utf8'));
const {SerialPort} = require('serialport');

const port = new SerialPort({
  path: conf['device'],
  baudRate: 115200
});

function processKey(key, i, side, layer){
  const n =`0${i}`.slice(-2);
  let t='c';
  let k=null;
  if( scancodes.modifiers.indexOf(key)>=0){
    t='m';
    k=key;
  }else{
    if(key.match(/^M[ULDRB]/)) {
      t='p'
      k=key
    }else{      
      k=scancodes.codes[key];
    } 
    //k=scancodes.codes[key];
  }
  if(k){
    const cmd = `${side}${layer}${n}${t}${k}`;
    port.write(cmd, function(){
      port.flush();
    });
    console.log(cmd);
  }
}
function sendKeys(){
  const { layers } = conf;
  const sides_a=["left","right"]
  const sides_aa=["l","r"]
  for (let l=0; l<layers.length; l++){    
    for (let s=0; s<2; s++){
      const ss=sides_a[s];
      const keys = layers[l][ss];
//      console.log(keys);
      for (let i=0; i<keys.length; i++){
        processKey(keys[i], i, sides_aa[s], l);
      }
    }
  }
}

port.on("open",  function(){
  sendKeys();
  port.write("save");
  console.log('All keys sent');
  console.log('dump0');
  port.write("dump0");
  console.log('dump1');
  port.write("dump1");
  
});
