//extern crate ws;
extern crate serial;
extern crate websocket;

use std::time::Duration;
use serial::prelude::*;
use std::io::prelude::*;
use std::thread;
use websocket::OwnedMessage;
use websocket::sync::Server;
use websocket::Message;
use websocket::ws::dataframe::DataFrame;
use std::fs::File;
//use std::io::prelude::*;

const SETTINGS: serial::PortSettings = serial::PortSettings {
  baud_rate:    serial::Baud115200,
  char_size:    serial::Bits8,
  parity:       serial::ParityNone,
  stop_bits:    serial::Stop1,
  flow_control: serial::FlowNone,
};

fn main () {

  let server = Server::bind("127.0.0.1:3333").unwrap();

  for request in server.filter_map(Result::ok) {
    // Spawn a new thread for each connection.
    thread::spawn(move || {
      if !request.protocols().contains(&"rust-websocket".to_string()) {
        request.reject().unwrap();
        return;
      }
      let port_s="/dev/ttyACM0";
      
      let mut port =serial::open(port_s).unwrap();
      let s = String::from("hello");
      let bytes = s.into_bytes();
      port.configure(&SETTINGS).unwrap();
      port.set_timeout(Duration::from_secs(1)).unwrap();
      port.write(&bytes).unwrap();
      
      let mut client = request.use_protocol("rust-websocket").accept().unwrap();
      //let mut client = request.accept().unwrap();

      let ip = client.peer_addr().unwrap();

      println!("Connection from {}", ip);

      let message = OwnedMessage::Text("{\"opcode\":\"hello\"}".to_string());
      client.send_message(&message).unwrap();

      let (mut receiver, mut sender) = client.split().unwrap();

      for message in receiver.incoming_messages() {
        let message = message.unwrap();

        match message {
          OwnedMessage::Close(_) => {
            let message = OwnedMessage::Close(None);
            sender.send_message(&message).unwrap();
            println!("Client {} disconnected", ip);
            return;
          }
          OwnedMessage::Ping(ping) => {
            let message = OwnedMessage::Pong(ping);
            sender.send_message(&message).unwrap();
          }
          _ => {
            let mm=String::from_utf8(message.take_payload()).unwrap();
            match mm.as_ref() {
               "get_conf" => {
                  println!("get_conf");
                  let mut file = File::open("conf/conf.json").unwrap();
                  let mut contents = String::new();
                  file.read_to_string(&mut contents).unwrap();
                  
                  let mut op=String::from("{\"opcode\": \"conf\" ,\"payload\": ")+&contents;
                  op=op+&String::from("}");
                  let msg = Message::text(op);
                  let _ = sender.send_message(&msg);
                },
                _ => {
                    println!("cmd");
                    //prt.unwrap().write(&mm.as_bytes()).unwrap();
                    port.write(&mm.as_bytes()).unwrap();                   
                } 
            }
          }
        }
      }
    });
  }  
}