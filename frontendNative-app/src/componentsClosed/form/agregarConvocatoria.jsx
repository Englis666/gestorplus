/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, TextInput, Button, Text } from "react-native";
import { Picker } from '@react-native-picker/picker'; // Asegúrate de importar Picker desde el paquete correcto

const FormularioAgregarConvocatoria = ({ agregar, setAgregar, handleAgregar, cargos }) => {
    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Agregar Convocatoria</Text>
            <View>
                <Text>Nombre de la convocatoria</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10 }}
                    value={agregar.nombreConvocatoria}
                    onChangeText={(text) => setAgregar({ ...agregar, nombreConvocatoria: text })}
                    placeholder="Ej. Convocatoria de diseñadores"
                    required
                />
            </View>

            <View>
                <Text>Descripción</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10 }}
                    value={agregar.descripcion}
                    onChangeText={(text) => setAgregar({ ...agregar, descripcion: text })}
                    placeholder="Descripción breve"
                    required
                />
            </View>

            <View>
                <Text>Cargo</Text>
                <Picker
                    selectedValue={agregar.idcargo}
                    onValueChange={(itemValue) => setAgregar({ ...agregar, idcargo: itemValue })}
                    style={{ height: 50, borderColor: 'gray', borderWidth: 1, marginBottom: 15 }}
                >
                    <Picker.Item label="Seleccione un cargo" value="" />
                    {cargos.length > 0 ? (
                        cargos.map((cargo) => (
                            <Picker.Item key={cargo.idcargo} label={cargo.nombreCargo} value={cargo.idcargo} />
                        ))
                    ) : (
                        <Picker.Item label="Cargando cargos..." value="" />
                    )}
                </Picker>
            </View>

            <View>
                <Text>Requisitos</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10 }}
                    value={agregar.requisitos}
                    onChangeText={(text) => setAgregar({ ...agregar, requisitos: text })}
                    placeholder="Ej. Mínimo 2 años de experiencia"
                    required
                />
            </View>

            <View>
                <Text>Salario</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10 }}
                    value={agregar.salario}
                    onChangeText={(text) => setAgregar({ ...agregar, salario: text })}
                    placeholder="Ej. 1800000"
                    keyboardType="numeric"
                    required
                />
            </View>

            <View>
                <Text>Total de cupos</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingLeft: 10 }}
                    value={agregar.cantidadConvocatoria}
                    onChangeText={(text) => setAgregar({ ...agregar, cantidadConvocatoria: text })}
                    placeholder="Ej. 5"
                    keyboardType="numeric"
                    required
                />
            </View>

            <Button title="Agregar Vacante" onPress={handleAgregar} />
        </View>
    );
};

export default FormularioAgregarConvocatoria;
