sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn"
], function (Controller, f) {
	"use strict";

	return Controller.extend("HSDEV.HSDEV.controller.BusinessRole", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.BusinessRole
		 */
		onInit: function () {
			// var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// var token = storage.get("token");

			// // 일단 개발 중단
			// f.getMethod("http://localhost:3100/admin/roleAll", token)
			// 	.then((data) => {
			// 		// UIComponent.getRouterFor(this).navToWithoutHash("RouteMainView");
			// 		// oRouter.navTo("main");
			// 		console.log(data);
			// 		var oTable = this.getView().byId("RoleListTable");
			// 		const roleArray = Object.values(data.data);
			// 		for (var i = 0; i < roleArray.length; i++) {
			// 			// debugger;
			// 			var oRow = roleArray[i];
			// 			var oTitle = new sap.m.ObjectIdentifier({
			// 				title: oRow.NAME
			// 					// text: oRow.NOTICE_CONTENT
			// 			});
			// 			var oText = new sap.m.Text({
			// 				text: oRow.CREATE_BY
			// 			})
			// 			var oItem = new sap.m.ColumnListItem({
			// 				type: "Active",
			// 				cells: [oTitle, oText]
			// 			});
			// 			// oItem.attachPress(this.onListItemPress).bind(this);
			// 			oTable.addItem(oItem);
			// 		}
			// 		// var RoleListTable = this.byId("RoleListTable");
			// 		// const roleArray = Object.values(data.data);
			// 		// console.log(roleArray);
			// 		// console.log(RoleListTable.getModel());

			// 		// console.log(new sap.ui.model.json.JSONModel(data));

			// 		// RoleListTable.addItems(data.data);

			// 		// 3. 새로운 데이터를 담을 TableRowItem 인스턴스를 생성한다.
			// 		// const oRow = new sap.m.ColumnListItem();

			// 		// // 4. TableRowItem에 컬럼 컨트롤을 추가한다.
			// 		// oRow.addCell(new sap.m.Text({
			// 		// 	text: data.data.NAME
			// 		// }));
			// 		// oRow.addCell(new sap.m.Text({
			// 		// 	text: data.data.CREATE_BY
			// 		// }));

			// 		// // 5. 테이블 인스턴스의 aggregation인 items에 TableRowItem 인스턴스를 추가한다.
			// 		// RoleListTable.addRow(oRow);

			// 		// roleArray.forEach((item) => {
			// 		// 	// const userItem = new sap.m.FeedListItem({
			// 		// 	// 	sender: item.ID,
			// 		// 	// 	text: item.USERNAME,
			// 		// 	// 	icon: "sap-icon://employee"
			// 		// 	// });
			// 		// 	// noticeItem.setDescription(item.NOTICE_CONTENT);
			// 		// 	// noticeItem.setWrapCharLimit(50);
			// 		// 	// navItem.attachAfterNavigate(() => {
			// 		// 	// 	const router = sap.ui.core.UIComponent.getRouterFor(this);
			// 		// 	// 	router.navTo(item.VIEW_PATH);
			// 		// 	// });

			// 		// 	// userListContainer.addItem(userItem);

			// 		// });
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	})
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.BusinessRole
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.BusinessRole
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.BusinessRole
		 */
		//	onExit: function() {
		//
		//	}

	});

});