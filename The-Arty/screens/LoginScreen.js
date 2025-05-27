import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Username or email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post('http://192.168.8.108:8080/api/auth/login', {
        identifier,
        password,
      });
      const { userId, message } = response.data;
      console.log({userId});
      console.log({ identifier,password });
      await AsyncStorage.setItem("userId", String(userId));
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have successfully logged in',
        position: 'top',
      });

      setTimeout(() => {
        navigation.navigate("Home");
      }, 1000);
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid credentials";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid request";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome to Artify</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Identifier Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username or Email</Text>
            <View style={[styles.inputContainer, errors.identifier && styles.inputError]}>
              <TextInput
                placeholder="Enter your username"
                value={identifier}
                onChangeText={setIdentifier}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="default"
                placeholderTextColor="#999"
              />
              <Ionicons name="person" size={20} color="#666" style={styles.icon} />
            </View>
            {errors.identifier && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#e74c3c" />
                <Text style={styles.error}>{errors.identifier}</Text>
              </View>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
                style={styles.icon}
              >
                <Ionicons
                  name={secureTextEntry ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#e74c3c" />
                <Text style={styles.error}>{errors.password}</Text>
              </View>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Toast Component */}
        <Toast />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#9ea1ff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2d3436',
  },
  icon: {
    padding: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  error: {
    color: '#e74c3c',
    fontSize: 12,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#7f8c8d',
    marginRight: 5,
  },
  footerLink: {
    color: '#e74c3c',
    fontWeight: '600',
  },
});

export default LoginScreen;
