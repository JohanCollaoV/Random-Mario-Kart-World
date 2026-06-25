#!/usr/bin/env bash
set -euo pipefail

ANDROID_SDK="/tmp/android-sdk"
JAVA_HOME="/usr/java/jdk-23-oracle-x64"
KEYSTORE="$HOME/.android/debug.keystore"
KEYSTORE_PASS="android"
KEY_ALIAS="androiddebugkey"
BUILD_DIR="$(dirname "$0")"

echo "=== Generando APK Random KDU ==="

# Setup local.properties
echo "sdk.dir=$ANDROID_SDK" > "$BUILD_DIR/local.properties"

# Step 1: Compile
echo "[1/4] Compilando..."
JAVA_HOME="$JAVA_HOME" ANDROID_HOME="$ANDROID_SDK" "$BUILD_DIR/gradlew" assembleRelease

# Step 2: Align
echo "[2/4] Alineando..."
"$ANDROID_SDK/build-tools/34.0.0/zipalign" -v -p 4 \
    "$BUILD_DIR/app/build/outputs/apk/release/app-release-unsigned.apk" \
    "/tmp/kdu-app-release-unsigned-aligned.apk" 2>&1 | tail -1

# Step 3: Sign
echo "[3/4] Firmando..."
"$JAVA_HOME/bin/jarsigner" \
    -keystore "$KEYSTORE" \
    -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
    -signedjar "/tmp/kdu-app-release-signed.apk" \
    "/tmp/kdu-app-release-unsigned-aligned.apk" \
    "$KEY_ALIAS" 2>&1 | grep -v "Warning"

# Step 4: Copy
echo "[4/4] Copiando..."
cp "/tmp/kdu-app-release-signed.apk" "$BUILD_DIR/../RandomKDU-v2.apk"

echo "=== APK lista: $BUILD_DIR/../RandomKDU-v2.apk ==="
