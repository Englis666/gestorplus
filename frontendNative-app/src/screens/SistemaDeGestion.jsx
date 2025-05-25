/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import TablaSistemaDeGestion from "../componentsClosed/TablaSistemaDeGestion";

const SistemaDeGestion = () => {
  return (
    <View style={StyleSheet.container}>
      <View style={StyleSheet.content}>
        <TablaSistemaDeGestion />
      </View>
    </View>
  );
};
export default SistemaDeGestion;
