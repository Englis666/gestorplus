/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import TablaEmpleado from "../../componentsClosed/TablaEmpleado";

const InicioAdministradorScreen = () => {
  return (
    <View style={styles.container}>
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

export default InicioAdministradorScreen;
