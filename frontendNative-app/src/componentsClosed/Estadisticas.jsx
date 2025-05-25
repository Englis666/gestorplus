/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import EstadisticaCard from "./card/EstadisticaCard";
import Icon from 'react-native-vector-icons/MaterialIcons';

const Estadisticas = () => {
  const totalActualizaciones = 123;
  const totalEntradas = 456;
  const notificacionesGenerales = 789;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <EstadisticaCard
          icon="trending-up" // Nombre del icono de MaterialIcons
          title="Actualizaciones de información"
          value={totalActualizaciones}
        />
        <EstadisticaCard
          icon={<Icon name="trending-up" size={48} color="#28a745" />} // Componente Icon directamente
          title="Entradas al trabajo"
          value={totalEntradas}
        />
        <EstadisticaCard
          icon="notifications"
          title="Notificaciones Generales"
          value={notificacionesGenerales}
        />
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
    backgroundColor: "#f4f4f4",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});

export default Estadisticas;