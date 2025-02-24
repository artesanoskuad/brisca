import React, { useState, useEffect } from "react";
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
import { AppDispatch, RootState } from "../../src/redux/store";
import { registerUser } from "../../src/redux/user/userThunks";
import { updateUserField } from "../../src/redux/user/userSlice";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { email, loading, error, success } = useSelector(
        (state: RootState) => state.user
    );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [emailValid, setEmailValid] = useState(true);

    // Email validation function
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Handle email change
    const handleEmailChange = (value: string) => {
        dispatch(updateUserField({ field: "email", value }));
        setEmailValid(validateEmail(value));
    };

    // Handle user registration
    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (!emailValid) {
            alert("Invalid email format");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (!acceptTerms) {
            alert("You must accept the terms and conditions");
            return;
        }

        dispatch(registerUser({ email, password, confirmPassword, acceptTerms }));
    };

    // Redirect to home after successful registration
    useEffect(() => {
        if (success) {
            router.replace("/screens/home");
        }
    }, [success]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={[styles.input, !emailValid && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
            />
            {!emailValid && <Text style={styles.error}>Invalid email</Text>}

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
            >
                <Text style={styles.checkbox}>{acceptTerms ? "✅" : "⬜"}</Text>
                <Text style={styles.checkboxLabel}>I accept the terms and conditions</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.error}>{error}</Text>}

            <Button title="Register" onPress={handleRegister} />
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
    inputError: {
        borderColor: "red",
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
