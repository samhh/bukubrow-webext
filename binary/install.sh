#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "$0" )" && pwd )"
APP_NAME="com.samhh.bukubrow"
HOST_FILE="$DIR/bukubrow"

# Find target dirs for various browsers & OS'
if [ $(uname -s) == 'Darwin' ]; then
  HOST_FILE="$DIR/bukubrow-darwin-x64"
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR_CHROME="/Library/Google/Chrome/NativeMessagingHosts"
    TARGET_DIR_CHROMIUM="/Library/Application Support/Chromium/NativeMessagingHosts"
    TARGET_DIR_FIREFOX="/Library/Application Support/Mozilla/NativeMessagingHosts"
  else
    TARGET_DIR_CHROME="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
    TARGET_DIR_CHROMIUM="$HOME/Library/Application Support/Chromium/NativeMessagingHosts"
    TARGET_DIR_FIREFOX="$HOME/Library/Application Support/Mozilla/NativeMessagingHosts"
  fi
else
  HOST_FILE="$DIR/bukubrow-linux-x64"
  if [ "$(whoami)" == "root" ]; then
    TARGET_DIR_CHROME="/etc/opt/chrome/native-messaging-hosts"
    TARGET_DIR_CHROMIUM="/etc/chromium/native-messaging-hosts"
    TARGET_DIR_FIREFOX="/usr/lib/mozilla/native-messaging-hosts"
  else
    TARGET_DIR_CHROME="$HOME/.config/google-chrome/NativeMessagingHosts"
    TARGET_DIR_CHROMIUM="$HOME/.config/chromium/NativeMessagingHosts"
    TARGET_DIR_FIREFOX="$HOME/.mozilla/native-messaging-hosts"
  fi
fi

# Escape host file
ESCAPED_HOST_FILE=${HOST_FILE////\\/}

echo ""
echo "Select your browser:"
echo "===================="
echo "1) Chrome"
echo "2) Chromium"
echo "3) Firefox"
echo -n "1-3: "
read BROWSER
echo ""

# Set target dir from user input
if [[ "$BROWSER" == "1" ]]; then
  BROWSER_NAME="Chrome"
  BROWSER_HOST_FILENAME="chrome-host.json"
  TARGET_DIR="$TARGET_DIR_CHROME"
fi

if [[ "$BROWSER" == "2" ]]; then
  BROWSER_NAME="Chromium"
  BROWSER_HOST_FILENAME="chrome-host.json"
  TARGET_DIR="$TARGET_DIR_CHROMIUM"
fi

if [[ "$BROWSER" == "3" ]]; then
  BROWSER_NAME="Firefox"
  BROWSER_HOST_FILENAME="firefox-host.json"
  TARGET_DIR="$TARGET_DIR_FIREFOX"
fi

echo "Installing $BROWSER_NAME host config"

# Create config dir if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy manifest host config file
cp "$DIR/$BROWSER_HOST_FILENAME" "$TARGET_DIR/$APP_NAME.json"

# Replace path to host
sed -i -e "s/%%replace%%/$ESCAPED_HOST_FILE/" "$TARGET_DIR/$APP_NAME.json"

# Set permissions for the manifest so that all users can read it
chmod o+r "$TARGET_DIR/$APP_NAME.json"

echo "Native messaging host for $BROWSER_NAME has been successfully installed to $TARGET_DIR."
