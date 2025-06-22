import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VerifyEmailScreen from '../screens/VerifyEmail';
import SellerRegistrationScreen from '../screens/SellerRegistrationScreen';
import ArtistDashboard from '../screens/ArtistDashboard';
import AddArtwork from '../screens/AddArtwork';
import AddAuction from '../screens/AddAuction';
import ProductScreen from '../screens/ProductScreen';
/*import ArtDetailScreen from '../screens/ArtDetailScreen';
import AuctionScreen from '../screens/AuctionScreen';
import ArtistProfileScreen from '../screens/ArtistProfileScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import SearchScreen from '../screens/SearchScreen';
import AuthScreen from '../screens/AuthScreen';*/

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Main App Screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VerifyEmail" 
          component={VerifyEmailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SellerRegister" 
          component={SellerRegistrationScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ArtistDashboard" 
          component={ArtistDashboard} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddArtwork" 
          component={AddArtwork} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AddAuction" 
          component={AddAuction} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProductScreen" 
          component={ProductScreen} 
          options={{ headerShown: false }} 
        />
        {/* <Stack.Screen 
          name="ArtDetail" 
          component={ArtDetailScreen} 
          options={{ title: 'Artwork Details' }} 
        />
        <Stack.Screen 
          name="Auction" 
          component={AuctionScreen} 
          options={{ title: 'Live Auction' }} 
        />
        <Stack.Screen 
          name="ArtistProfile" 
          component={ArtistProfileScreen} 
          options={{ title: 'Artist Profile' }} 
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{ title: 'Your Cart' }} 
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen} 
          options={{ title: 'Checkout' }} 
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'Search Artworks' }} 
        />
        
        {/* Auth Screens }
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ title: 'Sign In / Register' }} 
        />*/}
      </Stack.Navigator> 
    </NavigationContainer>
  );
};

export default AppNavigator;