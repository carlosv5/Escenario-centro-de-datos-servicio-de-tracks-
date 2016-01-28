#!/bin/bash

#Configuramos los glusterFS
gluster peer probe 10.1.3.22
gluster peer probe 10.1.3.23
#gluster peer status
gluster volume create nas replica 3 10.1.3.21:/nas 10.1.3.22:/nas 10.1.3.23:/nas force
gluster volume start nas
#gluster volume info
echo "Recuerda montarlo en los servidores"
