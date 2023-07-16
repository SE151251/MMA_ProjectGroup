import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import COLORS from "./src/constants/colors";
import HomeScreen from "./src/screens/HomeScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import DetailsScreen from "./src/screens/DetailScreen";
import CustomSideMenu from "./src/screens/CustomSideMenu";
import TestPage from "./src/screens/TestPage";
import Login from "./src/screens/LoginPage";
import { PaperProvider } from "react-native-paper";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import HistoryOrder from "./src/screens/HistoryOrder";
import OrderDetail from "./src/screens/OrderDetail";
import WalletScreen from "./src/screens/WalletScreen";
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigators = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.light,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 25 : 22}
              color={focused ? "#A52A2A" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#A52A2A",
        }}
      />

      <Tab.Screen
        name="Cart"
        component={FavoriteScreen}
        options={{
          tabBarLabel: "Cart",
          // tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={focused ? 25 : 22}
              color={focused ? "#A52A2A" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#A52A2A",
        }}
      />
      <Tab.Screen
        name="History"
        // component={Login}
        component={HistoryOrder}
        options={{
          tabBarLabel: "History",
          // tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 25 : 22}
              color={focused ? "#A52A2A" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#A52A2A",
        }}
      />
       <Tab.Screen
        name="WalletCustomer"
        // component={Login}
        component={WalletScreen}
        options={{
          tabBarLabel: "Wallet",
          // tabBarShowLabel: true,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={focused ? 25 : 22}
              color={focused ? "#A52A2A" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#A52A2A",
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSideMenu {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "black",
        sceneContainerStyle: { backgroundColor: "#ffffff", height: 1 },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="TabHome"
        component={BottomTabNavigators}
        options={{
          title: "Home",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 25 : 20}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Login"
        component={TestPage}
        options={{
          title: "Login",
          headerTitle: "Test",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="albums-outline"
              size={focused ? 25 : 20}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  // Toast.setConfig({
  //   position: 'bottom',
  //   duration: 3000,
  //   hideOnPress: true,
  //   topOffset: 30,
  //   bottomOffset: 40,
  //   textStyle: { fontSize: 15, fontWeight: 'bold' },
  //   backgroundColor: '#333333',
  //   textColor: '#ffffff',
  // });

  return (
    <PaperProvider>
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Stack.Navigator screenOptions={{ header: () => null }}>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            title: "All Categories",
            headerShown: true,
            style: { backgroundColor: COLORS.gray },
          }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="TestRedirect" component={Login} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
