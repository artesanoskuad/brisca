import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux/store"; // Asegúrate de importar bien la tienda

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
