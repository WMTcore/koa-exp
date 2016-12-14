export function testAPI() {
	return fetchAPI('/api/', {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		method: "GET"
	})
}

// export const testAPI = {
// 	path: '/api/',
// 	options: {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Accept': 'application/json'
// 		},
// 		method: "GET"
// 	}
// }