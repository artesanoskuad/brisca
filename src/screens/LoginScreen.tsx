// src/screens/LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithEmailThunk, loginWithFingerprintThunk, loginWithFaceThunk, fetchHardwareSupportThunk } from '../redux/login/loginSlice';
import type { RootState, AppDispatch } from '../redux/store';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, user, lockRemainingSeconds, hardwareSupport } = useSelector(
    (state: RootState) => state.login
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchHardwareSupportThunk());
  }, [dispatch]);

  // Al detectar que el login es exitoso y que el componente ya está montado,
  // retrasamos la navegación un poco para asegurar que el Root Layout esté listo.
  useEffect(() => {
    if (mounted && user) {
      setTimeout(() => {
        router.push('/home');
      }, 100); // 100 ms de retardo (puedes ajustar este valor si es necesario)
    }
  }, [mounted, user, router]);

  const handleEmailLogin = () => {
    dispatch(loginWithEmailThunk({ email, password }));
  };

  const handleFingerprintLogin = () => {
    dispatch(loginWithFingerprintThunk());
  };

  const handleFaceLogin = () => {
    dispatch(loginWithFaceThunk());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Iniciar Sesión</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}

      {lockRemainingSeconds && lockRemainingSeconds > 0 && (
        <Text style={{ marginBottom: 8 }}>
          Login bloqueado, inténtalo de nuevo en {lockRemainingSeconds} segundos
        </Text>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#ccc', marginVertical: 8, padding: 8 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ccc', marginVertical: 8, padding: 8 }}
      />
      <Button title="Login con Email" onPress={handleEmailLogin} />

      {hardwareSupport?.fingerprintAvailable && (
        <Button title="Login con Huella" onPress={handleFingerprintLogin} />
      )}
      {hardwareSupport && !hardwareSupport.fingerprintAvailable && (
        <Text>Tu dispositivo no soporta autenticación por huella.</Text>
      )}
      {hardwareSupport?.faceAvailable && (
        <Button title="Login con Face" onPress={handleFaceLogin} />
      )}

    </View>
  );
};

export default LoginScreen;
