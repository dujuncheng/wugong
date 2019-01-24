#!/bin/sh

path=$1
echo $path

cd $path

echo which node

npm run build
