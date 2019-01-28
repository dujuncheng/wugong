#!/bin/sh

echo "create_branch"
target=$1
echo $target

cd $target

nodeversion = which node

echo $nodeversion

npm run build

echo 'build success'
