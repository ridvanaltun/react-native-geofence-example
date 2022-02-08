import React, {useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Platform} from 'react-native';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Boundary from 'react-native-boundary';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView from 'react-native-maps';

import {freewayGeofences, eiffelGeofence} from './helper';

const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

const MapCircle = ({latitude, longitude, radius}) => {
  return (
    <MapView.Circle
      center={{
        latitude,
        longitude,
      }}
      radius={radius}
      strokeWidth={2}
      strokeColor="#3399ff"
      fillColor="rgba(0,0,0,0.5)"
      zIndex={100}
    />
  );
};

const Button = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    handlePermissions();
  }, []);

  const handlePermissions = () => {
    if (isAndroid) handleAndroidPermissions();
    if (isIOS) handleIOSPermissions();
  };

  const handleAndroidPermissions = () => {
    Permissions.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
      fineLocationStatus => {
        switch (fineLocationStatus) {
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
            Permissions.request(
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            ).then(backgroundLocationStatus => {
              switch (backgroundLocationStatus) {
                case RESULTS.GRANTED:
                case RESULTS.LIMITED:
                  handleLocationAllowed();
                  break;
                default:
                  console.log(
                    'ACCESS_BACKGROUND_LOCATION ->',
                    backgroundLocationStatus,
                  );
                  break;
              }
            });
            break;
          default:
            console.log('ACCESS_FINE_LOCATION ->', fineLocationStatus);
            break;
        }
      },
    );
  };

  const handleIOSPermissions = () => {
    Permissions.request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
      locationAlwaysStatus => {
        switch (locationAlwaysStatus) {
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
            handleLocationAllowed();
            break;
          default:
            console.log('LOCATION_ALWAYS ->', locationAlwaysStatus);
            break;
        }
      },
    );
    PushNotificationIOS.requestPermissions().then(response => {
      const isAlertAllowed = response.alert;

      console.log('Is iOS Alert Allowed:', isAlertAllowed);
    });
  };

  const handleLocationAllowed = () => {
    // add freeway geofences
    freewayGeofences.forEach(geofence => {
      Boundary.add(geofence);
    });
    // add eiffel geofence
    Boundary.add(eiffelGeofence)
      .then(() => console.log('[ACTIVE] - Geofence added!'))
      .catch(e => console.error('[ACTIVE] - Error:', e));
  };

  const onNotificationTestPress = () => {
    PushNotification.localNotification({
      channelId: 'boundary-demo',
      title: 'Test Notification',
      message: 'It is a test notification.',
      importance: 'max',
      priority: 'max',
      ignoreInForeground: false,
      allowWhileIdle: true,
    });
  };

  const renderFreeWayGeofences = () => {
    return freewayGeofences.map(geofence => {
      return (
        <MapCircle
          key={geofence.id}
          latitude={geofence.lat}
          longitude={geofence.lng}
          radius={geofence.radius}
        />
      );
    });
  };

  const renderEiffelGeofences = () => {
    return (
      <MapCircle
        key={eiffelGeofence.id}
        latitude={eiffelGeofence.lat}
        longitude={eiffelGeofence.lng}
        radius={eiffelGeofence.radius}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        followsUserLocation
        showsUserLocation
        showsMyLocationButton
        showsCompass
        ref={mapRef}
        style={styles.map}
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      >
        {renderFreeWayGeofences()}
        {renderEiffelGeofences()}
      </MapView>
      <Button onPress={onNotificationTestPress} title="Notification Test" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    fontSize: 15,
    alignSelf: 'flex-end',
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});

export default App;
