import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import TablaEmpleado from "../../componentsClosed/TablaEmpleado";
import NavbarClosed from "../../componentsClosed/NavbarClosed";

const InicioAdmin = () => {
  return (
    <View style={styles.container}>
      <NavbarClosed />
      <ScrollView style={styles.content}>
        <TablaEmpleado action="obtenerTodasLasNotificaciones" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF0F1",
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ECF0F1",
  },
});

export default InicioAdmin;
