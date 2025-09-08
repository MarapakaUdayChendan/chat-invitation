import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { OtpGeneration } from "../components/OtpGeneration";

const SignUpConfirmation: React.FC = () => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); 
  
  useEffect(() => {
    generateOtp();

    // countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateOtp = () => {
    const otp = OtpGeneration();
    setGeneratedOtp(otp);
    setTimeLeft(30); 
    console.log("Generated OTP:", otp);
  };

  const handleSubmit = () => {
    if (timeLeft === 0) {
      setError("OTP expired, Please resend a new one.");
      return;
    }

    if (enteredOtp === generatedOtp) {
      setError("");
      Alert.alert("✅ Success", "OTP Verified Successfully!");
    } else {
      setError("Invalid OTP, please try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit OTP"
        keyboardType="numeric"
        maxLength={4}
        value={enteredOtp}
        onChangeText={(text) => {
          setEnteredOtp(text);
          setError("");
        }}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.timer}>
        {timeLeft > 0
          ? `OTP expires in ${timeLeft}s`
          : "OTP expired"}
      </Text>

      <View style={styles.btns}>
          <Button title="Submit" onPress={handleSubmit} />

          {timeLeft === 0 && (
            <View style={{ marginTop: 10 }}>
              <Button title="Resend OTP" onPress={generateOtp} />
            </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 15,
    fontSize: 16,
  },
  btns:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,

  },
  timer: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
  },
});

export default SignUpConfirmation;