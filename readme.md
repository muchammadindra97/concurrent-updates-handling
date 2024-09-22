# Concurrent Updates Handling
When users are accessing a resource at a same time/state and want to make modification, some information would be loss if concurrent updates happen. Example:

1. User A and B open an edit page at same time (resource have X and Y field).
2. First the user A submit edit with only X field changed.
3. Then the user B submit edit with only Y field changed.
4. Because resource initially have same state for them, updated field X from user A will be lost because user B not seeing X field new value (not reloading the edit page) but it still submit the edit with old resource state.

## Solution
### Using Last Modification Date
1. Send "Last-Modified" header containing date string of a resource to client.
2. Client put the date to "If-Unmodified-Since" header when sending update request to server.
3. Server executes update only when "If-Unmodified-Since" is identical to last modification date of the resource.

This approach might has limitaion if modification date has weak precision (precision of seconds will run into lost of update if multiple concurrent request are executed in the same second).

### Using Etag
1. Compute unique representation of a resource (example: hash the combination of resource id and high precision last modification date / revision number).
2. Send the hashed string on "Etag" header to client.
3. Then client will include the hash value to the request on "If-Match" header.
4. Server executes update only when "If-Match" value is same as the previously computed unique representation of the resource.

## Example App
App to run concurrent update simulation is available made with Go (as backend) and ReactJS (as frontend).
### Backend
1. Require Go v1.22
2. Run `go run server.go`
3. App run on `localhost:9000`
### Frontend
1. Require NodeJS v18
2. Run `npm run dev`
3. App run on `localhost:5173`
