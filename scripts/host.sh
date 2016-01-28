#!/bin/bash

#HOST
#Descargar el escenario e iniciarlo
cd ..
pwd_inicial=$PWD
if [ ! -d p7 ]
then
    wget http://idefix.dit.upm.es/download/cdps/p7/p7.tgz;
    tar xfvz p7.tgz;
fi

mv confs/p7.xml p7/
cd p7
bin/prepare-p7-vm
vnx -f p7.xml -v --create
cd $pwd_inicial
rm p7.tgz


#BALANCEADOR
#Detener apache 
lxc-attach -n lb -- /etc/init.d/apache2 stop
lxc-attach -n lb -- /etc/init.d/ssh start

#Poner hosts
cp confs/hosts /etc/hosts
#Subir los scripts a sus maquinas
chmod 777 scripts/*.sh

#NAGIOS
cp -r folders/nagios /var/lib/lxc/nagios/rootfs/root
cp scripts/nagios.sh /var/lib/lxc/nagios/rootfs/root


#NAS
cp scripts/nas.sh /var/lib/lxc/nas1/rootfs/root


#Servidor con la logica
cp confs/hosts  scripts/servidorS1.sh  /var/lib/lxc/s1/rootfs/root
cp -r folders/sustituirS1 /var/lib/lxc/s1/rootfs/root


cp confs/hosts  scripts/servidorS1rep.sh /var/lib/lxc/s1rep/rootfs/root
cp -r folders/sustituirS1 /var/lib/lxc/s1rep/rootfs/root


#Resto de servidores
cp scripts/servidorSx.sh /var/lib/lxc/s2/rootfs/root
cp -r folders/sustituirSx /var/lib/lxc/s2/rootfs/root

cp scripts/servidorSx.sh /var/lib/lxc/s3/rootfs/root
cp -r folders/sustituirSx /var/lib/lxc/s3/rootfs/root

cp scripts/servidorSx.sh /var/lib/lxc/s4/rootfs/root
cp -r folders/sustituirSx /var/lib/lxc/s4/rootfs/root


#Balanceador
cp scripts/balanceador.sh /var/lib/lxc/lb/rootfs/root






