import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  PermissionResponse,
  PermissionStatus,
} from "unimodules-permissions-interface";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isBarcodeOpen, setBarcodeOpen] = useState(false);
  const [isCameraOpen, setCameraOpen] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera Barcode permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {!(isBarcodeOpen || isCameraOpen) && (
        <>
          <Button title={"Scan"} onPress={() => setBarcodeOpen(true)} />
          <Button title={"Camera"} onPress={() => setCameraOpen(true)} />
        </>
      )}
      {isBarcodeOpen && (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <>
              <Button
                title={"Tap to Scan Again"}
                onPress={() => setScanned(false)}
              />
              <Button title={"Close"} onPress={() => setBarcodeOpen(false)} />
            </>
          )}
        </>
      )}
      {isCameraOpen && (
        <>
          <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />

          <Button title={"Close"} onPress={() => setCameraOpen(false)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
