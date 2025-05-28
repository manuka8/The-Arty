import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Text } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddAuction = ({ route, navigation }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [auctionName, setAuctionName] = useState('');
  const [minimumBid, setMinimumBid] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [sellerId, setSellerId] = useState(null);
  useEffect(() => {
    const sellerId = await AsyncStorage.getItem('sellerId');
    setSellerId(sellerId);
    axios.get(`http://YOUR_BACKEND_URL/artworks?sellerId=${sellerId}&status=AVAILABLE`)
      .then(res => {
        const formatted = res.data.map(a => ({
          label: a.artworkName,
          value: a.id
        }));
        setArtworks(formatted);
      })
      .catch(() => setSnackbar('Failed to load artworks.'));
  }, [sellerId]);

  const handleAddAuction = () => {
    if (!auctionName || !minimumBid || selectedArtworks.length === 0) {
      setSnackbar('Please fill all fields and select artworks.');
      return;
    }

    axios.post('http://YOUR_BACKEND_URL/auctions', {
      auctionName,
      minimumBid: parseFloat(minimumBid),
      startDateTime,
      endDateTime,
      sellerId,
      artworkIds: selectedArtworks,
    }).then(() => {
      setSnackbar('Auction added successfully!');
      navigation.goBack();
    }).catch(() => setSnackbar('Failed to create auction.'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Auction Name"
        value={auctionName}
        onChangeText={setAuctionName}
        style={styles.input}
      />
      <TextInput
        label="Minimum Bid"
        value={minimumBid}
        onChangeText={setMinimumBid}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Select Artworks</Text>
      <DropDownPicker
        open={openDropdown}
        value={selectedArtworks}
        items={artworks}
        setOpen={setOpenDropdown}
        setValue={setSelectedArtworks}
        multiple={true}
        mode="BADGE"
        placeholder="Select artworks"
        style={styles.dropdown}
      />

      <Text style={styles.label}>Start Date & Time</Text>
      <Button mode="outlined" onPress={() => setShowStartPicker(true)}>
        {startDateTime.toLocaleString()}
      </Button>
      {showStartPicker && (
        <DateTimePicker
          value={startDateTime}
          mode="datetime"
          display="default"
          onChange={(e, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDateTime(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>End Date & Time</Text>
      <Button mode="outlined" onPress={() => setShowEndPicker(true)}>
        {endDateTime.toLocaleString()}
      </Button>
      {showEndPicker && (
        <DateTimePicker
          value={endDateTime}
          mode="datetime"
          display="default"
          onChange={(e, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDateTime(selectedDate);
          }}
        />
      )}

      <Button mode="contained" onPress={handleAddAuction} style={styles.submitButton}>
        Create Auction
      </Button>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={3000}
      >
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 30,
  }
});

export default AddAuction;
