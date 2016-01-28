#!/bin/bash

#Instalamos nagios en el servidor y activamos apache

sudo apt-get update
service apache2 restart
sudo apt-get install -y nagios3

#Copiamos los archivos con los hosts a monitorizar
cd
cd nagios
mv host-lic.cfg /etc/nagios3/conf.d/
mv hostgroups_nagios2.cfg /etc/nagios3/conf.d/
mv services_nagios2.cfg /etc/nagios3/conf.d/
cd /etc/nagios3/conf.d

service nagios3 restart
service apache2 restart

