import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../utils/styles';

const EmergencyScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [emergencyContactVisible, setEmergencyContactVisible] = useState(false);

  const sendEmergencyAlert = (type) => {
    Alert.alert(
      'Emergency Alert Sent',
      `${type} alert has been sent to authorities and emergency contacts.`,
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  const callEmergency = (number) => {
    Alert.alert(
      'Emergency Call',
      `Calling ${number}...`,
      [{ text: 'OK' }]
    );
  };

  const EmergencyButton = ({ icon, title, subtitle, onPress, color = colors.danger }) => (
    <TouchableOpacity 
      style={[styles.emergencyButton, { borderColor: color }]} 
      onPress={onPress}
    >
      <View style={[styles.emergencyButtonIcon, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <View style={styles.emergencyButtonText}>
        <Text style={[styles.emergencyButtonTitle, { color }]}>{title}</Text>
        <Text style={styles.emergencyButtonSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="arrow-forward" size={20} color={color} />
    </TouchableOpacity>
  );

  const QuickContactButton = ({ icon, label, number, color }) => (
    <TouchableOpacity 
      style={[styles.quickContactButton, { backgroundColor: `${color}15` }]}
      onPress={() => callEmergency(number)}
    >
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.quickContactLabel, { color }]}>{label}</Text>
      <Text style={styles.quickContactNumber}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.danger} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emergencyHeader}>
          <Icon name="warning" size={48} color={colors.background.primary} />
          <Text style={styles.emergencyTitle}>Emergency</Text>
          <Text style={styles.emergencySubtitle}>Get help when you need it most</Text>
        </View>

        {/* Quick Contact Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Emergency Contacts</Text>
          <View style={styles.quickContactsGrid}>
            <QuickContactButton
              icon="local-police"
              label="Police"
              number="100"
              color={colors.primary}
            />
            <QuickContactButton
              icon="local-hospital"
              label="Ambulance"
              number="108"
              color={colors.danger}
            />
            <QuickContactButton
              icon="local-fire-department"
              label="Fire"
              number="101"
              color={colors.warning}
            />
            <QuickContactButton
              icon="help"
              label="Tourist Help"
              number="1363"
              color={colors.info}
            />
          </View>
        </View>

        {/* Emergency Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Actions</Text>
          
          <EmergencyButton
            icon="my-location"
            title="Share My Location"
            subtitle="Send your location to emergency contacts"
            onPress={() => sendEmergencyAlert('Location')}
            color={colors.primary}
          />
          
          <EmergencyButton
            icon="sos"
            title="SOS Alert"
            subtitle="Send emergency alert with location"
            onPress={() => sendEmergencyAlert('SOS')}
            color={colors.danger}
          />
          
          <EmergencyButton
            icon="local-hospital"
            title="Nearest Hospital"
            subtitle="Find closest medical facility"
            onPress={() => sendEmergencyAlert('Hospital')}
            color={colors.success}
          />
          
          <EmergencyButton
            icon="local-police"
            title="Police Station"
            subtitle="Locate nearest police station"
            onPress={() => sendEmergencyAlert('Police')}
            color={colors.info}
          />
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Emergency Contacts</Text>
            <TouchableOpacity onPress={() => {}}>
              <View style={styles.addButton}>
                <Icon name="add" size={20} color={colors.primary} />
                <Text style={styles.addButtonText}>Add</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* ...existing contacts list... */}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <View style={styles.safetyTipsHeader}>
            <Icon name="lightbulb" size={24} color={colors.warning} />
            <Text style={styles.sectionTitle}>Safety Tips</Text>
          </View>
          {/* ...existing safety tips... */}
        </View>
      </ScrollView>
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
    backgroundColor: '#f44336',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emergencyHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 8,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  quickContactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickContactButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickContactLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  quickContactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  emergencyButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  emergencyButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyButtonSubtitle: {
    fontSize: 14,
    color: colors.text.light,
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  safetyTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default EmergencyScreen;
