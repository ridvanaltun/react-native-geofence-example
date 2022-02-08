## React Native Geofence Example

This repo contains a working example of geofencing. My aim is to create a reference resource for future geofencing related applications in React-Native.

## Usage

```bash
# clone the project and go into it
$ git clone https://github.com/ridvanaltun/react-native-geofence-example.git
$ cd react-native-geofence-example

# make installations
$ npm i
$ cd ios && npx pod-install && cd ..

# set an env file
$ cp .env.example .env

# run for android
$ npm run android

# run for ios
$ npm run ios
```

# What I Learned So Far?

- Android removes geo-fences after reboot, we need to re register them after boot. (iOS works fine, there is no need of special code for after booting)
- When make testing on Android emulator, we need to open a map (Google Maps or in app map etc.) to receive geo-fence signals.
- When make testing on iOS emulator, custom routes not trigger the geo-fences somehow, we need to use preregistered routes.
- On Android, you need to ask necessary permissions before add geo-fences, otherwise app will crash.
- iOS can't run some special code blocks in background unlike Android, instead it will run the whole app for 10 secs when receiving a geo-fence signal.
- Android allow us 100 geo-fences per app and iOS allow us 20 geo-fences per app. This can be increased, but need to find a technique.
- On Android emulator, we need to change a setting to ability to use geofencing: `Settings -> Location -> Mode -> Click "High Accuracy" or "Battery Saving"`
