#!/bin/sh

project=$1
branch=$2

cd /var/www/home/$project

git checkout $branch


git pull origin $branch

rm -r ./node_modules

cnpm install -S

npm run build

sudo rm -r /var/www/prepare/wugong_project_1/*

cp -r ./dist/* ../../prepare/wugong_project_1/

