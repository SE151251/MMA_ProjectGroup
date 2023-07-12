import { StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, ScrollView, Image } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RECIPES } from "../../database/recipes";
import FavoriteItem from "../components/FavoriteItem";

const FavoriteScreen = ({ navigation }) => {
  const [favData, setFavData] = useState([]);
  const [showClearAll, setShowClearAll] = useState(false);
  const isFocused = useIsFocused();

  let recipeFav;
  if (favData != null) {
    recipeFav = RECIPES.filter((item) => favData.includes(item.id));
  } else {
    recipeFav = [];
  }

  useEffect(() => {
    getFromStorage();
  }, [isFocused]);

  const getFromStorage = async () => {
    const storageData = await AsyncStorage.getItem("favorite");
    setFavData(storageData != null ? JSON.parse(storageData) : []);
    console.log(JSON.parse(storageData));
    setShowClearAll(storageData != null && JSON.parse(storageData).length > 1);
  };

  const removeAllStorage = async () => {
    Alert.alert("Are you sure?", "You really want to remove all your favorite collection?", [
      {
        text: "No",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => {
          AsyncStorage.clear();
          setFavData([]);
          setShowClearAll(false);
        },
      },
    ]);
  };

  const removeDataFromStorage = async (id) => {
    const list = favData.filter((item) => item !== id);
    await AsyncStorage.setItem("favorite", JSON.stringify(list));
    setFavData(list);
    setShowClearAll(list.length > 1);
  };

  return (
    <ScrollView style={styles.container}>
      {recipeFav.length !== 0 ? (
        <View>
          <View style={styles.textHeaderContainer}>
            <Text style={styles.textHeader}>Favorite Collection</Text>
          </View>

          {showClearAll && (
            <View style={styles.clearContainer}>
              <TouchableOpacity style={styles.innerClearContainer} onPress={removeAllStorage}>
                <Ionicons name="trash" size={25} color="grey" />
                <Text style={{ fontWeight: "bold", marginTop: 5, marginLeft: 5, color: "grey" }}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.cardContainer}>
            <FlatList
              data={recipeFav}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <FavoriteItem navigation={navigation} data={item} removeDataFromStorage={removeDataFromStorage} />
              )}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={require("../../assets/images/empty-box.png")} style={{ width: 250, height: 250 }}/>
          <Text style={styles.textEmpty}>Your favorite is empty</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightOrange,
  },
  clearContainer: {
    marginHorizontal: 20,
  },
  innerClearContainer: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  textHeaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  textHeader: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.orange,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  emptyContainer: {
    height: 550,
    justifyContent: "center",
    alignItems: "center",
  },
  textEmpty: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.greenTeal,
  },
});
