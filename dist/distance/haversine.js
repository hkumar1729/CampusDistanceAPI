"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = void 0;
const distance = (lat1, long1, lat2, long2) => {
    const earthRadius = 6378;
    const degTorad = (lat1, long1, lat2, long2) => {
        const radian = {
            userLat: lat1 * Math.PI / 180,
            userLong: long1 * Math.PI / 180,
            schoolLat: lat2 * Math.PI / 180,
            schoolLong: long2 * Math.PI / 180,
        };
        return radian;
    };
    const coordinates = degTorad(lat1, long1, lat2, long2);
    const { userLat, userLong, schoolLat, schoolLong } = coordinates;
    const a = Math.pow(Math.sin((schoolLat - userLat) / 2), 2) + Math.cos(userLat) * Math.cos(schoolLat) * Math.pow(Math.sin((schoolLong - userLong) / 2), 2);
    const d = 2 * earthRadius * Math.asin(Math.sqrt(a));
    return d;
};
exports.distance = distance;
