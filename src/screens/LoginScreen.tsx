import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import EmailLogin from "../components/Email";
import MobileLogin from "../components/Mobile";


const LoginScreen: React.FC = ({navigation}: any) => {
  const [isEmailLogin, setIsEmailLogin] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {["Email", "Mobile"].map((label, index) => {
          const active = isEmailLogin === (index === 0);
          return (
            <TouchableOpacity
              key={label}
              style={[styles.tab, active && styles.activeTab]}
              onPress={() => setIsEmailLogin(index === 0)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.contentContainer}>
        {isEmailLogin ? <EmailLogin /> : <MobileLogin />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
    padding: 4,
    marginTop: 60,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  tabText: { fontSize: 16, fontWeight: "500", color: "#666" },
  activeTabText: { color: "#000", fontWeight: "600" },
  contentContainer: { flex: 1 },
});

export default LoginScreen;
