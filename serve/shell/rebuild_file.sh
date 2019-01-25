#!/bin/sh

echo "create_branch"
target=$1
echo $target

cd $target

echo which node

npm run build
