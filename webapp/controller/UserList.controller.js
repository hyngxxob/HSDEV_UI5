sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn",
	"sap/m/MessageBox",
], function (Controller, f, MessageBox) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("HSDEV.HSDEV.controller.UserList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.UserList
		 */
		onInit: function () {
			// var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// var token = storage.get("token");

			// f.getMethod("http://localhost:3100/admin/userAll", token)
			// 	.then((data) => {
			// 		// UIComponent.getRouterFor(this).navToWithoutHash("RouteMainView");
			// 		// oRouter.navTo("main");
			// 		console.log(data);
			// 		var userListContainer = this.byId("UserList");
			// 		const userArray = Object.values(data.data);
			// 		console.log(userArray);
			// 		userArray.forEach((item) => {
			// 			const userItem = new sap.m.FeedListItem({
			// 				sender: item.ID,
			// 				text: item.USERNAME,
			// 				icon: "sap-icon://employee"
			// 			});
			// 			// noticeItem.setDescription(item.NOTICE_CONTENT);
			// 			// noticeItem.setWrapCharLimit(50);
			// 			// navItem.attachAfterNavigate(() => {
			// 			// 	const router = sap.ui.core.UIComponent.getRouterFor(this);
			// 			// 	router.navTo(item.VIEW_PATH);
			// 			// });

			// 			userListContainer.addItem(userItem);
			// 		});
			// 	})
			// 	.catch((err) => {
			// 		if (err.message.includes("jwt expired")) {
			// 			MessageBox.warning(
			// 				"세션이 만료되었습니다", {
			// 					icon: MessageBox.Icon.WARNING,
			// 					title: "주의",
			// 					styleClass: sResponsivePaddingClasses
			// 				}
			// 			);
			// 			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// 			storage.remove("userId");
			// 			storage.remove("token");
			// 			storage.remove("userName");
			// 			storage.remove("init");
			// 		}
			// 		if (err.message.includes("Verify Token fail")) {
			// 			MessageBox.warning(
			// 				"로그인이 필요합니다", {
			// 					icon: MessageBox.Icon.WARNING,
			// 					title: "주의",
			// 					styleClass: sResponsivePaddingClasses
			// 				}
			// 			);
			// 		}
			// 		window.location.href = "./login.html";
			// 	})
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.UserList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.UserList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.UserList
		 */
		//	onExit: function() {
		//
		//	}

	});

});