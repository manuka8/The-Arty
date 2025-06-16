import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const ArtistDashboard = () => {
  const [sellerData, setSellerData] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const [topArtworks, setTopArtworks] = useState([]);
  const [monthlySales, setMonthlySales] = useState(0);
  const [salesChart, setSalesChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const navigation = useNavigation();
  const flickerAnim = new Animated.Value(0);

  // Flicker animation for ongoing indicators
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      const sellerId = await AsyncStorage.getItem('sellerId');
      const userId = await AsyncStorage.getItem('userId');

      if (!sellerId) {
        Alert.alert("Error", "Seller ID not found");
        return;
      }

      // Get seller data
      const { data: seller } = await axios.get(`http://192.168.8.108:8080/api/sellers/${sellerId}`);
      setSellerData(seller);

      // Mock data for demonstration - replace with actual API calls
      setMonthlyIncome(1250);
      setYearlyIncome(15600);
      setTopArtworks([
        { id: 1, title: 'Sunset Dreams', price: 450 },
        { id: 2, title: 'Mountain Echo', price: 380 },
        { id: 3, title: 'Ocean Whisper', price: 420 }
      ]);
      setMonthlySales(8);
      setSalesChart([
        { month: 'Jan', sales: 1200 },
        { month: 'Feb', sales: 1900 },
        { month: 'Mar', sales: 1500 },
        { month: 'Apr', sales: 1800 },
        { month: 'May', sales: 2100 },
        { month: 'Jun', sales: 1950 },
      ]);

      // Mock ongoing auctions data
      setOngoingAuctions([
        {
          id: 1,
          type: 'single',
          artworkName: 'Golden Sunset',
          minBid: 500,
          currentBid: 750,
          endTime: '2023-12-15T18:00:00',
        },
        {
          id: 2,
          type: 'multiple',
          auctionName: 'Winter Collection',
          minBid: 1000,
          currentBid: 1250,
          endTime: '2023-12-20T15:30:00',
        },
      ]);

      // Mock ongoing events data
      setOngoingEvents([
        {
          id: 1,
          eventName: 'Charity Art Gala',
          highestBidItem: 'The Giving Tree',
          sellerName: 'Jane Doe',
          currentBid: 2500,
          endTime: '2023-12-18T20:00:00',
        },
        {
          id: 2,
          eventName: 'Modern Art Exhibition',
          highestBidItem: 'Abstract Thoughts',
          sellerName: 'John Smith',
          currentBid: 1800,
          endTime: '2023-12-22T17:00:00',
        },
      ]);

    } catch (error) {
      console.error("Dashboard Error:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderHeader = () => {
    if (!sellerData) return null;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {sellerData.type === 'single' ? 'Artist Dashboard' : 'Organization Dashboard'}
        </Text>
        {!sellerData.verified && (
          <View style={styles.warningContainer}>
            <Text style={styles.warning}>⚠️ Your business is not verified.</Text>
          </View>
        )}
      </View>
    );
  };

  const renderOngoingIndicator = () => {
    return (
      <Animated.View style={{ opacity: flickerAnim }}>
        <Icon name="circle" size={12} color="#e74c3c" style={styles.ongoingIcon} />
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderHeader()}

      <Text style={styles.sectionTitle}>
        {sellerData?.type === 'single' ? `Artist: ${sellerData.businessName}` : `Business: ${sellerData.businessName}`}
      </Text>

      {/* Income Section */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Income Summary</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Income:</Text>
          <Text style={styles.infoValue}>${sellerData?.totalIncome?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Monthly Income:</Text>
          <Text style={styles.infoValue}>${monthlyIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Yearly Income:</Text>
          <Text style={styles.infoValue}>${yearlyIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pending Income:</Text>
          <Text style={styles.infoValue}>${sellerData?.pendingwithdrawal?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Withdrawal:</Text>
          <Text style={styles.infoValue}>${sellerData?.totalwithdrawal?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* Ongoing Auctions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.subTitle}>Ongoing Auctions</Text>
          {renderOngoingIndicator()}
        </View>
        {ongoingAuctions.length > 0 ? (
          ongoingAuctions.map((auction) => (
            <View key={auction.id} style={styles.auctionItem}>
              <View style={styles.auctionHeader}>
                <Text style={styles.auctionName}>
                  {auction.type === 'single' ? auction.artworkName : auction.auctionName}
                </Text>
                <Text style={styles.auctionTime}>Ends: {formatDate(auction.endTime)}</Text>
              </View>
              <View style={styles.auctionDetails}>
                <View style={styles.bidInfo}>
                  <Text style={styles.bidLabel}>Min Bid:</Text>
                  <Text style={styles.bidValue}>${auction.minBid.toFixed(2)}</Text>
                </View>
                <View style={styles.bidInfo}>
                  <Text style={styles.bidLabel}>Current Bid:</Text>
                  <Text style={[styles.bidValue, styles.currentBid]}>${auction.currentBid.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No ongoing auctions.</Text>
        )}
        <TouchableOpacity 
          style={styles.moreLink} 
          onPress={() => navigation.navigate('Auctions')}
        >
          <Text style={styles.linkText}>View all auctions →</Text>
        </TouchableOpacity>
      </View>

      {/* Ongoing Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.subTitle}>Ongoing Events</Text>
          {renderOngoingIndicator()}
        </View>
        {ongoingEvents.length > 0 ? (
          ongoingEvents.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{event.eventName}</Text>
                <Text style={styles.eventTime}>Ends: {formatDate(event.endTime)}</Text>
              </View>
              <View style={styles.eventDetails}>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventLabel}>Highest Bid Item:</Text>
                  <Text style={styles.eventValue}>{event.highestBidItem}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventLabel}>Seller:</Text>
                  <Text style={styles.eventValue}>{event.sellerName}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventLabel}>Current Bid:</Text>
                  <Text style={[styles.eventValue, styles.currentBid]}>${event.currentBid.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No ongoing events.</Text>
        )}
        <TouchableOpacity 
          style={styles.moreLink} 
          onPress={() => navigation.navigate('Events')}
        >
          <Text style={styles.linkText}>View all events →</Text>
        </TouchableOpacity>
      </View>

      {/* Top Art Work Section */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Top Artworks</Text>
        {topArtworks.length > 0 ? (
          topArtworks.map((art) => (
            <View key={art.id} style={styles.artworkItem}>
              <Text style={styles.artworkTitle}>🎨 {art.title || 'Untitled'}</Text>
              <Text style={styles.artworkPrice}>${art.price?.toFixed(2) || '0.00'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No artworks found.</Text>
        )}
        <TouchableOpacity 
          style={styles.moreLink} 
          onPress={() => navigation.navigate('TopArtworks')}
        >
          <Text style={styles.linkText}>View all artworks →</Text>
        </TouchableOpacity>
      </View>

      {/* Sales Section */}
      <View style={styles.section}>
        <Text style={styles.subTitle}>Sales Analytics</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Monthly Sales:</Text>
          <Text style={styles.infoValue}>{monthlySales}</Text>
        </View>
        {salesChart.length > 0 ? (
          <LineChart
            data={{
              labels: salesChart.map((item) => item.month),
              datasets: [{ 
                data: salesChart.map((item) => item.sales),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2
              }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16,
              paddingRight: 20
            }}
          />
        ) : (
          <Text style={styles.noDataText}>No sales data available.</Text>
        )}
        <TouchableOpacity 
          style={styles.moreLink} 
          onPress={() => navigation.navigate('SalesDetails')}
        >
          <Text style={styles.linkText}>View sales details →</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddArtwork')}
        >
          <Text style={styles.buttonText}>Sell Products</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddAuction')}
        >
          <Text style={styles.buttonText}>Add new auction</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditBusinessProfile')}
        >
          <Text style={styles.buttonText}>Edit Business Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('HomeSreen')}
        >
          <Text style={styles.buttonText}>Go to User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('OrganizeEvent')}
        >
          <Text style={styles.buttonText}>Organize an Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  warning: {
    color: '#856404',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingBottom: 8,
    marginRight: 10,
  },
  ongoingIcon: {
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  auctionItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  auctionHeader: {
    marginBottom: 8,
  },
  auctionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  auctionTime: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 3,
  },
  auctionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 5,
  },
  bidValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  currentBid: {
    color: '#27ae60',
    fontWeight: '600',
  },
  eventItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  eventTime: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 3,
  },
  eventDetails: {
    marginTop: 5,
  },
  eventInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  eventLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 5,
    width: 120,
  },
  eventValue: {
    fontSize: 14,
    color: '#2c3e50',
    flexShrink: 1,
  },
  artworkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  artworkTitle: {
    fontSize: 16,
    color: '#2c3e50',
  },
  artworkPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  noDataText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingVertical: 15,
  },
  moreLink: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  linkText: {
    color: '#3498db',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArtistDashboard;