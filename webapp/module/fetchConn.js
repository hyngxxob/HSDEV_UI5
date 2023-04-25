sap.ui.define([], function () {
	"use strict";

	return {
		postMethod: async function (path, body, token, headers = {}) {
			const url = `${path}`;
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token,
					"withCredentials": true
				},
				body: JSON.stringify(body),
			};
			// debugger;
			const res = await fetch(url, options);
			const data = await res.json();
			if (res.ok) {
				return data;
			} else {
				throw Error(data);
			}
		},
		// postMethod: async function (host, path, body, headers = {}) {
		// 	const url = `http://${host}/${path}`;
		// 	const options = {
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"withCredentials": true
		// 		},
		// 		body: JSON.stringify(body),
		// 	};
		// 	const res = await fetch(url, options);
		// 	const data = await res.json();
		// 	if (res.ok) {
		// 		return data;
		// 	} else {
		// 		throw Error(data);
		// 	}
		// },

		getMethod: async function (path, token, headers = {}) {
			const url = `${path}`;
			const options = {
				method: "GET",
				headers: {
					"Authorization": "Bearer " + token
				}
			};
			// debugger;
			const res = await fetch(url, options);
			console.log(res);
			const data = await res.json();
			if (res.ok) {
				return data;
			} else {
				// console.log(data);

				throw data;
			}
		},

		putMethod: async function (path, body, token, headers = {}) {
			const url = `${path}`;
			const options = {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token,
					"withCredentials": true
				},
				body: JSON.stringify(body),
			};
			// debugger;
			const res = await fetch(url, options);
			const data = await res.json();
			if (res.ok) {
				return data;
			} else {
				throw Error(data);
			}
		},

		deleteMethod: async function (path, body, token, headers = {}) {
			const url = `${path}`;
			const options = {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + token,
					"withCredentials": true
				},
				body: JSON.stringify(body),
			};
			// debugger;
			const res = await fetch(url, options);
			const data = await res.json();
			if (res.ok) {
				return data;
			} else {
				throw Error(data);
			}
		},

		cpi_getMethod: async function (path, headers = {}) {
			const url = `${path}`;
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			};
			const res = await fetch(url, options);
			const data = await res.json();
			if (res.ok) {
				return data;
			} else {
				throw Error(data);
			}
		}
	};
});