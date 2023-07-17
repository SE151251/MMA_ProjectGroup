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
import DashboardStaff from "./src/screens/StaffScreens/DashboardStaff";
import OrdersStaff from "./src/screens/StaffScreens/OrdersStaff";
import OrderDetailStaff from "./src/screens/StaffScreens/OrderDetailStaff";
import DashboardAdmin from "./src/screens/AdminScreens/DashboardAdmin";
import ManageUser from "./src/screens/AdminScreens/ManageUser";
import DepositMoney from "./src/screens/DepostiMoney";
import ProfileUser from "./src/screens/ProfileUser";

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
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 22 : 22}
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
              size={focused ? 22 : 22}
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
              size={focused ? 22 : 22}
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
              size={focused ? 22 : 22}
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
      initialRouteName="TabHome"
    >
      <Drawer.Screen
        name="TabHome"
        component={BottomTabNavigators}
        options={{
          title: "Home",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileUser}
        options={{
          title: "My Profile",     
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="person-circle-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const StaffDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSideMenu {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "black",
        sceneContainerStyle: { backgroundColor: "#ffffff", height: 1 },
      }}
      initialRouteName="TabHomeStaff"
    >
      <Drawer.Screen
        name="TabHomeStaff"
        component={DashboardStaff}
        options={{
          title: "Home",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
    <Drawer.Screen
        name="TabOrderStaff"
        component={OrdersStaff}
        options={{
          title: "List Orders",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Login"
        component={TestPage}
        options={{
          title: "Login",
          headerTitle: "Test",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="albums-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSideMenu {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "black",
        sceneContainerStyle: { backgroundColor: "#ffffff", height: 1 },
      }}
      initialRouteName="TabHomeAdmin"
    >
      <Drawer.Screen
        name="TabHomeAdmin"
        component={DashboardAdmin}
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
    <Drawer.Screen
        name="ManageUser"
        component={ManageUser}
        options={{
          title: "Manage Users",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-home-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Login"
        component={TestPage}
        options={{
          title: "Login",
          headerTitle: "Test",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="albums-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default function App() {

  return (
    <PaperProvider>
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <Stack.Navigator screenOptions={{ header: () => null }}>
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}       
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="LoginScreen" component={TestPage} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="TestRedirect" component={Login} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="StaffHome" component={StaffDrawerNavigator} />
        <Stack.Screen name="AdminHome" component={AdminDrawerNavigator} />
        <Stack.Screen name="OrderDetailStaff" component={OrderDetailStaff} />
        <Stack.Screen name="DepositMoney" component={DepositMoney} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
