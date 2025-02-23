import React, { useState } from "react";
import { 
    View, 
    TextInput, 
    Button, 
    Text, 
    ActivityIndicator, 
    StyleSheet, 
    TouchableOpacity 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store"; // Redux Store
import { registerUser } from "../src/redux/user/userThunks"; // Thunk para el registro
import { updateUserField } from "../src/redux/user/userSlice"; // Actualización de estado
import { Usuario } from "../src/domain/entities/Usuario"; // Entidad Usuario
import { PerfilUsuario } from "../src/domain/entities/PerfilUsuario"; // Enum de Perfil
import { useRouter } from "expo-router"; // Expo Router para navegación

export default function RegisterScreen() {
    const dispatch = useDispatch<AppDispatch>(); // Dispatch tipado correctamente
    const router = useRouter(); // Router de Expo Router

    // Estado global de Redux (correo y estado de carga)
    const { correoElectronico, loading, error, success } = useSelector(
        (state: RootState) => state.user
    );

    // Estados locales para el formulario
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [aceptoTerminos, setAceptoTerminos] = useState(false);

    // Manejar registro de usuario
    const handleRegister = () => {
        if (!correoElectronico || !contraseña || !confirmarContraseña) {
            alert("Todos los campos son obligatorios");
            return;
        }
        if (contraseña !== confirmarContraseña) {
            alert("Las contraseñas no coinciden");
            return;
        }
        if (!aceptoTerminos) {
            alert("Debes aceptar los términos y condiciones");
            return;
        }

        // Crear usuario simulado
        const usuario = new Usuario(
            "uuid-123", // Simulación de ID
            "Juan",
            null,
            "Pérez",
            null,
            new Date("2000-01-01"),
            "M",
            correoElectronico,
            new Date(),
            PerfilUsuario.USER
        );

        dispatch(registerUser({ usuario, contraseña, confirmarContraseña, aceptoTerminos }));
    };

    // Redirigir si el registro fue exitoso
    if (success) {
        router.push("/home"); // Navegar a Home tras registro exitoso
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={correoElectronico}
                onChangeText={(value) =>
                    dispatch(updateUserField({ field: "correoElectronico", value }))
                }
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={contraseña}
                onChangeText={setContraseña}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                secureTextEntry
                value={confirmarContraseña}
                onChangeText={setConfirmarContraseña}
            />

            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAceptoTerminos(!aceptoTerminos)}
            >
                <Text style={styles.checkbox}>{aceptoTerminos ? "✅" : "⬜"}</Text>
                <Text style={styles.checkboxLabel}>Acepto los términos y condiciones</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.error}>{error}</Text>}

            <Button title="Registrarse" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkbox: {
        fontSize: 18,
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
});
