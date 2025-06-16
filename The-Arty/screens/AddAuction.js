import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform, Text } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddAuction = ({ navigation }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [auctionName, setAuctionName] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [snackbar, setSnackbar] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [sellerId, setSellerId] = useState(null);

  const showSnackbar = (message) => {
    setSnackbar(message);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const fetchSellerIdAndArtworks = async () => {
      try {
        const storedSellerId = await AsyncStorage.getItem("sellerId");
        if (storedSellerId) {
          setSellerId(storedSellerId);
          const res = await axios.get(
            `http://192.168.8.108:8080/api/artworks?sellerId=${storedSellerId}&status=AVAILABLE`
          );
          const formatted = res.data.map((a) => ({
            label: a.artworkName,
            value: a.id,
          }));
          setArtworks(formatted);
        } else {
          showSnackbar("Seller ID not found. Please log in again.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        showSnackbar("Error loading seller ID or artworks.");
      }
    };
    fetchSellerIdAndArtworks();
  }, []);

  const handleDateTimeChange = (event, selectedDate, type) => {
    setShowPicker(null); // Always close the picker first
    
    // Check if the user pressed "OK" (event.type === 'set') or cancelled (event.type === 'dismissed')
    if (event.type === 'set' && selectedDate) {
      if (type === 'start') {
        setStartDateTime(selectedDate);
        // Ensure end date is after start date
        if (selectedDate >= endDateTime) {
          const newEndDate = new Date(selectedDate);
          newEndDate.setHours(selectedDate.getHours() + 1);
          setEndDateTime(newEndDate);
        }
      } else {
        // Validate end date is after start date
        if (selectedDate <= startDateTime) {
          showSnackbar("End date must be after start date");
          return;
        }
        setEndDateTime(selectedDate);
      }
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddAuction = async () => {
    if (!auctionName || !minimumBid || selectedArtworks.length === 0) {
      showSnackbar("Please fill all fields and select artworks.");
      return;
    }

    if (isNaN(parseFloat(minimumBid))) {
      showSnackbar("Please enter a valid minimum bid amount.");
      return;
    }

    if (startDateTime >= endDateTime) {
      showSnackbar("End date must be after start date.");
      return;
    }

    try {
      await axios.post("http://192.168.8.108:8080/api/auctions", {
        auctionName,
        minimumBid: parseFloat(minimumBid),
        startDateTime,
        endDateTime,
        sellerId,
        artworkIds: selectedArtworks,
      });
      showSnackbar("Auction added successfully!");
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error("Failed to create auction:", error);
      showSnackbar("Failed to create auction. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Auction Name"
        value={auctionName}
        onChangeText={setAuctionName}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Minimum Bid"
        value={minimumBid}
        onChangeText={setMinimumBid}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        left={<TextInput.Affix text="$" />}
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
        dropDownContainerStyle={styles.dropdownContainer}
        listMode="SCROLLVIEW"
      />

      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Start Date & Time</Text>
        <Button 
          mode="outlined" 
          onPress={() => setShowPicker('start')}
          style={styles.dateButton}
          icon="calendar"
        >
          {formatDateTime(startDateTime)}
        </Button>
      </View>

      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>End Date & Time</Text>
        <Button 
          mode="outlined" 
          onPress={() => setShowPicker('end')}
          style={styles.dateButton}
          icon="calendar"
        >
          {formatDateTime(endDateTime)}
        </Button>
      </View>

      {showPicker && (
        <DateTimePicker
          value={showPicker === 'start' ? startDateTime : endDateTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => 
            handleDateTimeChange(event, selectedDate, showPicker)
          }
          minimumDate={showPicker === 'end' ? startDateTime : new Date()}
        />
      )}

      <Button
        mode="contained"
        onPress={handleAddAuction}
        style={styles.submitButton}
        labelStyle={styles.submitButtonLabel}
      >
        Create Auction
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
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
    backgroundColor: 'white',
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    backgroundColor: 'white',
  },
  dateTimeContainer: {
    marginBottom: 15,
  },
  dateButton: {
    borderColor: '#6200ee',
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: 30,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
  submitButtonLabel: {
    fontSize: 16,
  },
});

export default AddAuction;