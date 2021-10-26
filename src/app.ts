import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Tells Typescript that this variable exists

type GoogleGeocodingResponse = { 
    results: { geometry: { location: {lat: number, lng: number}}}[];
    status: "OK" | "ZERO_RESULTS";
}

function searchAddressHandler(e: Event) {
    e.preventDefault();
    const enteredAddress = addressInput.value;
    // encodeURI turns string into URL compatible string
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
        .then(res => {
            if (res.data.status !== "OK") {
                throw new Error("Could not fetch location.")
            }
            const coordinates = res.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById('map')!, {
                center: coordinates,
                zoom: 16
            });
            new google.maps.Marker({
                position: coordinates,
                map: map,
            });
        })
        .catch(err => alert(err.message))
}

form.addEventListener("submit", searchAddressHandler);