# Randomizador de Pistas - Mario Kart World

App web progresiva (PWA) para sortear pistas de **Mario Kart World** al azar. Ideal para sesiones KDU donde no te decides que pista jugar.

## Caracteristicas

- **Sorteo aleatorio** con animacion tipo slot machine
- **Modo KDU**: nombres alternativos/humoristicos para cada pista
- **Imagenes toggle**: en Modo KDU, haz clic en la previsualizacion para cambiar la imagen de algunas pistas (Cielos Helados -> McFlurry, Castillo Bowser -> Ariel llorando, Pradera Mu-Mu -> Leche de toro)
- **Persistencia**: el progreso se guarda en `localStorage`
- **Responsive**: funciona en desktop, tablet y movil
- **Offline**: service worker con precarga de todos los assets
- **APK**: disponible como app Android independiente (target API 23, Android 6.0.1)

## Como ejecutar localmente

Es una app web estatica sin dependencias ni build:

```bash
python3 -m http.server 8080
# Abre http://localhost:8080
```

O con Node:

```bash
npx serve .
```

## Estructura del proyecto

```
├── index.html              # Entry point
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker v4 (offline)
├── AGENTS.md               # Instrucciones para agentes
├── css/
│   └── style.css           # Estilos (Nintendo-like red theme)
├── js/
│   ├── data.js             # Datos de pistas + imgMap
│   ├── app.js              # Logica principal
│   └── sw-register.js      # Registro del service worker
├── android/                # Proyecto Android APK
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew
│   ├── build-apk.sh        # Script para generar APK
│   └── app/
│       └── src/main/
│           ├── AndroidManifest.xml
│           ├── assets/         # PWA embebida (se copia desde la raiz)
│           └── java/.../
│               └── MainActivity.java
├── assets/
│   ├── fonts/              # Fuentes locales (Fredoka, Press Start 2P, Ubuntu)
│   ├── images/
│   │   ├── backgrounds/    # Fondos
│   │   ├── icons/          # Iconos PWA (192x192, 512x512)
│   │   ├── logos/          # Logos KDU y Mario Aniversario
│   │   └── tracks/         # Imagenes de las 30 pistas
└── doc/
    └── CHANGELOG.md        # Registro de cambios
```

## Generar APK (actualizacion)

Se genera localmente con **Gradle + WebView** (no TWA, no necesita URL ni internet). Requisitos:

- Java 23+ (`/usr/java/jdk-23-oracle-x64/bin/jarsigner`)
- Android SDK en `/tmp/android-sdk` (`build-tools 34.0.0`, `platforms android-34`)
- Debug keystore en `~/.android/debug.keystore` (pass: `android`)

### Estructura del proyecto Android

```
/android/
├── build.gradle              # Android Gradle plugin 8.2.0
├── settings.gradle
├── gradle.properties
├── gradlew                   # Gradle wrapper
├── build-apk.sh              # Script para generar APK
└── app/
    ├── build.gradle
    └── src/main/
        ├── AndroidManifest.xml
        ├── assets/           # <-- Aqui van los archivos de la PWA
        │   ├── index.html
        │   ├── css/
        │   ├── js/
        │   ├── manifest.json
        │   ├── service-worker.js
        │   └── assets/       # imagenes y fuentes
        │       ├── images/
        │       └── fonts/
        └── java/com/kdu/randompistas/
            └── MainActivity.java   # WebView que carga file:///android_asset/index.html
```

### Pasos

```bash
# Un solo comando
./android/build-apk.sh
```

O manualmente:

```bash
# 1. Compilar el APK
JAVA_HOME=/usr/java/jdk-23-oracle-x64 ANDROID_HOME=/tmp/android-sdk \
  ./android/gradlew assembleRelease

# 2. Alinear con zipalign
/tmp/android-sdk/build-tools/34.0.0/zipalign -v -p 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  /tmp/kdu-app-release-unsigned-aligned.apk

# 3. Firmar con jarsigner
/usr/java/jdk-23-oracle-x64/bin/jarsigner \
  -keystore ~/.android/debug.keystore \
  -storepass android -keypass android \
  -signedjar /tmp/kdu-app-release-signed.apk \
  /tmp/kdu-app-release-unsigned-aligned.apk \
  androiddebugkey

# 4. Copiar al proyecto
cp /tmp/kdu-app-release-signed.apk RandomKDU-v2.apk
```

### Notas

- La APK no necesita internet -- todo funciona offline porque los assets van embebidos
- El WebView carga `file:///android_asset/index.html` (NO `file:///android_asset/assets/index.html`)
- El service worker no se registra (file:// no lo soporta), pero no hace falta
- Min SDK 19 (Android 4.4+), target SDK 34 -- compatible con Android 6.0.1 de la tablet KDU
- Si se necesita regenerar desde cero, el proyecto base esta en `android/`
