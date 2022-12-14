#!/bin/bash

# JSON Helper

function jsonValue() {
	KEY=$1
	num=$2
	awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/'$KEY'\042/){print $(i+1)}}}' | tr -d '"[:space:]' | sed -n ${num}p
}

# INPUT PARAMETERS LIST
APP_ID=""
INSTALLER_VERSION=""
FRAMEWORK_VERSION="latest"
UI_CONFIG="EMPTY"
AUTOREGISTER_PUSH=true
USE_UI=true
DEBUG=false
AUTO_INIT=true

CURRENT_DIR=$PWD
BASEDIR=$(dirname $0)

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        --installer-version)
            INSTALLER_VERSION=$VALUE
            ;;
        --framework-version)
            FRAMEWORK_VERSION=$VALUE
            ;;
        --use-ui)
            USE_UI=$VALUE
            ;;
        --app-id)
            APP_ID=$VALUE
            ;;
        --ui-config)
            UI_CONFIG=$VALUE
            ;;
        --autoregister-push)
            AUTOREGISTER_PUSH=$VALUE
            ;;
        --debug)
            DEBUG=$VALUE
            ;;
        --auto-init)
            AUTO_INIT=$VALUE
            ;;
        *)
            echo "error: GetSocial: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

if [ -z "$APP_ID" ]
then
	echo "error: GetSocial: --app-id parameter is mandatory"
	exit 1
fi

# Check latest version

LATEST_INSTALLER_VERSION=`curl -s -X GET "https://downloads.getsocial.im/ios-installer/releases/latest.json" | jsonValue version 1`

if [ -z "$INSTALLER_VERSION" ]
then
    INSTALLER_VERSION=$LATEST_INSTALLER_VERSION
fi

if [ $LATEST_INSTALLER_VERSION != $INSTALLER_VERSION ]
then
	echo "warning: GetSocial: There is a newer version of the installer script available."
fi

INSTALLER_SCRIPT_DIR="getsocial-installer-script-$INSTALLER_VERSION"
INSTALLER_SCRIPT_URL="https://downloads.getsocial.im/ios-installer/releases/ios-installer-$INSTALLER_VERSION.zip"

if [ ! -e $INSTALLER_SCRIPT_DIR/installer.py ]
then
	curl -o getsocial-installer-script.zip $INSTALLER_SCRIPT_URL
	unzip getsocial-installer-script.zip -d $INSTALLER_SCRIPT_DIR/
fi

python $INSTALLER_SCRIPT_DIR/installer.py --app-id $APP_ID \
	--framework-version $FRAMEWORK_VERSION \
	--use-ui $USE_UI \
	--ui-config $UI_CONFIG \
	--autoregister-push $AUTOREGISTER_PUSH \
	--debug $DEBUG \
    --auto-init $AUTO_INIT

#cleanup
`rm -f $LATEST_INSTALLER_VERSION`
`rm -f installer-script.zip`
`rm -f frameworks.zip`
