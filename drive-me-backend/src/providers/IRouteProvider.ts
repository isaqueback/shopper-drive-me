// IRouteProvider.ts

type Route = {
  origin: {
    latitude: number
    longitude: number
  }
  destination: {
    latitude: number
    longitude: number
  }
}

export interface IRouteProvider {
  /**
   * Calculate the route between origin and destination addresses.
   * @param origin The origin address (string).
   * @param destination The destination address (string).
   * @returns The route with latitude and longitude coordinates.
   */
  getCoordinatesFromAddresses(
    origin: string,
    destination: string,
  ): Promise<Route>

  /**
   * Get the distance between origin and destination.
   * @param route The route containing origin and destination coordinates.
   * @returns The distance in meters.
   */
  getDistance(route: Route): Promise<number>

  /**
   * Get the estimated duration between origin and destination.
   * @param route The route containing origin and destination coordinates.
   * @returns The duration in string. Example: '100s'.
   */
  getDuration(route: Route): Promise<string>
}
