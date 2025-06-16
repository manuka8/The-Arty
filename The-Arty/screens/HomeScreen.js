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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";

const CATEGORIES = [
  { id: "1", name: "Paintings", icon: "color-palette", color: "#FF6B6B" },
  { id: "2", name: "Photography", icon: "camera", color: "#4ECDC4" },
  { id: "3", name: "Digital Art", icon: "laptop", color: "#A8E6CF" },
  { id: "4", name: "Sculptures", icon: "cube", color: "#FFB347" },
  { id: "5", name: "Limited", icon: "star", color: "#D4A5FF" },
];

const TRENDING_ARTISTS = [
  {
    id: "1",
    name: "Maria Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    followers: "12.5K",
    artworks: 45,
    verified: true,
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    followers: "8.2K",
    artworks: 32,
    verified: false,
  },
  {
    id: "3",
    name: "Sophia Lee",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    followers: "15.1K",
    artworks: 67,
    verified: true,
  },
];

const HomeScreen = ({ navigation }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [likedItems, setLikedItems] = useState(new Set());
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      try {
        const response = await fetch('http://192.168.8.108:8080/api/artworks/home?auctionId=null');
        const data = await response.json();
        // Fetch images for each artwork
        const artworksWithImages = await Promise.all(data.map(async artwork => {
          if (artwork.images && artwork.images.length > 0) {
            const imageResponse = await fetch(`http://192.168.8.108:8080/api/artworks/${artwork.id}/images/${artwork.images[0].id}`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return { ...artwork, imageUrl };
          }
          return artwork;
        }));
        setArtworks(artworksWithImages);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    fetchArtworks();
  }, []);

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
        onPress={() => navigation.navigate("ArtDetail", { artwork: item })}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.artworkImage} />
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
          {item.sellingStatus === 'PENDING_AUCTION' && (
            <View style={styles.auctionBadge}>
              <Text style={styles.auctionBadgeText}>COMING SOON</Text>
            </View>
          )}
        </View>
        <View style={styles.artworkInfo}>
          <Text style={styles.artworkTitle} numberOfLines={1}>{item.artworkName}</Text>
          <Text style={styles.artworkArtist} numberOfLines={1}>by {item.artist}</Text>
          <View style={styles.artworkFooter}>
            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
            <View style={styles.likesContainer}>
              <Ionicons name="heart-outline" size={14} color="#999" />
              <Text style={styles.likesText}>{Math.floor(Math.random() * 100)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.categoryIconContainer,
          {
            backgroundColor: selectedCategory === item.id ? item.color : '#f8f9fa',
          }
        ]}
      >
        <Ionicons
          name={item.icon}
          size={24}
          color={selectedCategory === item.id ? "#fff" : "#6200ee"}
        />
      </View>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderArtistItem = ({ item }) => (
    <TouchableOpacity style={styles.artistCard} activeOpacity={0.9}>
      <Image source={{ uri: item.avatar }} style={styles.artistAvatar} />
      <View style={styles.artistInfo}>
        <View style={styles.artistHeader}>
          <Text style={styles.artistName}>{item.name}</Text>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={16} color="#4285F4" />
          )}
        </View>
        <Text style={styles.artistStats}>{item.followers} followers</Text>
        <Text style={styles.artistArtworks}>{item.artworks} artworks</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Filter artworks by selected category
  const filteredArtworks = artworks.filter(artwork => {
    if (selectedCategory === "1") return artwork.type === "Painting";
    if (selectedCategory === "2") return artwork.type === "Photography";
    if (selectedCategory === "3") return artwork.type === "Digital";
    if (selectedCategory === "4") return artwork.type === "Sculpture";
    return true;
  });

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
                placeholder="Search artworks, artists..."
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
              <Text style={styles.headerSubtitle}>Discover amazing art</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleSearch}
              >
                <Ionicons name="search-outline" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={24} color="#333" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
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

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Banner */}
        <TouchableOpacity style={styles.heroBanner} activeOpacity={0.9}>
          <Image
            source={require("../assets/hero-banner.jpg")}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Summer Art Collection</Text>
            <Text style={styles.heroSubtitle}>Exclusive pieces • Limited time</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Explore Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Artworks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Artworks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={styles.loadingText}>Loading artworks...</Text>
          ) : filteredArtworks.length > 0 ? (
            <FlatList
              data={filteredArtworks}
              renderItem={renderArtworkItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.artworksList}
            />
          ) : (
            <Text style={styles.noArtworksText}>No artworks found in this category</Text>
          )}
        </View>

        {/* Trending Artists */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Artists</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={TRENDING_ARTISTS}
            renderItem={renderArtistItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsList}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
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
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
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
  scrollView: {
    flex: 1,
  },
  heroBanner: {
    height: 200,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: "flex-start",
    backdropFilter: "blur(10px)",
  },
  heroButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#6200ee",
    fontSize: 16,
    fontWeight: "600",
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategory: {
    transform: [{ scale: 1.05 }],
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  artworksList: {
    paddingHorizontal: 20,
  },
  artworkCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  artworkImage: {
    width: "100%",
    height: 200,
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
    backdropFilter: "blur(10px)",
  },
  auctionBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  auctionBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  artworkInfo: {
    padding: 16,
  },
  artworkTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  artworkArtist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  artworkFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 20,
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
  artistsList: {
    paddingHorizontal: 20,
  },
  artistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    width: width * 0.8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  artistInfo: {
    flex: 1,
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 4,
  },
  artistStats: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  artistArtworks: {
    fontSize: 12,
    color: "#999",
    marginTop: 1,
  },
  followButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
  },
  noArtworksText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#666",
    fontStyle: "italic",
  },
});

export default HomeScreen;