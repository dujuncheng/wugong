#!/bin/sh

path=$1
echo $path

cd $path

npm run build
