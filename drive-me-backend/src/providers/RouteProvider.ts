import { env } from '@/env'
import { ExternalServiceError } from '@/errors'

import { IRouteProvider } from './IRouteProvider'

interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  }>
}

export interface GoogleRouteResponse {
  routes: Array<{
    distanceMeters: number // Distance in meters
    duration: string // Duration as a string (e.g., "165s")
    polyline: {
      encodedPolyline: string
    }
  }>
}

export class RouteProvider implements IRouteProvider {
  private apiKey: string

  constructor() {
    this.apiKey = env.GOOGLE_API_KEY
  }

  /**
   * Get coordenates from the addresses.
   * Uses the Google Geocoding API to convert addresses to coordinates,
   * @param origin The origin address (string).
   * @param destination The destination address (string).
   * @returns latitude and longitude coordinates of the origin and destination addresses.
   */
  async getCoordinatesFromAddresses(
    origin: string,
    destination: string,
  ): Promise<{
    origin: { latitude: number; longitude: number }
    destination: { latitude: number; longitude: number }
  }> {
    const originCoords = await this.getCoordinates(origin)
    const destinationCoords = await this.getCoordinates(destination)

    return {
      destination: destinationCoords,
      origin: originCoords,
    }
  }

  /**
   * Get the distance between origin and destination using Google Routes API.
   * @param route The route containing origin and destination coordinates.
   * @returns The distance in meters.
   */
  async getDistance(route: {
    origin: { latitude: number; longitude: number }
    destination: { latitude: number; longitude: number }
  }): Promise<number> {
    const { origin, destination } = route
    const response = await this.calculateRoute(origin, destination)

    // The distance is in meters
    return response.routes[0].distanceMeters
  }

  /**
   * Get the estimated duration between origin and destination using Google Routes API.
   * @param route The route containing origin and destination coordinates.
   * @returns The duration in string. Example: '100s'.
   */
  async getDuration(route: {
    origin: { latitude: number; longitude: number }
    destination: { latitude: number; longitude: number }
  }): Promise<string> {
    const { origin, destination } = route
    const response = await this.calculateRoute(origin, destination)

    return response.routes[0].duration
  }

  /**
   * Helper function to get coordinates (latitude and longitude) from an address.
   * @param address The address to get coordinates for.
   * @returns Latitude and longitude of the address.
   */
  private async getCoordinates(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`,
    )

    const data: GeocodeResponse = (await response.json()) as GeocodeResponse

    const location = data.results?.[0]?.geometry?.location
    if (!location) {
      throw new ExternalServiceError(
        'GOOGLE_GEOCODING_ERROR',
        'Unable to find coordinates for the provided address',
      )
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
    }
  }

  /**
   * Helper function to get directions between two coordinates using Google Routes API.
   * @param origin The origin coordinates (latitude, longitude).
   * @param destination The destination coordinates (latitude, longitude).
   * @returns The response from the Routes API with route details.
   */
  async calculateRoute(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
  ): Promise<GoogleRouteResponse> {
    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        body: JSON.stringify({
          computeAlternativeRoutes: false,
          destination: {
            location: {
              latLng: {
                latitude: destination.latitude,
                longitude: destination.longitude,
              },
            },
          },
          languageCode: 'en-US',
          origin: {
            location: {
              latLng: {
                latitude: origin.latitude,
                longitude: origin.longitude,
              },
            },
          },
          routeModifiers: {
            avoidFerries: false,
            avoidHighways: false,
            avoidTolls: false,
          },
          routingPreference: 'TRAFFIC_AWARE',
          travelMode: 'DRIVE',
          units: 'IMPERIAL',
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask':
            'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
        method: 'POST',
      },
    )

    const data: GoogleRouteResponse =
      (await response.json()) as GoogleRouteResponse

    if (!data.routes || data.routes.length === 0) {
      throw new ExternalServiceError(
        'GOOGLE_ROUTES_ERROR',
        'Unable to calculate the route',
      )
    }

    return data
  }
}
