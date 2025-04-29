import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
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