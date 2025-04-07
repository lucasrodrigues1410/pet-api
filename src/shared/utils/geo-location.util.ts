const EARTH_RADIUS_KM = 6371;

function calculateLatDelta(radiusInKm: number): number {
	return radiusInKm / EARTH_RADIUS_KM;
}

function calculateLonDelta(latitude: number, radiusInKm: number): number {
	return radiusInKm / (EARTH_RADIUS_KM * Math.cos((latitude * Math.PI) / 180));
}

export function calculateLocationBounds({
	latitude,
	longitude,
	radiusInKm = 10,
}: { latitude?: number; longitude?: number; radiusInKm?: number }) {
	if (!latitude || !longitude) return null;
	const latDelta = calculateLatDelta(radiusInKm);
	const lonDelta = calculateLonDelta(latitude, radiusInKm);

	return {
		minLat: latitude - latDelta,
		maxLat: latitude + latDelta,
		minLon: longitude - lonDelta,
		maxLon: longitude + lonDelta,
	};
}
