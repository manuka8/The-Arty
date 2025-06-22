import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  StatusBar,
  Animated,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [likedItems, setLikedItems] = useState(new Set());
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

  // Artwork types for filtering
  const artworkTypes = [
    "All",
    "Painting",
    "Photography",
    "Digital",
    "Sculpture",
    "Pastel Artworks",
    "Watercolor",
    "Oil Painting",
    "Acrylic"
  ];

  useEffect(() => {
    fetchProfile();
    fetchArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [searchQuery, selectedType, artworks]);

  const fetchProfile = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      try {
        const res = await fetch(
          `http://192.168.8.108:8080/api/users/${userId}`
        );
        const data = await res.json();
        setProfilePic(data.profile_pic || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };
  
  const fetchArtworks = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://192.168.8.108:8080/api/artworks/all');
      const data = await response.json();
      
      // Filter only available artworks
      const availableArtworks = data.filter(artwork => 
        artwork.sellingStatus === "AVAILABLE"
      );
      
      setArtworks(availableArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterArtworks = () => {
    let results = artworks;
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(artwork =>
        artwork.artworkName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected type
    if (selectedType !== "All") {
      results = results.filter(artwork => 
        artwork.type === selectedType
      );
    }
    
    setFilteredArtworks(results);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.timing(searchAnimation, {
      toValue: showSearch ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleLike = (itemId) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId);
    } else {
      newLikedItems.add(itemId);
    }
    setLikedItems(newLikedItems);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const renderArtworkItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.artworkCard,
        {
          transform: [{
            scale: scrollY.interpolate({
              inputRange: [-1, 0, index * 200, (index + 1) * 200],
              outputRange: [1, 1, 1, 0.95],
              extrapolate: 'clamp',
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductScreen", { productId: item.id })}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <Image source={{ uri: item.imageUrls[0] }} style={styles.artworkImage} />
          ) : (
            <View style={[styles.artworkImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={40} color="#999" />
            </View>
          )}
          <View style={styles.imageOverlay} />
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={likedItems.has(item.id) ? "heart" : "heart-outline"}
              size={20}
              color={likedItems.has(item.id) ? "#FF6B6B" : "#fff"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.artworkInfo}>
          <Text style={styles.artworkTitle} numberOfLines={1}>{item.artworkName}</Text>
          <Text style={styles.artworkType} numberOfLines={1}>{item.type}</Text>
          <View style={styles.artworkFooter}>
            <Text style={styles.priceText}>${item.price?.toFixed(2) || "N/A"}</Text>
            <View style={styles.likesContainer}>
              <Ionicons name="heart-outline" size={14} color="#999" />
              <Text style={styles.likesText}>{Math.floor(Math.random() * 100)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilterModal}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Type</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={artworkTypes}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.filterItem,
                  selectedType === item && styles.selectedFilterItem
                ]}
                onPress={() => {
                  setSelectedType(item);
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterItemText,
                  selectedType === item && styles.selectedFilterItemText
                ]}>
                  {item}
                </Text>
                {selectedType === item && (
                  <Ionicons name="checkmark" size={20} color="#6200ee" />
                )}
              </Pressable>
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterList}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        {showSearch ? (
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: searchAnimation,
                transform: [{
                  translateY: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search artworks..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity
              style={styles.searchCloseButton}
              onPress={toggleSearch}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>ArtiFy</Text>
              <Text style={styles.headerSubtitle}>Available Artworks</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleSearch}
              >
                <Ionicons name="search-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Ionicons name="filter" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={async () => {
                  try {
                    const userId = await AsyncStorage.getItem("userId");
                    if (userId) {
                      navigation.navigate("Profile");
                    } else {
                      navigation.navigate("Register");
                    }
                  } catch (error) {
                    console.error("Error accessing local storage:", error);
                    navigation.navigate("Register");
                  }
                }}
              >
                {profilePic ? (
                  <Image
                    source={{ uri: profilePic }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.defaultProfileButton}>
                    <AntDesign name="user" size={20} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>

      {renderFilterModal()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <Animated.FlatList
          data={filteredArtworks}
          renderItem={renderArtworkItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.artworkGrid}
          contentContainerStyle={styles.artworkListContent}
          onRefresh={fetchArtworks}
          refreshing={refreshing}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="image-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No artworks found</Text>
              {searchQuery && (
                <Text style={styles.emptySubtext}>
                  No results for "{searchQuery}"
                </Text>
              )}
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={fetchArtworks}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
          ListHeaderComponent={
            selectedType !== "All" && (
              <View style={styles.filterIndicator}>
                <Text style={styles.filterIndicatorText}>
                  Filtering by: {selectedType}
                </Text>
                <TouchableOpacity onPress={() => setSelectedType("All")}>
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  profileButton: {
    marginLeft: 12,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#6200ee",
  },
  defaultProfileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  searchCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  artworkGrid: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  artworkCard: {
    width: width * 0.45,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
  },
  artworkImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  placeholderImage: {
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  likeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  artworkInfo: {
    padding: 12,
  },
  artworkTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  artworkType: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  artworkFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  refreshButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#6200ee",
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterList: {
    paddingBottom: 20,
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedFilterItem: {
    backgroundColor: "#f5f5f5",
  },
  filterItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedFilterItemText: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  filterIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterIndicatorText: {
    fontSize: 14,
    color: "#666",
  },
  clearFilterText: {
    fontSize: 14,
    color: "#6200ee",
    fontWeight: "600",
  },
});

export default HomeScreen;