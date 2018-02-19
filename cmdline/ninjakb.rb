#!/usr/bin/ruby
require 'json'
require 'rubyserial'
require 'fileutils'

unless Dir.exist?("#{Dir.home}/.ninjakb")
  FileUtils.mkdir_p("#{Dir.home}/.ninjakb")
end
unless File.exist?("#{Dir.home}/.ninjakb/conf.json")
  FileUtils.cp('../conf/conf.json',"#{Dir.home}/.ninjakb/")
end

conf_file = File.read("#{Dir.home}/.ninjakb/conf.json")
scancodes_file = File.read('../frontend/public/scancodes.json')
$conf=JSON.parse(conf_file)
$scancodes=JSON.parse(scancodes_file)

$serialport = Serial.new $conf["device"], 115200

def sendKeys(layer,side)  
  $conf["layers"][layer][side].each_with_index do |key, i|
    n ="%02d" % i;    
    t='c';
    k=nil;
    if $scancodes["modifiers"].index(key) != nil
      t='m'
      k=key
    else
      k=$scancodes["codes"][key]
    end
    if k
      cmd = "#{side[0]}#{layer}#{n}#{t}#{k}"
      puts cmd
      $serialport.write(cmd)
    end    
  end  
end

sendKeys(0,"left")
sendKeys(0,"right")
sendKeys(1,"left")
sendKeys(1,"right")
$serialport.write("save")
