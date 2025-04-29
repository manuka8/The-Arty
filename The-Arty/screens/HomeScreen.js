import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ARTWORK_DATA = [
  {
    id: '1',
    title: 'Abstract Harmony',
    artist: 'Maria Chen',
    price: '$1,200',
    isAuction: true,
    currentBid: '$850',
    image: require('../assets/art1.jpg'),
    timeLeft: '2d 4h',
  },
  {
    id: '2',
    title: 'Urban Dreams',
    artist: 'James Wilson',
    price: '$950',
    isAuction: false,
    image: require('../assets/art2.jpg'),
  },
  {
    id: '3',
    title: 'Oceanic Memories',
    artist: 'Sophia Lee',
    price: '$2,300',
    isAuction: true,
    currentBid: '$1,750',
    image: require('../assets/art3.jpg'),
    timeLeft: '1d 12h',
  },
  {
    id: '4',
    title: 'Desert Bloom',
    artist: 'Ahmed Khan',
    price: '$1,800',
    isAuction: false,
    image: require('../assets/art4.jpg'),
  },
];

const CATEGORIES = [
  { id: '1', name: 'Paintings', icon: 'color-palette' },
  { id: '2', name: 'Photography', icon: 'camera' },
  { id: '3', name: 'Digital Art', icon: 'laptop' },
  { id: '4', name: 'Sculptures', icon: 'cube' },
  { id: '5', name: 'Limited Editions', icon: 'star' },
];

const HomeScreen = ({ navigation }) => {
  const renderArtworkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.artworkCard}
      onPress={() => navigation.navigate('ArtDetail', { artwork: item })}
    >
      <Image source={item.image} style={styles.artworkImage} />
      <View style={styles.artworkInfo}>
        <Text style={styles.artworkTitle}>{item.title}</Text>
        <Text style={styles.artworkArtist}>by {item.artist}</Text>
        {item.isAuction ? (
          <View>
            <Text style={styles.auctionText}>Current Bid: {item.currentBid}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.timeText}>{item.timeLeft} left</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.priceText}>{item.price}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="#6200ee" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ArtiFy</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Banner */}
      <TouchableOpacity style={styles.heroBanner}>
        <Image
          source={require('../assets/hero-banner.jpg')}
          style={styles.heroImage}
        />
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Summer Art Auction</Text>
          <Text style={styles.heroSubtitle}>Bid on exclusive pieces</Text>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {/* Featured Artworks */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Artworks</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={ARTWORK_DATA}
        renderItem={renderArtworkItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artworksList}
      />

      {/* Live Auctions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Auctions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={ARTWORK_DATA.filter(item => item.isAuction)}
        renderItem={renderArtworkItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artworksList}
      />

      {/* Trending Artists */}
      <Text style={styles.sectionTitle}>Trending Artists</Text>
      {/* Add artist cards here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  heroBanner: {
    height: 180,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  seeAll: {
    color: '#6200ee',
    fontSize: 14,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIcon: {
    backgroundColor: '#f0e6ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  artworksList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  artworkCard: {
    width: width * 0.6,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  artworkImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  artworkInfo: {
    padding: 12,
  },
  artworkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artworkArtist: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  auctionText: {
    fontSize: 14,
    color: '#ff5722',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default HomeScreen;