import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store"; // Asegúrate de importar bien la tienda

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(screens)/home" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)/register" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}

