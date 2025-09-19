import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Animated,
  Dimensions,
  Platform,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, globalStyles } from '../utils/styles';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [emergencyContactVisible, setEmergencyContactVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleQuickAction = (action) => {
    Vibration.vibrate(50); // Light vibration
    
    switch (action) {
      case 'emergency':
        Vibration.vibrate([0, 100, 50, 100]); // Heavy vibration pattern
        navigation.navigate('Emergency');
        break;
      case 'nearby':
        navigation.navigate('Nearby');
        break;
      case 'map':
        navigation.navigate('Map');
        break;
      default:
        Alert.alert('Feature', 'This feature is coming soon!');
    }
  };

  const ActionCard = ({ title, icon, color, onPress, description }) => (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.title}>Smart Tourist Safety</Text>
            <Text style={styles.subtitle}>Your safety companion for exploring</Text>
          </View>
          
          <View style={styles.statusBadge}>
            <Icon name="security" size={16} color={colors.success} />
            <Text style={styles.statusBadgeText}>Protected</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.quickActionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <ActionCard
              title="Emergency"
              icon="warning"
              color={colors.danger}
              description="Get help instantly"
              onPress={() => handleQuickAction('emergency')}
            />

            <ActionCard
              title="Live Map"
              icon="map"
              color={colors.primary}
              description="Real-time location"
              onPress={() => handleQuickAction('map')}
            />

            <ActionCard
              title="Nearby Places"
              icon="place"
              color={colors.success}
              description="Find safe spots"
              onPress={() => handleQuickAction('nearby')}
            />

            <ActionCard
              title="Safety Alerts"
              icon="notifications"
              color={colors.warning}
              description="Stay informed"
              onPress={() => handleQuickAction('alerts')}
            />
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.statusContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Current Status</Text>
          
          <View style={[globalStyles.card, styles.statusCard]}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              <Icon name="location-on" size={20} color={colors.success} />
              <Text style={styles.statusText}>Location tracking active</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              <Icon name="security" size={20} color={colors.success} />
              <Text style={styles.statusText}>Safe zone detected</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.info }]} />
              <Icon name="wifi" size={20} color={colors.info} />
              <Text style={styles.statusText}>Connected to network</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.tipsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          
          <View style={[globalStyles.card, styles.tipsCard]}>
            <View style={styles.tipItem}>
              <Icon name="lightbulb-outline" size={16} color={colors.accent} />
              <Text style={styles.tipText}>Share your location with trusted contacts</Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="lightbulb-outline" size={16} color={colors.accent} />
              <Text style={styles.tipText}>Keep emergency contacts updated</Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="lightbulb-outline" size={16} color={colors.accent} />
              <Text style={styles.tipText}>Stay aware of your surroundings</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusBadgeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    height: 140,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  actionDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statusCard: {
    padding: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  tipsContainer: {
    paddingHorizontal: 20,
  },
  tipsCard: {
    padding: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    flex: 1,
  },
});

export default HomeScreen;
