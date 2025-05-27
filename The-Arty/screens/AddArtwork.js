import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform, 
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddArtwork = ({ navigation }) => {
  // Artwork types for dropdown
  const artworkTypes = [
    'Oil Paintings',
    'Acrylic Paintings',
    'Watercolor Paintings',
    'Charcoal Drawings',
    'Pencil Sketches',
    'Ink Drawings',
    'Pastel Artworks',
    'Mixed Media Artworks',
    'Prints (Lithographs, Screen Prints, Etchings, etc.)',
    'Photography Prints',
    'Digital Art Prints',
    'Collages',
    'Typography/Quote Posters',
    'Maps (Vintage or Modern)',
    'Pressed Flower Art',
    'Calligraphy Art',
    'Needlework (Framed cross-stitch or embroidery on fabric)',
    'Silhouette Cutouts',
    'Papercut Art',
    'Blueprints (Architectural Drawings)'
  ];

  // Form state
  const [artworkName, setArtworkName] = useState('');
  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [copyAvailability, setCopyAvailability] = useState(false);
  const [artCopyType, setArtCopyType] = useState('COPY_OF_ART');
  const [noOfCopies, setNoOfCopies] = useState('1');
  const [priceOfCopy, setPriceOfCopy] = useState('');
  const [unit, setUnit] = useState('cm');
  const [widthOfArt, setWidthOfArt] = useState('');
  const [heightOfArt, setHeightOfArt] = useState('');
  const [lengthOfArt, setLengthOfArt] = useState('');
  const [availability, setAvailability] = useState(true);
  const [minimumQuantityPerBuyer, setMinimumQuantityPerBuyer] = useState('1');
  const [sellingStatus, setSellingStatus] = useState('AVAILABLE');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Validate copy price based on original price
  useEffect(() => {
    if (artCopyType && price && priceOfCopy) {
      const originalPrice = parseFloat(price);
      const copyPrice = parseFloat(priceOfCopy);
      let maxAllowed = 0;

      if (artCopyType === 'COPY_OF_ART') {
        maxAllowed = originalPrice * 0.4; // 40% of original
      } else if (artCopyType === 'VIRTUAL_COPY') {
        maxAllowed = originalPrice * 0.2; // 20% of original
      }

      if (copyPrice > maxAllowed) {
        Alert.alert(
          'Invalid Price',
          `Price for ${artCopyType.replace('_', ' ').toLowerCase()} must be below ${maxAllowed.toFixed(2)}`
        );
        setPriceOfCopy('');
      }
    }
  }, [artCopyType, price, priceOfCopy]);

  // Request media library permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
        }
      }
    })();
  }, []);

  // Handle image selection
  const pickImage = async () => {
    if (images.length >= 10) {
      Alert.alert('Maximum reached', 'You can upload up to 10 images only.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Remove an image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Submit artwork
  const submitArtwork = async () => {
    if (!artworkName || !type || !description) {
      Alert.alert('Required fields', 'Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Images required', 'Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const sellerId = await AsyncStorage.getItem('sellerId');
      if (!sellerId) {
        throw new Error('Seller ID not found');
      }

      const formData = new FormData();
      
      // Add artwork data
      formData.append('artworkName', artworkName);
      formData.append('type', type);
      formData.append('subType', subType);
      formData.append('artist', artist);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('copyAvailability', copyAvailability);
      formData.append('artCopyType', artCopyType);
      formData.append('noOfCopies', noOfCopies);
      formData.append('price_of_copy', priceOfCopy);
      formData.append('unit', unit);
      formData.append('widthOfArt', widthOfArt);
      formData.append('heightOfArt', heightOfArt);
      formData.append('lengthOfArt', lengthOfArt);
      formData.append('availability', availability);
      formData.append('minimumQuantityPerBuyer', minimumQuantityPerBuyer);
      formData.append('sellinStatus', sellingStatus);
      formData.append('sellerId', sellerId);

      // Add images
      images.forEach((uri, index) => {
        formData.append('images', {
          uri,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });
      console.log(formData);
      const response = await axios.post('http://192.168.8.108:8080/api/artworks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Artwork added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error(response.data.message || 'Failed to add artwork');
      }
    } catch (error) {
      console.error('Error submitting artwork:', error);
      Alert.alert('Error', error.message || 'Failed to add artwork');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Add New Artwork</Text>

      {/* Basic Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Artwork Name *"
          value={artworkName}
          onChangeText={setArtworkName}
        />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Type of Artwork *</Text>
          <Picker
            selectedValue={type}
            onValueChange={setType}
            style={styles.picker}
          >
            <Picker.Item label="Select artwork type" value="" />
            {artworkTypes.map((artType, index) => (
              <Picker.Item key={index} label={artType} value={artType} />
            ))}
          </Picker>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Sub Type (optional)"
          value={subType}
          onChangeText={setSubType}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Artist Name"
          value={artist}
          onChangeText={setArtist}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description *"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Pricing Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Price (Original) *"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Copy Available:</Text>
          <Switch
            value={copyAvailability}
            onValueChange={setCopyAvailability}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={copyAvailability ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        
        {copyAvailability && (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Copy Type:</Text>
              <Picker
                selectedValue={artCopyType}
                onValueChange={setArtCopyType}
                style={styles.picker}
              >
                <Picker.Item label="Copy of Art" value="COPY_OF_ART" />
                <Picker.Item label="Virtual Copy" value="VIRTUAL_COPY" />
              </Picker>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder={`Price for one copy*`}
              value={priceOfCopy}
              onChangeText={setPriceOfCopy}
              keyboardType="decimal-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Number of Copies"
              value={noOfCopies}
              onChangeText={setNoOfCopies}
              keyboardType="number-pad"
            />
          </>
        )}
      </View>

      {/* Dimensions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dimensions</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Width:</Text>
            <TextInput
              style={styles.input}
              value={widthOfArt}
              onChangeText={setWidthOfArt}
              keyboardType="number-pad"
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.inputLabel}>Height:</Text>
            <TextInput
              style={styles.input}
              value={heightOfArt}
              onChangeText={setHeightOfArt}
              keyboardType="number-pad"
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Length:</Text>
            <TextInput
              style={styles.input}
              value={lengthOfArt}
              onChangeText={setLengthOfArt}
              keyboardType="number-pad"
            />
          </View>
        </View>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Unit:</Text>
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.picker}
          >
            <Picker.Item label="Centimeters" value="cm" />
            <Picker.Item label="Inches" value="in" />
            <Picker.Item label="Pixels" value="px" />
          </Picker>
        </View>
      </View>

      {/* Availability Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Available for sale:</Text>
          <Switch
            value={availability}
            onValueChange={setAvailability}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={availability ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Minimum Quantity Per Buyer"
          value={minimumQuantityPerBuyer}
          onChangeText={setMinimumQuantityPerBuyer}
          keyboardType="number-pad"
        />
        
        
      </View>

      {/* Images Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Images (Max 10)</Text>
        <Text style={styles.note}>Upload high-quality images of your artwork</Text>
        
        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <MaterialIcons name="add-a-photo" size={24} color="#fff" />
          <Text style={styles.addImageText}>Add Image</Text>
        </TouchableOpacity>
        
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => removeImage(index)}
              >
                <FontAwesome name="times-circle" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={submitArtwork}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Artwork</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop:20,

  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#555',
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  addImageText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 15,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 3,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddArtwork;