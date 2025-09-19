import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock data for nearby places
const mockPlaces = [
  {
    id: '1',
    name: 'City Hospital',
    type: 'hospital',
    address: '123 Medical Street, San Francisco',
    distance: '0.8 km',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Central Police Station',
    type: 'police',
    address: '456 Safety Avenue, San Francisco',
    distance: '1.2 km',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Golden Gate Park',
    type: 'attraction',
    address: '501 Stanyan St, San Francisco',
    distance: '2.5 km',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Emergency Medical Center',
    type: 'hospital',
    address: '789 Health Boulevard, San Francisco',
    distance: '3.0 km',
    rating: 4.4,
  },
  {
    id: '5',
    name: 'Tourist Information Center',
    type: 'info',
    address: '101 Visitor Plaza, San Francisco',
    distance: '0.5 km',
    rating: 4.1,
  },
  {
    id: '6',
    name: 'Coastal Highway Police Checkpoint',
    type: 'police',
    address: '202 Beach Road, San Francisco',
    distance: '4.7 km',
    rating: 3.9,
  },
  {
    id: '7',
    name: 'Fisherman\'s Wharf',
    type: 'attraction',
    address: 'Beach Street & The Embarcadero',
    distance: '1.9 km',
    rating: 4.6,
  },
];

const NearbyScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setPlaces(mockPlaces);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filterPlaces = (type) => {
    setActiveFilter(type);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (type === 'all') {
        setPlaces(mockPlaces);
      } else {
        setPlaces(mockPlaces.filter(place => place.type === type));
      }
      setLoading(false);
    }, 500);
  };

  const getIconName = (type) => {
    switch (type) {
      case 'hospital':
        return 'local-hospital';
      case 'police':
        return 'local-police';
      case 'attraction':
        return 'photo-camera';
      case 'info':
        return 'info';
      default:
        return 'place';
    }
  };

  const handlePlacePress = (place) => {
    // In a real app, this would navigate to a details screen or open maps
    console.log('Selected place:', place);
    navigation.navigate('Map');
  };

  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.placeItem}
      onPress={() => handlePlacePress(item)}
    >
      <View style={styles.iconContainer}>
        <Icon name={getIconName(item.type)} size={24} color="#1e88e5" />
      </View>
      <View style={styles.placeContent}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
        <View style={styles.placeMetaContainer}>
          <Text style={styles.placeDistance}>{item.distance}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#ffc107" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <Icon name="arrow-forward-ios" size={16} color="#bdbdbd" />
    </TouchableOpacity>
  );

  const renderFilterButton = (title, type) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === type && styles.activeFilterButton,
      ]}
      onPress={() => filterPlaces(type)}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === type && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#1e88e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Places</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', 'all')}
        {renderFilterButton('Hospitals', 'hospital')}
        {renderFilterButton('Police', 'police')}
        {renderFilterButton('Attractions', 'attraction')}
        {renderFilterButton('Info Centers', 'info')}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e88e5" />
          <Text style={styles.loadingText}>Loading nearby places...</Text>
        </View>
      ) : places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderPlaceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={64} color="#bdbdbd" />
          <Text style={styles.emptyText}>No places found nearby</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    overflow: 'scroll',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeFilterButton: {
    backgroundColor: '#1e88e5',
  },
  filterText: {
    fontSize: 14,
    color: '#757575',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeContent: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  placeMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeDistance: {
    fontSize: 12,
    color: '#1e88e5',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 16,
  },
});

export default NearbyScreen;