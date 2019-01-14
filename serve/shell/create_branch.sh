#!/bin/sh

echo 'sss'

IP=""
NAME=""
PASSWORD=""
NEWPASSWORD=""


while getopts "H:U:P:N:" arg
do
        case $arg in
             H)
                IP=$OPTARG
                ;;
             U)
                NAME=$OPTARG
                ;;
             P)
                PASSWORD=$OPTARG
                ;;
             N)
                NEWPASSWORD=$OPTARG
                ;;
             ?)
            echo "含有未知参数"
        exit 1
        ;;
        esac
done


echo $IP
echo IP

