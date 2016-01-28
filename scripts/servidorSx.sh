#!/bin/bash



mkdir /mnt/nas
mount -t glusterfs 10.1.3.21:/nas /mnt/nas

#Descargamos el servidor node
mkdir CDPSfy
sudo apt-get update -y
sudo apt-get install nodejs -y
cp -r  sustituirSx/* CDPSfy
rm -rf sustituirSx
cd CDPSfy
sudo apt-get install npm
npm install
