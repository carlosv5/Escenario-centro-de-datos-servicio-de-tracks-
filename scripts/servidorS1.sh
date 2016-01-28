#!/bin/bash
sudo mv hosts /etc/hosts
mkdir /mnt/nas
mount -t glusterfs 10.1.3.21:/nas /mnt/nas
#Descargamos el servidor node
#git clone https://github.com/aalonsog/CDPSfy
mkdir CDPSfy
sudo apt-get update -y
sudo apt-get install nodejs -y
cp -r  sustituirS1/* CDPSfy
rm -rf sustituirS1
cd CDPSfy
sudo apt-get install npm
npm install


