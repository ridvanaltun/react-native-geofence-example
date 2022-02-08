import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotification, {Importance} from 'react-native-push-notification';
import Boundary, {Events} from 'react-native-boundary';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';

import {freewayGeofences, eiffelGeofence} from './helper';

PushNotification.createChannel(
  {
    channelId: 'boundary-demo',
    channelName: 'Boundary Channel',
    channelDescription: 'A channel to categorise your notifications',
    playSound: false,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
  },
  created => {
    if (created) console.log('Notification channel created: Boundary Channel');
    else console.log('Notification channel already exist: Boundary Channel');
  },
);

const addGeofences = () => {
  // add freeway geofences
  freewayGeofences.forEach(geofence => {
    Boundary.add(geofence);
  });

  // add eiffel geofence
  Boundary.add(eiffelGeofence)
    .then(() => console.log('[BACKGROUND] - Geofence added!'))
    .catch(e => console.error('[BACKGROUND] - Error:', e));
};

Boundary.on(Events.ENTER, id => {
  console.log('Background Enter');
  PushNotification.localNotification({
    channelId: 'boundary-demo',
    title: 'ENTER SIGNAL',
    message: `You've entered region: ${id} in background`,
    importance: 'max',
    priority: 'max',
    ignoreInForeground: false,
    allowWhileIdle: true,
  });
});

Boundary.on(Events.EXIT, id => {
  console.log('Background Exit');
  PushNotification.localNotification({
    channelId: 'boundary-demo',
    title: 'EXIT SIGNAL',
    message: `You've left region: ${id} in background`,
    importance: 'max',
    priority: 'max',
    ignoreInForeground: false,
    allowWhileIdle: true,
  });
});

const onAfterRebootHeadlessTaskForAndroid = () => async () => {
  Permissions.checkMultiple([
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  ]).then(statuses => {
    const isAccessFineLocationAllowed =
      statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.LIMITED ||
      RESULTS.GRANTED;
    const isAccessBackgroundLocationAllowed =
      statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION] ===
        RESULTS.LIMITED || RESULTS.GRANTED;

    if (isAccessFineLocationAllowed && isAccessBackgroundLocationAllowed)
      addGeofences();
  });
};

// Geo-fences are always erased after phone restart, we need to re register them on boot startup. This part automatically execute after Android phone reboot.
Boundary.onReRegisterRequired(onAfterRebootHeadlessTaskForAndroid);

AppRegistry.registerComponent(appName, () => App);
