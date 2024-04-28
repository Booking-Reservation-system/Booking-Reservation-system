import { useMemo } from "react";
import useTokenStore from "./storeToken"
import { jwtDecode } from "jwt-decode";
const useAuth = () => {
    const { token } = useTokenStore();
    if (!token) return { userId: null, authToken: null, favoriteId: null };
    const authToken = token
    const decodedToken = jwtDecode(token)
    const userId = useMemo(() => decodedToken.userId, [decodedToken]);
    const favoriteId = useMemo(() => decodedToken.favoriteId, [decodedToken]);

    // muốn return thêm gì thì thêm vào đây, biến thì dùng useMemo, hàm thì dùng useCallback
    /*

    ví dụ
    const displayName = useMemo(() => decodedToken.displayName, [decodedToken]);
    const hasRole = useCallback((role) => {...}, [decodedToken]);

    sau đó dùng hook useAuth này thay cho mấy đoạn dài dài để lấy userId, displayName, hasRole
    
    cái axios thì đọc về axios instance, interceptors trước đi, tối đi chơi về t hướng dẫn cho
    
    dòng 37 file ListingPage.jsx
    dòng 36 file TripPage.jsx
    dòng 46 file ListingCard.jsx
    dòng 17 file CountrySelect.jsx
    dòng 51 file LoginModal.jsx
    */

    return { userId, authToken, favoriteId };
}

export default useAuth;