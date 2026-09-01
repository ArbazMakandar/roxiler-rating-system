const API_BASE_URL = "https://roxiler-rating-system.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            }),
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

export const registerUser = (userData) =>
    apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });

export const loginUser = (credentials) =>
    apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });

export const getStores = () =>
    apiRequest("/stores");

export const submitRating = (storeId, rating) =>
    apiRequest("/ratings", {
        method: "POST",
        body: JSON.stringify({
            storeId,
            rating
        })
    });

export const getMyRating = (storeId) =>
    apiRequest(`/ratings/my/${storeId}`);

export const getStoreRatings = (storeId) =>
    apiRequest(`/ratings/store/${storeId}`);

export const getAdminDashboard = () =>
    apiRequest("/admin/dashboard");

export const createStore = (storeData) =>
    apiRequest("/admin/stores", {
        method: "POST",
        body: JSON.stringify(storeData)
    });

export const getOwnerDashboard = () =>
    apiRequest("/owner/dashboard");

export const getOwnerStore = () =>
    apiRequest("/owner/store");

export const getOwnerRatings = () =>
    apiRequest("/owner/ratings");