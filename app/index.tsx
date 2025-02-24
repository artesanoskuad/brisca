import { View, ActivityIndicator, StyleSheet } from "react-native";
import useAuthViewModel from "./viewmodels/useAuthViewModel";

export default function Index() {
    const { isLoading } = useAuthViewModel();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return null; // ✅ La redirección ya se maneja en `useAuthViewModel`
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
