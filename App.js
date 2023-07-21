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
import ShowPageMomo from "./src/screens/ShowPageMomo";
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
import Profile from "./src/screens/Profile";
import Register from "./src/screens/Register";
import EditProfile from "./src/screens/EditProfile";
import Login from "./src/screens/LoginScreen";
import CreateProduct from "./src/screens/StaffScreens/CreateProduct"
import CreateMeal from "./src/screens/StaffScreens/CreateMeal"
import ProductsScreen from "./src/screens/StaffScreens/ProductsScreen";
import ListMealsScreen from "./src/screens/StaffScreens/ListMealsScreen";
import ManageStaff from "./src/screens/AdminScreens/ManageStaff";

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
              color={focused ? "#03045E" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#03045E",
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
              color={focused ? "#03045E" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#03045E",
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
              color={focused ? "#03045E" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#03045E",
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
              color={focused ? "#03045E" : "grey"}
            />
          ),
          tabBarActiveTintColor: "#03045E",
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
        component={Profile}
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
        name="TabOrderStaff"
        component={OrdersStaff}
        options={{
          title: "List Orders",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="reorder-three"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
        <Drawer.Screen
        name="TabProductStaff"
        component={ProductsScreen}
        options={{
          title: "List Products",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="cube-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
        <Drawer.Screen
        name="TabMealstStaff"
        component={ListMealsScreen}
        options={{
          title: "List Meals",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="reader-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
    <Drawer.Screen
        name="TabCreateProduct"
        component={CreateProduct}
        options={{
          title: "Create Product",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="add-circle-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
    {/* <Drawer.Screen
        name="TabCreateMeal"
        component={CreateMeal}
        options={{
          title: "Create Meal",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="add-circle-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      /> */}

      
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
              name="person-circle-outline"
              size={focused ? 20 : 20}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ManageStaff"
        component={ManageStaff}
        options={{
          title: "Manage Staff",
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name="ios-person-outline"
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
      <Stack.Navigator 
       screenOptions={{ headerShown: false, }}
      >
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}       
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="LoginScreen" component={Login} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="ShowPageMomo" component={ShowPageMomo} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="StaffHome" component={StaffDrawerNavigator} />
        <Stack.Screen name="AdminHome" component={AdminDrawerNavigator} />
        <Stack.Screen name="OrderDetailStaff" component={OrderDetailStaff} />
        <Stack.Screen name="DepositMoney" component={DepositMoney} />
        <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
