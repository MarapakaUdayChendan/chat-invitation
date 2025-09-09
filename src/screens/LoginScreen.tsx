import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import EmailLogin from "../components/Email";
import MobileLogin from "../components/Mobile";
import { COLORS, FONT } from "../styles/theme";

const LoginScreen: React.FC = () => {
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
              activeOpacity={0.8}
              onPress={() => setIsEmailLogin(index === 0)}
            >
              <Text style={active ? styles.activeTabText : styles.tabText}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.contentCard}>
        {isEmailLogin ? <EmailLogin /> : <MobileLogin />}
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 60,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: COLORS.background,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT.size.subheading,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    fontFamily: FONT.family,
  },
  activeTabText: {
    fontSize: FONT.size.subheading,
    fontWeight: FONT.weight.bold,
    color: COLORS.onPrimary,
    fontFamily: FONT.family,
  },

  contentCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.background,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
