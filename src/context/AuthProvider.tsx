import React, { useState, useEffect, useContext, createContext } from "react";
import nookies, {parseCookies} from "nookies";
import { firebaseClient } from "../config/firebaseClient";
import {useRouter} from "next/router";

const AuthContext = createContext<{ user: firebaseClient.User | null }>({
    user: null,
});

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<firebaseClient.User | null>(null);
    const router = useRouter()

    const {'cadaster_system_token': token} = parseCookies()

    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as any).nookies = nookies;
        }
        return firebaseClient.auth().onIdTokenChanged(async (user) => {
            if (!user) {
                console.log(`no token found...`);
                setUser(null);
                nookies.destroy(null, "cadaster_system_token");
                nookies.set(null, "cadaster_system_token", "", {path: '/'});
                return;
            }

            console.log(`updating token...`);
            const token = await user.getIdToken();
            setUser(user);
            nookies.destroy(null, "token");
            nookies.set(null, "cadaster_system_token", token, {path: '/'});
        });
    }, []);

    // force refresh the token every 10 minutes
    useEffect(() => {
        const handle = setInterval(async () => {
            console.log(`refreshing token...`);
            const user = firebaseClient.auth().currentUser;
            if (user) await user.getIdToken(true);
        }, 10 * 60 * 1000);
        return () => clearInterval(handle);

        if(!token) {
            router.push('/login')
        }

    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};