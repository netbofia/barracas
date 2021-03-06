#!/usr/bin/env bash

#################################
#
# Setting up the new image to run
# this service (aws)
#
#################################


sudo adduser brunocosta
sudo usermod -aG sudo,adm brunocosta
sudo su brunocosta
cd
mkdir .ssh
sudo cp /home/ubuntu/.ssh/authorized_keys ~/.ssh/authorized_keys
sudo chown brunocosta:brunocosta ~/.ssh/authorized_keys
sudo chmod 644 ~/.ssh/authorized_keys
sudo apt update
sudo apt upgrade
sudo apt install mysql-server
sudo snap install --edge --classic node
sudo snap refresh node --classic --channel=13/stable

mkdir git
cd git
git clone https://github.com/netbofia/barracas.git
npm i
sudo systemctl link bin/webserver.service

sudo mysql_secure_installation
sudo mysql -u root -p -e "create USER 'brunocosta'@'localhost' IDENTIFIED BY ''; GRANT ALL PRIVILEGES ON *.* TO 'brunocosta'@'localhost'; FLUSH PRIVILEGES; CREATE DATABASE barracas;"

cd barracas
mysql -u brunocosta -D barracas -p <SQL/LATEST_dump.sql
mysql -u brunocosta -p -e "CREATE USER 'myapp'@'localhost' IDENTIFIED BY '2nFJf798uo2p'; GRANT ALL PRIVILEGES ON barracas.* TO 'myapp'@'localhost'; FLUSH PRIVILEGES;" 

sudo systemctl start webserver
sudo systemctl enable webserver




