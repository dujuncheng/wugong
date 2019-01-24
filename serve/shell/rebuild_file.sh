#!/bin/sh

path=$1
echo $path

cd $path

sudo npm run build
