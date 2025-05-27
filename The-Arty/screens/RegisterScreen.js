import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";


const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(form.email))
      newErrors.email = "Please enter a valid email";
    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Must be 8+ chars with uppercase, lowercase, number & special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const BASE_URL = "http://192.168.8.108:8080"; // Update as needed
      const response = await axios.post(`${BASE_URL}/api/auth/register`, form);

      const { message, userId } = response.data;
      console.log({userId});
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: message,
        position: "top",
      });

      // Navigate or reset form if needed
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);

    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      let fieldErrors = {};

      if (error.response && error.response.data?.error) {
        const responseText = error.response.data.error;

        if (responseText.includes("Email is already in use")) {
          fieldErrors.email = "Email is already registered";
          errorMessage = "Email already in use";
        } else if (responseText.includes("Username is already taken")) {
          fieldErrors.username = "Username is not available";
          errorMessage = "Username already taken";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: errorMessage,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Artify Account</Text>
        <Text style={styles.subtitle}>Join our community of art lovers</Text>
      </View>

      <View style={styles.formContainer}>
        {Object.keys(form).map((field) => (
          <View key={field} style={styles.inputWrapper}>
            <Text style={styles.label}>
              {field === "firstName"
                ? "First Name"
                : field === "lastName"
                ? "Last Name"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            <View
              style={[
                styles.inputContainer,
                errors[field] && styles.inputContainerError,
              ]}
            >
              <TextInput
                placeholder={`Enter your ${field
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}`}
                secureTextEntry={field === "password" && secureTextEntry}
                autoCapitalize={
                  field === "firstName" || field === "lastName"
                    ? "words"
                    : "none"
                }
                keyboardType={field === "email" ? "email-address" : "default"}
                style={styles.input}
                onChangeText={(value) => setForm({ ...form, [field]: value })}
                placeholderTextColor="#999"
              />
              {field === "password" && (
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Ionicons
                    name={secureTextEntry ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              )}
            </View>
            {errors[field] && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color="#e74c3c" />
                <Text style={styles.error}>{errors[field]}</Text>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eac9ff",
    paddingHorizontal: 25,
    justifyContent: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#FFFFF0",
    borderRadius: 12,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  inputContainerError: {
    borderColor: "#e74c3c",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#2d3436",
  },
  eyeIcon: {
    padding: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  error: {
    color: "#e74c3c",
    fontSize: 12,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: "#6200ee",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#7f8c8d",
    marginRight: 5,
  },
  loginLink: {
    color: "#e74c3c",
    fontWeight: "600",
  },
});

export default RegisterScreen;
