export const distance = (lat1: number, long1: number, lat2: number, long2: number):number =>{
    const earthRadius = 6378; //Earth radius
    // Degree to radian conversion
    const degTorad = (lat1: number, long1: number, lat2: number, long2: number) =>{
        const radian = {
            userLat: lat1*Math.PI/180,
            userLong: long1*Math.PI/180,
            schoolLat: lat2*Math.PI/180,
            schoolLong: long2*Math.PI/180,
        }
        return radian;
    }
    const coordinates = degTorad(lat1, long1, lat2, long2);
    const {userLat, userLong, schoolLat, schoolLong} = coordinates
    // haversine formula to calculate distance.
    const a = Math.sin((schoolLat - userLat) / 2) ** 2 + Math.cos(userLat) * Math.cos(schoolLat) * Math.sin((schoolLong - userLong) / 2) ** 2;
    const d = 2*earthRadius * Math.asin(Math.sqrt(a));
    return d;
}