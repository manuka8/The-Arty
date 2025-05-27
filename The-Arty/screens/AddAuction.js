import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Alert, 
  Platform, 
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const AddAuction = ({ navigation }) => {
  // Form state
  const [auctionName, setAuctionName] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  // Artwork selection
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [minBids, setMinBids] = useState({});
  
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);
  
  // User state
  const [sellerId, setSellerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch seller data and available artworks
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const id = await AsyncStorage.getItem('sellerId');
        if (id) {
          setSellerId(id);
          await fetchArtworks(id);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchArtworks = async (sellerId) => {
    try {
      const response = await fetch(
        `http://192.168.8.108:8080/api/artworks?sellerId=${sellerId}&status=AVAILABLE`
      );
      const data = await response.json();
      setArtworks(data);
      setDropdownItems(
        data.map(art => ({ 
          label: art.artworkName, 
          value: art.id,
          thumbnail: art.imageUrl 
        }))
      );
    } catch (error) {
      console.error('Fetch artworks error:', error);
      throw error;
    }
  };

  // Improved date picker handlers
  const handleStartDateChange = (event, selectedDate) => {
    // Always hide picker first on Android to prevent race conditions
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }

    // Handle dismissal case
    if (event.type === 'dismissed') {
      return;
    }

    // Update date if user made a selection
    const currentDate = selectedDate || startDateTime;
    setStartDateTime(currentDate);
    
    // Keep picker open on iOS
    if (Platform.OS === 'ios') {
      setShowStartPicker(true);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    const currentDate = selectedDate || endDateTime;
    setEndDateTime(currentDate);
    
    if (Platform.OS === 'ios') {
      setShowEndPicker(true);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Form submission
  const handleSubmit = async () => {
    if (!auctionName.trim()) {
      Alert.alert('Validation Error', 'Please enter an auction name');
      return;
    }

    if (selectedArtworks.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one artwork');
      return;
    }

    if (startDateTime >= endDateTime) {
      Alert.alert('Validation Error', 'End date must be after start date');
      return;
    }

    // Validate minimum bids
    const invalidBids = selectedArtworks.filter(artId => {
      const bid = parseFloat(minBids[artId]);
      return isNaN(bid) || bid <= 0;
    });

    if (invalidBids.length > 0) {
      Alert.alert(
        'Validation Error',
        'Please enter valid minimum bids (greater than 0) for all selected artworks'
      );
      return;
    }

    const artworkDetails = selectedArtworks.map(artId => ({
      artworkId: artId,
      minimumBid: parseFloat(minBids[artId])
    }));

    const payload = {
      auctionName,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      sellerId,
      artworks: artworkDetails
    };

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.8.108:8080/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server response was not OK');
      }

      Alert.alert(
        'Success', 
        'Auction created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
      // Reset form
      setAuctionName('');
      setSelectedArtworks([]);
      setMinBids({});
      setStartDateTime(new Date());
      setEndDateTime(new Date());
    } catch (error) {
      console.error('Create auction error:', error);
      Alert.alert('Error', 'Failed to create auction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Auction</Text>
      
      {/* Auction Name */}
      <Text style={styles.label}>Auction Name*</Text>
      <TextInput
        value={auctionName}
        onChangeText={setAuctionName}
        placeholder="Enter auction name"
        style={styles.input}
        maxLength={100}
      />

      {/* Date Pickers */}
      <View style={styles.datePickerContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.label}>Start Date & Time*</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => {
              setShowStartPicker(true);
              setShowEndPicker(false);
            }}
          >
            <Text style={styles.dateButtonText}>{formatDate(startDateTime)}</Text>
          </TouchableOpacity>
          {(showStartPicker || Platform.OS === 'ios') && (
            <DateTimePicker
              key="start-picker"
              value={startDateTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.datePicker}>
          <Text style={styles.label}>End Date & Time*</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => {
              setShowEndPicker(true);
              setShowStartPicker(false);
            }}
          >
            <Text style={styles.dateButtonText}>{formatDate(endDateTime)}</Text>
          </TouchableOpacity>
          {(showEndPicker || Platform.OS === 'ios') && (
            <DateTimePicker
              key="end-picker"
              value={endDateTime}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              minimumDate={startDateTime}
            />
          )}
        </View>
      </View>

      {/* Artwork Selection */}
      <Text style={styles.label}>Select Artworks*</Text>
      <DropDownPicker
        open={dropdownOpen}
        setOpen={setDropdownOpen}
        items={dropdownItems}
        setItems={setDropdownItems}
        value={selectedArtworks}
        setValue={setSelectedArtworks}
        multiple={true}
        mode="BADGE"
        placeholder="Select artworks"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemContainerStyle={styles.listItem}
        activityIndicatorColor="#3498db"
        loading={isLoading}
      />

      {/* Minimum Bids */}
      {selectedArtworks.map((artId) => {
        const artwork = artworks.find(a => a.id === artId);
        return (
          <View key={artId} style={styles.artworkContainer}>
            <Text style={styles.artworkName}>{artwork?.artworkName || `Artwork ${artId}`}</Text>
            <TextInput
              placeholder="Minimum bid amount"
              keyboardType="decimal-pad"
              value={minBids[artId]?.toString() || ''}
              onChangeText={(text) => setMinBids({ ...minBids, [artId]: text.replace(/[^0-9.]/g, '')})}
              style={styles.input}
            />
          </View>
        );
      })}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Auction</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePicker: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    marginBottom: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
  },
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  artworkContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  artworkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#a0c4e0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddAuction;