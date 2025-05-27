import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SellerRegistrationScreen() {
  const [step, setStep] = useState(1);
  const [imageUri, setImageUri] = useState(null);
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const businessType = watch('type');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
  
      // Append all form fields
      for (const key in data) {
        formData.append(key, data[key]);
      }
  
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        formData.append('userId', userId);
      }
  
      // Append image if available
      if (imageUri) {
        formData.append('businessProfile', {
          uri: imageUri,
          name: 'business.jpg',
          type: 'image/jpeg',
        });
      }
  
      // Send POST request
      const response = await fetch('http://192.168.8.108:8080/api/sellers/register', {
        method: 'POST',
        body: formData,
      });
  
      // Handle response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Success:', result);
      }
  
      alert('Seller registered successfully!');
      if (result?.seller_id) {
        await AsyncStorage.setItem('sellerId', result.seller_id.toString());
        cosole.log(sellerId);
        alert('Seller registered successfully');
      } else {
        alert('Registration succeeded but seller_id missing from response');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form: ' + error.message);
    }
  };


  const renderProgressSteps = () => {
    return (
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <View style={[styles.progressStep, i === step && styles.activeStep]}>
              <Text style={[styles.progressText, i === step && styles.activeText]}>{i}</Text>
            </View>
            {i < 3 && <View style={[styles.progressLine, i < step && styles.activeLine]} />}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#f8f9fa', '#e9ecef']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Join Our Art Community</Text>
          <Text style={styles.headerSubtitle}>Register as a seller to showcase your artwork</Text>
        </LinearGradient>

        {renderProgressSteps()}

        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Your Artist Type</Text>
            <Text style={styles.stepDescription}>Are you an individual artist or representing an organization?</Text>
            
            <View style={styles.optionsContainer}>
              <Controller
                control={control}
                name="type"
                rules={{ required: 'Please select your artist type' }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity 
                      style={[styles.optionCard, value === 'single' && styles.optionCardSelected]}
                      onPress={() => onChange('single')}
                    >
                      <Icon name="person" size={30} color={value === 'single' ? '#6c5ce7' : '#adb5bd'} />
                      <Text style={[styles.optionText, value === 'single' && styles.optionTextSelected]}>Individual Artist</Text>
                      <Text style={styles.optionDescription}>Freelancer or independent artist</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.optionCard, value === 'organization' && styles.optionCardSelected]}
                      onPress={() => onChange('organization')}
                    >
                      <Icon name="business" size={30} color={value === 'organization' ? '#6c5ce7' : '#adb5bd'} />
                      <Text style={[styles.optionText, value === 'organization' && styles.optionTextSelected]}>Art Organization</Text>
                      <Text style={styles.optionDescription}>Gallery, studio or art collective</Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
            
            {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
            
            <TouchableOpacity 
              style={[styles.button, !businessType && styles.buttonDisabled]}
              onPress={() => businessType && setStep(2)}
              disabled={!businessType}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Business Details</Text>
            <Text style={styles.stepDescription}>Tell us about your {businessType === 'single' ? 'art practice' : 'organization'}</Text>
            
            <Controller
              control={control}
              name="businessName"
              rules={{ required: 'Business/Artist name is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{businessType === 'single' ? 'Artist Name' : 'Business Name'}</Text>
                  <TextInput 
                    placeholder={businessType === 'single' ? "e.g. Vincent Van Gogh" : "e.g. Modern Art Gallery"} 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value} 
                  />
                  {errors.businessName && <Text style={styles.errorText}>{errors.businessName.message}</Text>}
                </View>
              )}
            />
            
            <Controller
              control={control}
              name="businessEmail"
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput 
                    placeholder="your@email.com" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.businessEmail && <Text style={styles.errorText}>{errors.businessEmail.message}</Text>}
                </View>
              )}
            />
            
            <Controller
              control={control}
              name="businessPhone"
              rules={{ required: 'Phone number is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput 
                    placeholder="+1 234 567 8900" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                    keyboardType="phone-pad"
                  />
                  {errors.businessPhone && <Text style={styles.errorText}>{errors.businessPhone.message}</Text>}
                </View>
              )}
            />
            
            <Controller
              control={control}
              name="faxNumber"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Fax Number (Optional)</Text>
                  <TextInput 
                    placeholder="+1 234 567 8901" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                    keyboardType="phone-pad"
                  />
                </View>
              )}
            />
            
            {businessType === 'organization' && (
              <Controller
                control={control}
                name="businessRegNo"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Business Registration Number (Optional)</Text>
                    <TextInput 
                      placeholder="123456789" 
                      style={styles.input} 
                      onChangeText={onChange} 
                      value={value}
                    />
                  </View>
                )}
              />
            )}
            
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location (Optional)</Text>
                  <TextInput 
                    placeholder="City, Country" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                  />
                </View>
              )}
            />
            
            <View style={styles.uploadContainer}>
              <Text style={styles.inputLabel}>Business Profile Image</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Icon name="add-a-photo" size={24} color="#6c5ce7" />
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
              {imageUri && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri(null)}>
                    <Icon name="close" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setStep(1)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setStep(3)}
              >
                <Text style={styles.buttonText}>Continue</Text>
                <Icon name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Owner Information</Text>
            <Text style={styles.stepDescription}>Please provide your personal details</Text>
            
            <Controller
              control={control}
              name="ownerNic"
              rules={{ required: 'NIC/Passport is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>NIC/Passport Number</Text>
                  <TextInput 
                    placeholder="123456789X" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                  />
                  {errors.ownerNic && <Text style={styles.errorText}>{errors.ownerNic.message}</Text>}
                </View>
              )}
            />
            
            <Controller
              control={control}
              name="ownerPhone"
              rules={{ required: 'Phone number is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Personal Phone Number</Text>
                  <TextInput 
                    placeholder="+1 234 567 8900" 
                    style={styles.input} 
                    onChangeText={onChange} 
                    value={value}
                    keyboardType="phone-pad"
                  />
                  {errors.ownerPhone && <Text style={styles.errorText}>{errors.ownerPhone.message}</Text>}
                </View>
              )}
            />
            
            <Controller
              control={control}
              name="ownerAddress"
              rules={{ required: 'Address is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Personal Address</Text>
                  <TextInput 
                    placeholder="123 Art Street, Creative City" 
                    style={[styles.input, { height: 80 }]} 
                    onChangeText={onChange} 
                    value={value}
                    multiline
                  />
                  {errors.ownerAddress && <Text style={styles.errorText}>{errors.ownerAddress.message}</Text>}
                </View>
              )}
            />
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setStep(2)}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.buttonText}>Complete Registration</Text>
                <Icon name="check-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop:25,
    paddingBottom:25,
  },
  header: {
    padding: 25,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#6c5ce7',
  },
  progressText: {
    color: '#adb5bd',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  proggressLine: {
    height: 2,
    width: 40,
    backgroundColor: '#e9ecef',
  },
  activeLine: {
    backgroundColor: '#6c5ce7',
  },
  stepContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 25,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: '#6c5ce7',
    backgroundColor: '#f8f9fe',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 10,
    marginBottom: 5,
  },
  optionTextSelected: {
    color: '#6c5ce7',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#343a40',
  },
  uploadContainer: {
    marginBottom: 25,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6c5ce7',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#dc3545',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
    flex: 1,
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 10,
    marginLeft: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  secondaryButtonText: {
    color: '#495057',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
});