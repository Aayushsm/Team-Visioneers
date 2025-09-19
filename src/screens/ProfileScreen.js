import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emergencyContactsVisible, setEmergencyContactsVisible] = React.useState(false);

  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    deid: 'TD-29384756-IN',
    emergencyContacts: [
      { name: 'Jane Doe', relationship: 'Spouse', phone: '+1 (555) 987-6543' },
      { name: 'Medical Emergency', relationship: 'Service', phone: '108' },
    ]
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would clear auth tokens and navigate to login
            navigation.navigate('Auth');
          }
        },
      ]
    );
  };

  const toggleEmergencyContacts = () => {
    setEmergencyContactsVisible(!emergencyContactsVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#1e88e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userProfile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <View style={styles.deidContainer}>
            <Text style={styles.deidLabel}>Blockchain DeID:</Text>
            <Text style={styles.deidValue}>{userProfile.deid}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Icon name="email" size={20} color="#757575" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userProfile.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="phone" size={20} color="#757575" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{userProfile.phone}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={toggleEmergencyContacts}>
              <Icon 
                name={emergencyContactsVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="#1e88e5" 
              />
            </TouchableOpacity>
          </View>
          
          {emergencyContactsVisible && (
            <View>
              {userProfile.emergencyContacts.map((contact, index) => (
                <View key={index} style={styles.contactItem}>
                  <View style={styles.contactLeft}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  </View>
                  <View style={styles.contactRight}>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                    <TouchableOpacity style={styles.contactCallButton}>
                      <Icon name="phone" size={18} color="#1e88e5" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <TouchableOpacity style={styles.addContactButton}>
                <Icon name="add" size={20} color="#1e88e5" />
                <Text style={styles.addContactText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="location-on" size={20} color="#757575" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#bdbdbd', true: '#bbdefb' }}
              thumbColor={locationEnabled ? '#1e88e5' : '#f5f5f5'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={20} color="#757575" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#bdbdbd', true: '#bbdefb' }}
              thumbColor={notificationsEnabled ? '#1e88e5' : '#f5f5f5'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <TouchableOpacity style={styles.infoLink}>
            <Icon name="help" size={20} color="#757575" style={styles.infoIcon} />
            <Text style={styles.infoLinkText}>Help & Support</Text>
            <Icon name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoLink}>
            <Icon name="privacy-tip" size={20} color="#757575" style={styles.infoIcon} />
            <Text style={styles.infoLinkText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoLink}>
            <Icon name="description" size={20} color="#757575" style={styles.infoIcon} />
            <Text style={styles.infoLinkText}>Terms of Service</Text>
            <Icon name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  scrollContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e88e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  deidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deidLabel: {
    fontSize: 14,
    color: '#1e88e5',
    marginRight: 6,
  },
  deidValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e88e5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: emergencyContactsVisible ? 16 : 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#757575',
    width: 60,
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  contactLeft: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  contactRelation: {
    fontSize: 14,
    color: '#757575',
  },
  contactRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPhone: {
    fontSize: 14,
    color: '#212121',
    marginRight: 12,
  },
  contactCallButton: {
    padding: 8,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  addContactText: {
    fontSize: 16,
    color: '#1e88e5',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#212121',
  },
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  infoLinkText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
});

export default ProfileScreen;