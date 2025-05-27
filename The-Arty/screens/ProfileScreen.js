import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnText,setbtnText]=useState('');
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [userId,setUserId]=useState();
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      console.log(userId);
      setUserId(userId);
      if (!userId) {
        setError("User not found");
        return;
      }
      const res = await axios.get(
        `http://192.168.8.108:8080/api/users/${userId}`
      );
      setUser(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load profile. Please try again.");
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();

      const backAction = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );
  const handleSellerAccess = async () => {
    try {
      console.log(userId);
      const response = await axios.get(
        `http://192.168.8.108:8080/api/sellers/byUser/${userId}`
      );
      const seller = response.data;
      if (seller && seller.sellerId) {
        await AsyncStorage.setItem("sellerId", seller.sellerId.toString());
        navigation.navigate("ArtistDashboard");
      } else {
        navigation.navigate("SellerRegister");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigation.navigate("SellerRegister");
      } else {
        Alert.alert("Error", "Failed to check seller status.");
      }
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(user.email);
      const response = await axios.post(
        `http://192.168.8.108:8080/api/users/send-code?email=${user.email}`
      );
      console.log(user.email);
      if (!isClicked) {
        setIsClicked(true);
        console.log("Email verification triggered");
      }
      navigation.navigate("VerifyEmail", { email: user.email });
    } catch (error) {
      console.error("Error sending verification code:", error);
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: handleSignOut,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#8B5FBF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>

        <View style={styles.errorContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#5D3FD3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerRight} />
        </View>

        {!user.verify && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>Your email is not verified.</Text>
            <TouchableOpacity>
              <Text
                style={[styles.verifyLink, isClicked && styles.disabledLink]}
                onPress={handleVerifyEmail}
              >
                {isClicked ? "Verification Sent" : "Click here to verify"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.profileHeader}>
          <Image
            source={
              user.profile_pic
                ? { uri: user.profile_pic }
                : require("../assets/default_profile.png")
            }
            style={styles.profilePic}
          />
          <Text style={styles.username}>{user.username}</Text>
          {user.role === "seller" && (
            <View style={styles.sellerBadge}>
              <Icon name="verified" size={16} color="#5D3FD3" />
              <Text style={styles.sellerBadgeText}>Verified Seller</Text>
            </View>
          )}
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="email" size={20} color="#5D3FD3" />
              <Text style={styles.infoLabel}>Email:</Text>
            </View>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="person" size={20} color="#5D3FD3" />
              <Text style={styles.infoLabel}>First Name:</Text>
            </View>
            <Text style={styles.infoValue}>
              {user.firstName || "Not provided"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="people" size={20} color="#5D3FD3" />
              <Text style={styles.infoLabel}>Last Name:</Text>
            </View>
            <Text style={styles.infoValue}>
              {user.lastName || "Not provided"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("EditProfile", { user })}
          >
            <Icon
              name="edit"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.passwordButton]}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Icon
              name="lock"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sellerButton]}
            onPress={handleSellerAccess}
          >
            <Icon
              name="store"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Switch as a Seller</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={confirmSignOut}
          >
            <Icon
              name="logout"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F5FF",
    paddingBottom: 50,
    paddingTop: 30,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5D3FD3",
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    width: 32,
  },
  warningContainer: {
    backgroundColor: "#FFF3E0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#FFA726",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  warningText: {
    color: "#E65100",
    fontSize: 16,
  },
  verifyLink: {
    color: "#5D3FD3",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledLink: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#5D3FD3",
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sellerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDE7F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  sellerBadgeText: {
    color: "#5D3FD3",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  profileInfo: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#5D3FD3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E5F5",
  },
  infoIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#5D3FD3",
    fontSize: 12,
    marginLeft: 8,
  },
  infoValue: {
    color: "#333",
    fontSize: 13,
    fontWeight: "500",
    maxWidth: 260,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: "#7E57C2",
  },
  passwordButton: {
    backgroundColor: "#5D3FD3",
  },
  sellerButton: {
    backgroundColor: "#9C27B0",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 5,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#5D3FD3",
    padding: 12,
    borderRadius: 25,
    width: 120,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    columnGap: 15,
  },
  registerButton: {
    padding: 12,
    borderRadius: 25,
    width: 120,
    backgroundColor: "#4CAF50",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileScreen;
