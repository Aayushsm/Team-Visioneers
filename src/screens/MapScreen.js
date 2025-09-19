import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, Circle, Polygon } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock geofence data (this would come from the API in a real app)
const mockGeofences = [
  {
    id: 1,
    name: 'Safe Zone',
    type: 'safe',
    coordinates: [
      { latitude: 37.7749 - 0.002, longitude: -122.4194 - 0.002 },
      { latitude: 37.7749 - 0.002, longitude: -122.4194 + 0.002 },
      { latitude: 37.7749 + 0.002, longitude: -122.4194 + 0.002 },
      { latitude: 37.7749 + 0.002, longitude: -122.4194 - 0.002 },
    ],
    fillColor: 'rgba(0, 255, 0, 0.2)',
    strokeColor: 'rgba(0, 255, 0, 0.5)',
  },
  {
    id: 2,
    name: 'Restricted Area',
    type: 'restricted',
    coordinates: [
      { latitude: 37.7749 - 0.004, longitude: -122.4194 - 0.004 },
      { latitude: 37.7749 - 0.004, longitude: -122.4194 - 0.008 },
      { latitude: 37.7749 - 0.008, longitude: -122.4194 - 0.008 },
      { latitude: 37.7749 - 0.008, longitude: -122.4194 - 0.004 },
    ],
    fillColor: 'rgba(255, 0, 0, 0.2)',
    strokeColor: 'rgba(255, 0, 0, 0.5)',
  },
  {
    id: 3,
    name: 'Monitored Zone',
    type: 'monitored',
    coordinates: [
      { latitude: 37.7749 + 0.004, longitude: -122.4194 + 0.004 },
      { latitude: 37.7749 + 0.004, longitude: -122.4194 + 0.008 },
      { latitude: 37.7749 + 0.008, longitude: -122.4194 + 0.008 },
      { latitude: 37.7749 + 0.008, longitude: -122.4194 + 0.004 },
    ],
    fillColor: 'rgba(255, 255, 0, 0.2)',
    strokeColor: 'rgba(255, 255, 0, 0.5)',
  },
];

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 37.7749, // Default latitude (San Francisco)
    longitude: -122.4194, // Default longitude (San Francisco)
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [geofences, setGeofences] = useState(mockGeofences);
  const mapRef = useRef(null);

  useEffect(() => {
    // Request location permission and get current location
    const requestLocationPermission = async () => {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          // Start watching position
          const watchId = Geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newLocation = { latitude, longitude };
              
              setCurrentLocation(newLocation);
              setRegion((prev) => ({
                ...prev,
                latitude,
                longitude,
              }));
              
              // Check if user is inside any geofence
              checkGeofenceStatus(newLocation);
              
              // In a real app, we would send the location to the backend
              // sendLocationToBackend(newLocation);
            },
            (error) => {
              console.error(error);
              Alert.alert('Error', 'Failed to get location');
            },
            { 
              enableHighAccuracy: true, 
              distanceFilter: 10,
              interval: 5000,
              fastestInterval: 2000,
            }
          );
          
          // Cleanup function to stop watching location
          return () => Geolocation.clearWatch(watchId);
        } else {
          Alert.alert('Permission Denied', 'Location permission is required for this app to work properly');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    
    requestLocationPermission();
    
    // In a real app, we would fetch geofences from the API
    // fetchGeofences();
  }, []);
  
  const checkGeofenceStatus = (location) => {
    // This is a simplified check. In a real app, we would use proper polygon containment algorithm
    // like point-in-polygon from turf.js
    
    // For demo purposes, we'll just check if the user is close to the center of any polygon
    geofences.forEach(geofence => {
      // Calculate center of the polygon
      const center = geofence.coordinates.reduce(
        (acc, coord) => ({
          latitude: acc.latitude + coord.latitude / geofence.coordinates.length,
          longitude: acc.longitude + coord.longitude / geofence.coordinates.length,
        }),
        { latitude: 0, longitude: 0 }
      );
      
      // Calculate distance
      const distance = getDistanceFromLatLonInMeters(
        location.latitude,
        location.longitude,
        center.latitude,
        center.longitude
      );
      
      // Alert if close to a restricted area (within 100 meters)
      if (geofence.type === 'restricted' && distance < 100) {
        Alert.alert(
          'Warning!',
          `You are approaching a restricted area: ${geofence.name}. Please be cautious.`,
          [{ text: 'OK' }]
        );
      }
    });
  };
  
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'Are you sure you want to send an emergency alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'YES, SEND HELP', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would call the emergency API
            // sendEmergencyAlert(currentLocation);
            
            Alert.alert(
              'Help is on the way!',
              'Your emergency alert has been sent. Authorities have been notified of your location.',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const goToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Map</Text>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleSOS}
        >
          <Icon name="warning" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton={true}
      >
        {/* Render geofence polygons */}
        {geofences.map((geofence) => (
          <Polygon
            key={geofence.id}
            coordinates={geofence.coordinates}
            fillColor={geofence.fillColor}
            strokeColor={geofence.strokeColor}
            strokeWidth={2}
          />
        ))}
        
        <Circle
          center={region}
          radius={500}
          strokeColor="rgba(30, 136, 229, 0.5)"
          fillColor="rgba(30, 136, 229, 0.2)"
        />
      </MapView>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.navigate('Nearby')}
        >
          <Icon name="place" size={20} color="#1e88e5" />
          <Text style={styles.controlText}>Nearby</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => Alert.alert('Feature', 'Route planning coming soon!')}
        >
          <Icon name="directions" size={20} color="#1e88e5" />
          <Text style={styles.controlText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e88e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emergencyButton: {
    backgroundColor: '#f44336',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
  },
  controlText: {
    marginTop: 4,
    fontSize: 12,
    color: '#1e88e5',
  },
});

export default MapScreen;