// app/_layout.tsx
import React, { Suspense } from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store'; // Ajusta la ruta según tu estructura
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
      >
        <Slot />
      </Suspense>
    </Provider>
  );
}
