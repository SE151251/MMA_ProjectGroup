import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const DashboardAdmin = ({ navigation }) => {
  const [data, setData] = useState();
  const [totalProfitsMonths, setTotalProfitsMonths] = useState(0);
  const isFocused = useIsFocused();
  const screenWidth = Dimensions.get("window").width;
  useEffect(() => {
    const loadDashboardAPI = async () => {
      const access_token = await AsyncStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `https://bmosapplication.azurewebsites.net/odata/StoreOwnerDashBoards?year=2023`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setData(res.data);
        let total = 0;
        for (let i = 0; i < res.data.MonthProfits.length; i++) {
          total = total + res.data.MonthProfits[i].Profits;
        }
        setTotalProfitsMonths(total);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    if (isFocused) {
      loadDashboardAPI();
    }
  }, [isFocused]);
  var dataChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Màu cho đường biểu đồ
      },
    ],
  };
  if (data) {
    data.MonthProfits.sort((a, b) => a.Month - b.Month);
    dataChart = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          data: data.MonthProfits.map((n) => n.Profits),
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Màu cho đường biểu đồ
        },
      ],
    };
  }
  return (
    <ScrollView style={{ backgroundColor: "#CAF0F8" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 30,
          marginTop: 30,
          color: "#03045E",
        }}
      >
        ADMIN Dashboard
      </Text>
      {data && (
        <>
          <Card
            style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                Total Customers
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalCustomers}
              </Text>
            </Card.Content>
          </Card>
          <Card style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                Total Meals{" "}
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalMeals}{" "}
              </Text>
            </Card.Content>
          </Card>

          <Card style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                Total Products
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalProducts}
              </Text>
            </Card.Content>
          </Card>

          <Card style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                Total Staffs
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {data.TotalStaffs}{" "}
              </Text>
            </Card.Content>
          </Card>
          <Card style={{
              paddingBottom: 10,
              paddingTop: 10,
              marginBottom: 20,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <Card.Content>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                Profits In This Month
              </Text>
              <Text
                style={{ textAlign: "center", fontSize: 24, fontWeight: 700 }}
              >
                {totalProfitsMonths}
              </Text>
            </Card.Content>
          </Card>
        </>
      )}
      <LineChart
        data={dataChart}
        width={Dimensions.get("window").width} // Độ rộng của biểu đồ
        height={350} // Chiều cao của biểu đồ
        yAxisLabel="$" // Nhãn trục y
        chartConfig={{
          backgroundGradientFrom: "#ffffff", // Màu nền từ
          backgroundGradientTo: "#ffffff", // Màu nền đến
          decimalPlaces: 2, // Số chữ số thập phân
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chữ
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu nhãn
        }}
        bezier // Sử dụng đường cong bézier
        style={{ marginVertical: 8, borderRadius: 16 }} // Kiểu dáng của biểu đồ
      />
    </ScrollView>
  );
};

export default DashboardAdmin;
