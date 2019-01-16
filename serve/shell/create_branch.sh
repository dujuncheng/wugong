#!/bin/sh

echo "create_branch"

project=$1
echo $project
branchName=$2
echo $branchName


cd /var/www/home/$project
git checkout master
git pull origin master
git checkout -b $branchName
git push origin $branchName
