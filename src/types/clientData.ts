export interface ClientData {
	lastRequest: number; // Timestamp (milliseconds since UNIX epoch) of the last request from the client.
	requestCount: number; // Number of requests made by the client within the current interval.
}
