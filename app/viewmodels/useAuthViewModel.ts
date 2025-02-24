import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { useRouter } from "expo-router";

export default function useAuthViewModel() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth); // ✅ Asumimos que `auth` existe en Redux
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ✅ Simula un delay para verificar la sesión (reemplazar con lógica real)
        setTimeout(() => {
            if (isAuthenticated) {
                router.replace("/home"); // ✅ Usuario autenticado → Va a Home
            } else {
                router.replace("/register"); // ✅ No autenticado → Va a Registro
            }
            setIsLoading(false);
        }, 1000);
    }, [isAuthenticated]);

    return { isLoading };
}
