/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener instalada y configurada una biblioteca de iconos

const EstadisticaCard = ({ icon, title, value }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardBody}>
        {typeof icon === 'string' ? (
          <Icon name={icon} size={48} color="#555" />
        ) : (
          icon // Si ya es un componente de icono, renderizarlo directamente
        )}
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '30%', // Aproximadamente el ancho de una columna md-4 en un layout flexible
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cardBody: {
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    marginTop: 10,
    color: '#777',
    textAlign: 'center',
  },
});

export default EstadisticaCard;