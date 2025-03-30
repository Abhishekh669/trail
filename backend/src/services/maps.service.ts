export const getAddressCoordinate = async(address : string) =>{
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
            {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "RideApp/1.0",
                  },
            }
        );
        if(!response.ok){
            throw new Error('HTTP error! status : ' + response.status)
        }
        const data = await response.json();
        if(data.length == 0){
            return null;
        }

        return {
            lat : parseFloat(data[0].lat),
            lon : parseFloat(data[0].lon)
        }
    } catch (error) {
        return null;
        
    }
}