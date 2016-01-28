#!/bin/bash

#Configuracion balanceadores
#Balanceo puerto 8080
xr --verbose --server tcp:0:8080 --backend 10.1.2.12:8080 --backend 10.1.2.13:8080 --backend 10.1.2.14:8080 --web-interface 0:8001 -dr &

xr --verbose --server tcp:0:80 --backend 10.1.2.11:8080 --backend 10.1.2.16:8080 --web-interface 0:8002 -dr &
