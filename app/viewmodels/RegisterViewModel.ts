import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { registerUser } from "../../src/redux/user/userThunks";
import { updateUserField } from "../../src/redux/user/userSlice";
import { useRouter } from "expo-router";
import { RegistrationError } from "../../src/domain/entities/RegistrationError";
import { IsValidEmail } from "../../src/domain/usecases/IsValidEmail";
import { Usuario } from "../../src/domain/entities/Usuario";
import { PerfilUsuario } from "../../src/domain/entities/PerfilUsuario";



export default function useRegisterViewModel() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { email, loading, error, success } = useSelector(
        (state: RootState) => state.user
    );

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ✅ Instanciamos `IsValidEmail`
    const isValidEmail = new IsValidEmail();

    // ✅ Validación en tiempo real del email
    const updateEmail = (value: string) => {
        dispatch(updateUserField({ field: "email", value }));
        try {
            if (!isValidEmail.ejecutar(value)) throw new Error(RegistrationError.INVALID_EMAIL);
            setEmailValid(true);
            setErrorMessage(null);
        } catch (error) {
            setEmailValid(false);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred"); 
            }
        }
    };

    // ✅ Validación del formulario antes de enviar
    const validateForm = (): string | null => {
        if (!email || !password || !confirmPassword) return RegistrationError.INVALID_EMAIL;
        if (!emailValid) return RegistrationError.INVALID_EMAIL;
        if (password !== confirmPassword) return RegistrationError.PASSWORDS_DO_NOT_MATCH;
        if (!acceptTerms) return RegistrationError.TERMS_NOT_ACCEPTED;
        return null;
    };

    // ✅ Maneja el registro del usuario
    const handleRegister = () => {
        setErrorMessage(null);
        const errorMsg = validateForm();
        if (errorMsg) {
            setErrorMessage(errorMsg);
            return;
        }
        const usuario: Usuario = new Usuario(
            crypto.randomUUID(),
            "", // primerNombre vacío (se puede pedir en el formulario)
            null, // segundoNombre opcional
            "", // primerApellido vacío
            null, // segundoApellido opcional
            null, // fechaNacimiento opcional
            null, // sexo opcional
            email, // ✅ Asignar email
            new Date(), // ✅ fechaAceptacionTerminos
            PerfilUsuario.USER // ✅ Perfil por defecto
        );
        dispatch(registerUser({ usuario, password, confirmPassword, acceptTerms }));
    };

    // ✅ Redirigir a Home después del registro exitoso
    useEffect(() => {
        if (success) {
            router.replace("/home"); // ✅ Usar ruta relativa en Expo Router
        }
    }, [success]);

    return {
        email,
        password,
        confirmPassword,
        acceptTerms,
        loading,
        errorMessage,
        updateEmail,
        setPassword,
        setConfirmPassword,
        setAcceptTerms,
        handleRegister,
    };
}
