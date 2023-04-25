sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"HSDEV/HSDEV/module/fetchConn"
], function (Controller, JSONModel, MessageBox, f) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("HSDEV.HSDEV.controller.profile.UserProfileController", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf JMC_HOME.JMC_HOME.view.hierarchyView
		 */
		// oEvent.getSource().getModel().getData() -> 현재 모델 데이터 정보
		// oEvent.getSource().getText() 현재 누른 곳의 text
		// oEvent.getSource().getBindingContext().getObject() 현재 누른 곳의 obj 정보
		onInit: function () {
			console.log("enter profile controller");
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");

			f.getMethod("http://localhost:3100/user/info", token)
				.then((data) => {
					console.log(data);

					// this.byId("settingHeaderTitle").setExpandedHeading(new sap.m.Title({
					// 	text: data.data.ID,
					// 	wrapping: true
					// }));
					// this.byId("settingHeaderTitle").setSnappedHeading(new sap.m.Title({
					// 	text: data.data.ID,
					// 	wrapping: true
					// }));
					// this.getView().byId("expandedUserImg").setSrc("./test-resources/sap/uxap/images/imageID_275314.png");
					// this.byId("expandedContentUserName").setText(data.data.USERNAME);
					// this.byId("snappedContentUserName").setText(data.data.USERNAME);
					this.byId("inputUserId").setValue(data.data.ID);
					this.byId("inputUserName").setValue(data.data.USERNAME);
					this.byId("inputUserEmail").setValue(data.data.USER_EMAIL);
					this.byId("inputUserPhoneNum").setValue(data.data.USER_PHONENUM);
				})
				.catch((err) => {
					console.log(err);
				})
		},

		onEdit: function () {
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");

			var oTextField_name = this.byId("inputUserName");
			var oTextField_email = this.byId("inputUserEmail");
			var oTextField_phone = this.byId("inputUserPhoneNum");
			if (oTextField_name.getEditable() && oTextField_email.getEditable() && oTextField_phone.getEditable()) {
				var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				var token = storage.get("token");
				var userId = this.getView().byId("inputUserId").getValue();
				var userName = this.getView().byId("inputUserName").getValue();
				var userEmail = this.getView().byId("inputUserEmail").getValue();
				var userPhone = this.getView().byId("inputUserPhoneNum").getValue();
				// var userPw = this.getView().byId("userPw").getValue();
				// var userName = this.getView().byId("userName").getValue();
				// var that = this;

				// var setData = "{\"ID\":\"" + userId + "\",\"USERNAME\":\"" + userName + "\"}";
				// + "\",\"PWD\":\"" + userPw + "\"}";

				f.putMethod("http://localhost:3100/user/info", {
						// fetch.postMethod("localhost:3100", "user/login", {
						USERNAME: userName,
						USER_EMAIL: userEmail,
						USER_PHONENUM: userPhone
					}, token)
					.then((data) => {
						console.log(data);
						// oTextField_id.setEditable(false);
						oTextField_name.setEditable(false);
						oTextField_email.setEditable(false);
						oTextField_phone.setEditable(false);

						storage.put("userName", userName);

						MessageBox.success("수정이 완료되었습니다", {
							title: "성공",
							onClose: function (oAction) {
								location.reload();
							}
						});
					})
					.catch((err) => console.log(err))

			} else {
				// oTextField_id.setEditable(true);
				oTextField_name.setEditable(true);
				oTextField_email.setEditable(true);
				oTextField_phone.setEditable(true);
			}
		},

		onAfterRendering: function () {

		},

	});

});