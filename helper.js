import freewayMock from './mocks/freewayMock';

export const freewayGeofences = freewayMock.map((item, index) => {
  return {
    lat: item.lat,
    lng: item.lng,
    radius: 400,
    id: `freeway-${index}`,
  };
});

export const eiffelGeofence = {
  lat: 48.86059355484915,
  lng: 2.2908871400126194,
  radius: 150,
  id: 'eiffel-tower-bridge',
};
