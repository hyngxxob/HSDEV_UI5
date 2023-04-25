sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn",
	'sap/ui/core/Fragment',
	"sap/m/MessageBox",
], function (Controller, f, Fragment, MessageBox) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("HSDEV.HSDEV.controller.UserSettings", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.Settings
		 */
		//localhost:3100/user/info
		onInit: function () {
			console.log(this.byId("expandName"));
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");

			f.getMethod("http://localhost:3100/user/info", token)
				.then((data) => {
					console.log(data);

					this.byId("settingHeaderTitle").setExpandedHeading(new sap.m.Title({
						text: data.data.ID,
						wrapping: true
					}));
					this.byId("settingHeaderTitle").setSnappedHeading(new sap.m.Title({
						text: data.data.ID,
						wrapping: true
					}));
					this.getView().byId("expandedUserImg").setSrc("./test-resources/sap/uxap/images/imageID_275314.png");
					this.byId("expandedContentUserName").setText(data.data.USERNAME);
					this.byId("snappedContentUserName").setText(data.data.USERNAME);
					this.byId("snappedTitleOnMobileUserName").setText(data.data.USERNAME);
					this.byId("UserPhoneNum").setText(data.data.USER_PHONENUM);
					this.byId("UserEmail").setText(data.data.USER_EMAIL);
				})
				.catch((err) => {
					console.log(err);
				})
		},

		onOpenWithdrawalDialog: function () {
			var oView = this.getView();
			if (!this._pDialog) {

				this._pDialog = sap.ui.core.Fragment.load({
					type: "XML",
					id: oView.getId(),
					name: "HSDEV.HSDEV.view.fragment.withdrawal",
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

			// var oView = this.getView();
			// var oDialog = oView.byId("dialog");
			// if (!oDialog) {
			// 	oDialog = sap.ui.xmlfragment(oView.getId(), "/view.signUp", this);
			// 	oView.addDependent(oDialog);
			// }
			// oDialog.open();
		},

		onWithdrawal: function () {
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");

			var userId = storage.get("userId");
			var userPw = this.getView().byId("fragmentInputUserPw").getValue();

			console.log(userPw);
			debugger;
			f.deleteMethod("http://localhost:3100/user/info", {
					// fetch.postMethod("localhost:3100", "user/login", {
					ID: userId,
					PWD: userPw
				}, token)
				.then((data) => {
					console.log(data);
					storage.remove("userId");
					storage.remove("token");
					storage.remove("userName");
					storage.remove("init");
					MessageBox.success("회원탈퇴가 완료되었습니다", {
						title: "성공",
						onClose: function (oAction) {
							location.reload();
						}
					});
				})
				.catch((err) => {
					console.log(err);
					MessageBox.warning(
						"비밀번호가 틀립니다", {
							icon: MessageBox.Icon.WARNING,
							title: "주의",
							styleClass: sResponsivePaddingClasses
						}
					);
				});

			// var setData = "{\"ID\":\"" + userId + "\",\"PWD\":\"" + userPw + "\"}";
			// console.log(setData);
			// var that = this;
			// $.ajax({
			// 	type: "DELETE",
			// 	url: "http://localhost:3100/user/info",
			// 	beforeSend: function (xhr) {
			// 		xhr.setRequestHeader("Authorization", "Bearer " + token);
			// 		// xhr.setRequestHeader("withCredentials", true);
			// 	},
			// 	data: setData,
			// 	xhrFields: {
			// 		withCredentials: true
			// 	},
			// 	success: function (data) {
			// 		//var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// 		//storage.put("userId",data.data.ID);
			// 		//storage.put("userName", data.data.USERNAME);
			// 		//storage.put("token", data.token);
			// 		////window.location.href = "#/settings";
			// 		//location.reload();

			// 		//var loginAPI = new sap.ui.model.json.JSONModel(data);
			// 		//oModel.setProperty("/userInfo",loginAPI.oData);
			// 		//console.log(oModel);
			// 		// var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// 		storage.remove("userId");
			// 		storage.remove("token");
			// 		storage.remove("userName");
			// 		alert("회원탈퇴가 완료되었습니다.");
			// 		location.reload();
			// 	},
			// 	error: function (xhr, status, error) {
			// 		// 서버 호출 실패 시 처리할 로직
			// 		alert(error);
			// 	}
			// });
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.Settings
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.Settings
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.Settings
		 */
		//	onExit: function() {
		//
		//	}

	});

});