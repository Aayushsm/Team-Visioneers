import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, globalStyles } from '../utils/styles';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
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
      ]),
    ]).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleAuth = async () => {
    Vibration.vibrate(50); // Light vibration
    
    // Validation
    if (!email || !password) {
      Vibration.vibrate([0, 100, 50, 100]); // Error vibration pattern
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      Vibration.vibrate([0, 100, 50, 100]); // Error vibration pattern
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isLogin && (!name || !phone || !emergencyContact)) {
      Vibration.vibrate([0, 100, 50, 100]); // Error vibration pattern
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && !validatePhone(phone)) {
      Vibration.vibrate([0, 100, 50, 100]); // Error vibration pattern
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!isLogin && !validatePhone(emergencyContact)) {
      Vibration.vibrate([0, 100, 50, 100]); // Error vibration pattern
      Alert.alert('Error', 'Please enter a valid emergency contact number');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isLogin) {
      console.log('Logging in with:', { email, password });
      Vibration.vibrate(200); // Success vibration
      setIsLoading(false);
      navigation.navigate('Main');
    } else {
      console.log('Registering with:', { name, email, phone, password, emergencyContact });
      Vibration.vibrate(200); // Success vibration
      setIsLoading(false);
      Alert.alert(
        'Registration Successful! 🎉',
        'Your Digital ID has been created on the blockchain.',
        [{ text: 'Get Started', onPress: () => navigation.navigate('Main') }]
      );
    }
  };

  const toggleAuthMode = () => {
    Vibration.vibrate(50); // Light vibration
    setIsLogin(!isLogin);
    // Clear form data when switching
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setEmergencyContact('');
    setFocusedInput(null);
  };

  const handleGuestAccess = () => {
    // Navigate to main app as guest user
    navigation.navigate('Main');
  };

  const renderInput = (placeholder, value, onChangeText, keyboardType = 'default', isPassword = false, icon) => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, focusedInput === placeholder && styles.inputFocused]}>
        <Icon name={icon} size={20} color={focusedInput === placeholder ? colors.primary : colors.text.light} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.light}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          onFocus={() => setFocusedInput(placeholder)}
          onBlur={() => setFocusedInput(null)}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon 
              name={showPassword ? 'visibility-off' : 'visibility'} 
              size={20} 
              color={colors.text.light} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.container]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: logoScale }
                ]
              }
            ]}
          >
            <View style={styles.logoBackground}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🛡️</Text>
              </View>
            </View>
            <Text style={styles.title}>Smart Tourist Safety</Text>
            <Text style={styles.tagline}>Your trusted travel companion</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.headerText}>
              {isLogin ? 'Welcome Back! 👋' : 'Join Our Community 🌟'}
            </Text>
            
            <Text style={styles.subHeaderText}>
              {isLogin 
                ? 'Sign in to continue your safe journey' 
                : 'Create your secure digital identity'}
            </Text>
            
            {!isLogin && renderInput('Full Name', name, setName, 'default', false, 'person')}
            
            {renderInput('Email Address', email, setEmail, 'email-address', false, 'email')}
            
            {!isLogin && renderInput('Phone Number', phone, setPhone, 'phone-pad', false, 'phone')}
            
            {renderInput('Password', password, setPassword, 'default', true, 'lock')}
            
            {!isLogin && renderInput('Emergency Contact', emergencyContact, setEmergencyContact, 'phone-pad', false, 'emergency')}
            
            <AnimatedTouchableOpacity
              style={[styles.primaryButton, { transform: [{ scale: buttonScale }] }]}
              onPress={handleAuth}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Icon 
                  name={isLogin ? "login" : "person-add"} 
                  size={20} 
                  color={colors.background.primary} 
                  style={styles.buttonIcon}
                />
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.text.white} />
                    <Text style={[globalStyles.buttonText, styles.loadingText]}>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={globalStyles.buttonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </View>
            </AnimatedTouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleAuthMode}
            >
              <View style={styles.buttonContent}>
                <Icon 
                  name={isLogin ? "person-add" : "login"} 
                  size={18} 
                  color={colors.primary} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestAccess}
            >
              <View style={styles.buttonContent}>
                <Icon 
                  name="visibility" 
                  size={18} 
                  color={colors.text.light} 
                  style={styles.buttonIcon}
                />
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
              </View>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    color: colors.text.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  subHeaderText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputFocused: {
    borderColor: colors.primary,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 18,
    backgroundColor: colors.primary,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 12,
  },
  switchContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  switchTextBold: {
    fontWeight: '600',
    color: colors.primary,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default AuthScreen;