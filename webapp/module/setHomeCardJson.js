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

		setRecentBoardCard: function (boardCnt, noticeCnt) {
			var myData = {
				"abcd": {
					"sap.app": {
						"id": "ordersCard",
						"type": "card"
					},
					"sap.card": {
						"type": "List",
						"header": {
							"title": "새로운 게시물 (10분이내)",
							"status": {
								// "text": "3 of 3"
							}
						},
						"content": {
							"data": {
								"json": [{
									"name": "공지사항",
									"description": "Sun Valley, Idaho",
									"info": noticeCnt,
									"infoState": "Success"
								}, {
									"name": "게시판",
									"description": "Dayville, Oregon",
									"info": boardCnt,
									"infoState": "Warning"
								}]
							},
							"item": {
								"title": {
									"value": "{name}"
								},
								// "description": {
								// 	"value": "{description}"
								// },
								"info": {
									"value": "{info}",
									"state": "{infoState}"
								}
							}
						}
					}
				}
			};
			return myData;
		},

		setCurrentUserListCard: function (data) {
			var json = data.data;
			// console.log("in json JS json : " + json);
			// console.log(json);
			var myData = {
				"tableContent": {
					"employees": {
						"sap.app": {
							"id": "employeesCard",
							"type": "card"
						},
						"sap.card": {
							"type": "Table",
							"header": {
								"title": "유저 목록",
								"subTitle": "간단한 유저 정보"
							},
							"content": {
								"data": {
									"json": json
								},
								"row": {
									"columns": [{
										"title": "아이디",
										"value": "{ID}"
									}, {
										"title": "닉네임",
										"value": "{USERNAME}"
									}, {
										"title": "이메일",
										"value": "{USER_EMAIL}"
									}]
								}
							}
						}
					}
				}
			};
			console.log(myData);
			return myData;
		}
	};
});