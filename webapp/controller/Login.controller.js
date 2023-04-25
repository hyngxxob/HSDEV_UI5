sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn",
	"sap/m/MessageBox",
	'sap/ui/core/Fragment'
], function (Controller, f, MessageBox, Fragment) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	var token = storage.get("token");

	return Controller.extend("HSDEV.HSDEV.controller.Login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.Login
		 */
		onInit: function () {
			console.log("enter login");
			history.replaceState({}, null, location.pathname);

			// debugger;
			if (token != null) {
				f.getMethod("http://localhost:3100/user/isLogin", token)
					.then((data) => {
						console.log(data);
						window.location.href = "./index.html";
						// UIComponent.getRouterFor(this).navToWithoutHash("RouteMainView");
						// oRouter.navTo("main");
					})
					.catch((err) => {
						console.log("err");
						console.log(err);
						if (err.message.includes("jwt expired")) {
							MessageBox.warning(
								"세션이 만료되었습니다", {
									icon: MessageBox.Icon.WARNING,
									title: "주의",
									styleClass: sResponsivePaddingClasses
								}
							);
							var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
							storage.remove("userId");
							storage.remove("token");
							storage.remove("userName");
							storage.remove("init");
						}
						if (err.message.includes("Verify Token fail")) {
							MessageBox.warning(
								"로그인이 필요합니다", {
									icon: MessageBox.Icon.WARNING,
									title: "주의",
									styleClass: sResponsivePaddingClasses
								}
							);
						}
						// oRouter.navTo("login");
					})
			}
		},

		onLoginPress: function () {
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("Main");

			var userId = this.getView().byId("userId")._lastValue;
			var userPw = this.getView().byId("userPw")._lastValue;
			// var userId = "TESTUSER";
			// var userPw = "1qazXSW@";
			// var userId = "hyngxxob";
			// var userPw = "dkssud!123";

			f.postMethod("http://localhost:3100/user/login", {
					// fetch.postMethod("localhost:3100", "user/login", {
					ID: userId,
					PWD: userPw
				})
				.then((data) => {
					console.log(data);
					var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					storage.put("userId", data.data.ID);
					storage.put("userName", data.data.USERNAME);
					storage.put("token", data.token);
					location.reload();

				})
				.catch((err) => {
					console.log(err);
					MessageBox.warning(
						"아이디와 비밀번호를 확인해주세요", {
							icon: MessageBox.Icon.WARNING,
							title: "주의",
							styleClass: sResponsivePaddingClasses
						}
					);
				})
		},

		onOpenDialog: function () {
			var oView = this.getView();
			if (!this._pDialog) {

				this._pDialog = sap.ui.core.Fragment.load({
					type: "XML",
					id: oView.getId(),
					name: "HSDEV.HSDEV.view.fragment.signUp",
					resizable: true,
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this._pDialog.then(function (oDialog) {
				//this._configDialog(oButton, oDialog);
				oDialog.open();
				// page1.setBusy(false);
			}.bind(this));
		},

		onJoin: function () {
			// const now = new Date();
			// const options = {
			// 	timeZone: "Asia/Seoul"
			// };
			// const koreanTime = now.toLocaleString("ko-KR", options);
			const now = new Date();
			const offset = 1000 * 60 * 60 * 9;
			const koreaNow = new Date((new Date()).getTime() + offset);
			var iso = koreaNow.toISOString();

			var su_userId = this.getView().byId("su_userId").getValue();
			var su_userPw = this.getView().byId("su_userPw").getValue();
			var su_userName = this.getView().byId("su_userName").getValue();
			var su_userEmail = this.getView().byId("su_userEmail").getValue();
			var su_userPhoneNum = this.getView().byId("su_userPhoneNum").getValue();
			var that = this;

			f.postMethod("http://localhost:3100/user/signUp", {
					// fetch.postMethod("localhost:3100", "user/login", {
					ID: su_userId,
					USERNAME: su_userName,
					PWD: su_userPw,
					USER_EMAIL: su_userEmail,
					USER_PHONENUM: su_userPhoneNum,
					CREATE_DATE: iso
				})
				.then((data) => {
					console.log(data);
					MessageBox.warning(
						"회원가입이 완료되었습니다", {
							icon: MessageBox.Icon.SUCCESS,
							title: "성공",
							styleClass: sResponsivePaddingClasses
						}
					);
					that.byId("joinDialog").close();
				})
				.catch((err) => {
					console.log(err);
					MessageBox.warning(
						"관리자에게 문의바랍니다", {
							icon: MessageBox.Icon.WARNING,
							title: "주의",
							styleClass: sResponsivePaddingClasses
						}
					);
				})
				// var setData = "{\"ID\":\"" + su_userId + "\",\"USERNAME\":\"" + su_userName + "\",\"PWD\":\"" + su_userPw + "\"}";
				// console.log(setData);
				// $.ajax({
				// 	type: "POST",
				// 	url: "http://localhost:3100/user/signUp",
				// 	data: setData,
				// 	xhrFields: {
				// 		withCredentials: true
				// 	},
				// 	contentType: "application/json",
				// 	success: function (data) {
				// 		// var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				// 		// storage.put("userId", data.data.ID);
				// 		// storage.put("userName", data.data.USERNAME);
				// 		// storage.put("token", data.token);
				// 		//window.location.href = "#/settings";
				// 		// location.reload();
				// 		console.log(data);
				// 		MessageBox.warning(
				// 			"회원가입이 완료되었습니다", {
				// 				icon: MessageBox.Icon.SUCCESS,
				// 				title: "성공",
				// 				styleClass: sResponsivePaddingClasses
				// 			}
				// 		);
				// 		that.byId("joinDialog").close();
				// 		// var loginAPI = new sap.ui.model.json.JSONModel(data);
				// 		// oModel.setProperty("/userInfo", loginAPI.oData);
				// 		// console.log(oModel);
				// 	},
				// 	error: function (xhr, status, error) {
				// 		// 서버 호출 실패 시 처리할 로직
				// 		console.log(error);
				// 		alert(error);
				// 	}
				// });
		},

		onClose: function () {
			// this.getOwnerComponent().closeFragment();
			// this.getView().getParent().close();
			// this.getView().getParent().removeContent(this.getView());
			// this.getView().getParent().destroyContent(this.getView());
			// var oParent = this.getView().getParent();
			// oParent.removeContent(this.getView());
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("RouteView1", {}, false /*with history*/ );
			this.byId("joinDialog").close();
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.Login
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.Login
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.Login
		 */
		//	onExit: function() {
		//
		//	}

	});

});