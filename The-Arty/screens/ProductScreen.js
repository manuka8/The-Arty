import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  SafeAreaView,
  Animated,
  Platform
} from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.9;

const ProductScreen = ({ navigation }) => {
  const route = useRoute();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    axios.get(`http://192.168.8.108:8080/api/artworks/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#6200ee" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image carousel with indicator */}
        <View style={styles.imageContainer}>
        <Animated.ScrollView
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
>
  {product.images.map((img, index) => (
    <Image
      key={index}
      source={{ uri: img }}
      style={styles.image}
      resizeMode="contain"
    />
  ))}
</Animated.ScrollView>


          <View style={styles.imageIndicatorContainer}>
            {product.images.map((_, index) => {
              const opacity = scrollX.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={index}
                  style={[styles.imageIndicator, { opacity }]}
                />
              );
            })}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${product.price.toLocaleString()}</Text>
          </View>

          <Text style={styles.title}>{product.artworkName}</Text>
          <View style={styles.artistContainer}>
            <Text style={styles.artist}>By {product.artist}</Text>
            {product.seller?.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#4285F4" style={styles.verifiedIcon} />
            )}
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.8 (126 reviews)</Text>
          </View>

          <View style={styles.statusContainer}>
            {product.availablecopies > 0 ? (
              <Text style={styles.inStock}>In Stock ({product.availablecopies} available)</Text>
            ) : (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
            <Text style={styles.shippingText}>Free shipping</Text>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{product.type} - {product.subType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dimensions:</Text>
              <Text style={styles.detailValue}>
                {product.widthOfArt} x {product.heightOfArt} {product.unit}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Added:</Text>
              <Text style={styles.detailValue}>{new Date(product.addedDate).toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Seller Section */}
          {product.seller && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seller Information</Text>
              <View style={styles.sellerContainer}>
                <Image 
                  source={{ uri: product.seller.avatar || 'https://placeholder.com/avatar' }} 
                  style={styles.sellerAvatar} 
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{product.seller.sellerName}</Text>
                  <Text style={styles.sellerRating}>98% Positive Feedback</Text>
                </View>
                <TouchableOpacity style={styles.viewShopButton}>
                  <Text style={styles.viewShopText}>View Shop</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Footer with Action Buttons */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.footerGradient}
        pointerEvents="none"
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#6200ee" />
          <Text style={styles.footerButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f8f9fa',
  },
  imageIndicatorContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  imageIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#6200ee',
    marginHorizontal: 4,
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  priceBadge: {
    backgroundColor: '#6200ee',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  priceBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  artist: {
    fontSize: 16,
    color: '#666',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inStock: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  outOfStock: {
    color: '#F44336',
    fontWeight: '500',
  },
  shippingText: {
    color: '#6200ee',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sellerRating: {
    fontSize: 14,
    color: '#666',
  },
  viewShopButton: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewShopText: {
    color: '#6200ee',
    fontSize: 14,
    fontWeight: '500',
  },
  footerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  footerButtonText: {
    fontSize: 12,
    color: '#6200ee',
    marginTop: 4,
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cartButtonText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductScreen;