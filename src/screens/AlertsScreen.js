import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock data for emergency alert history
const mockAlerts = [
  {
    id: '1',
    type: 'geofence',
    title: 'Restricted Area Alert',
    message: 'You entered a restricted area near Gateway of India.',
    timestamp: '2025-09-19T10:30:00Z',
    read: true,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Safety Warning',
    message: 'Heavy rainfall expected in your area. Please stay indoors.',
    timestamp: '2025-09-18T16:45:00Z',
    read: true,
  },
  {
    id: '3',
    type: 'emergency',
    title: 'Emergency Alert',
    message: 'SOS alert triggered. Help was dispatched to your location.',
    timestamp: '2025-09-17T08:12:00Z',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Tourist Information',
    message: 'You are near a historical landmark. Check the app for more details.',
    timestamp: '2025-09-16T14:22:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    title: 'Crowd Alert',
    message: 'Unusually high crowd detected in your vicinity. Stay alert.',
    timestamp: '2025-09-15T20:05:00Z',
    read: false,
  }
];

const AlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState(mockAlerts);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIconName = (type) => {
    switch (type) {
      case 'geofence':
        return 'location-off';
      case 'warning':
        return 'warning';
      case 'emergency':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'geofence':
        return '#ff9800';
      case 'warning':
        return '#ffeb3b';
      case 'emergency':
        return '#f44336';
      case 'info':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const markAsRead = (id) => {
    setAlerts(
      alerts.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const handleAlertPress = (alert) => {
    if (!alert.read) {
      markAsRead(alert.id);
    }
    
    Alert.alert(
      alert.title,
      alert.message,
      [{ text: 'OK' }]
    );
  };

  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.alertItem, !item.read && styles.unreadAlert]}
      onPress={() => handleAlertPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) }]}>
        <Icon name={getIconName(item.type)} size={24} color="white" />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
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
        <Text style={styles.headerTitle}>Alerts & Notifications</Text>
      </View>
      
      {alerts.length > 0 ? (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off" size={64} color="#bdbdbd" />
          <Text style={styles.emptyText}>No alerts to display</Text>
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
  listContainer: {
    padding: 16,
  },
  alertItem: {
    flexDirection: 'row',
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
  unreadAlert: {
    backgroundColor: '#e3f2fd',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e88e5',
    marginLeft: 8,
    alignSelf: 'center',
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

export default AlertsScreen;