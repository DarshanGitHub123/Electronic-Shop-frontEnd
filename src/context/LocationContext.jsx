import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [pincode, setPincode] = useState(localStorage.getItem("userPincode") || "");
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationDenied, setLocationDenied] = useState(false);

    const fetchPincodeFromCoords = async (lat, lon) => {
        try {
            // Call our backend proxy instead of Nominatim directly to avoid CORS issues on localhost
            const response = await api.get(`/location/reverse-geocode?lat=${lat}&lon=${lon}`);
            const data = response.data;

            const address = data.address || {};
            const detectedPincode = address.postcode;

            if (detectedPincode) {
                // Clean up pincode (sometimes it contains ranges or spaces)
                const cleanPincode = String(detectedPincode).replace(/\s/g, "").split("-")[0];
                setPincode(cleanPincode);
                localStorage.setItem("userPincode", cleanPincode);
                toast.success(`Location detected: ${cleanPincode}`);
            } else {
                console.warn("Nominatim address object:", address);
                toast.warn("Could not find pincode for this location. Please enter manually.");
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            toast.error("Failed to convert location to PIN code");
        } finally {
            setLocationLoading(false);
        }
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);
        setLocationDenied(false);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchPincodeFromCoords(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationLoading(false);

                let message = "Unable to retrieve location";
                if (error.code === 1) {
                    message = "Location permission denied";
                    setLocationDenied(true);
                } else if (error.code === 2) {
                    message = "Position unavailable";
                } else if (error.code === 3) {
                    message = "Location request timed out";
                }

                toast.info(message + ". Showing PAN INDIA products.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const setManualPincode = (pin) => {
        setPincode(pin);
        if (pin) {
            localStorage.setItem("userPincode", pin);
        } else {
            localStorage.removeItem("userPincode");
        }
    };

    return (
        <LocationContext.Provider
            value={{
                pincode,
                locationLoading,
                locationDenied,
                requestLocation,
                setManualPincode,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
