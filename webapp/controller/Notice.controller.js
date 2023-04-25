sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn",
	"sap/m/MessageBox",
	"sap/ui/core/XMLComposite"
], function (Controller, f, MessageBox, XMLComposite) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("HSDEV.HSDEV.controller.Notice", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.Notice
		 */
		onInit: function () {
			// var oData = {
			// 	names: [{
			// 		title: "wrapCharLimit is set to Default. Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
			// 		desc: "Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
			// 		icon: "sap-icon://favorite",
			// 		highlight: "Success",
			// 		info: "Completed"
			// 	}, {
			// 		title: "wrapCharLimit is set to 100. Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
			// 		desc: "Lorem ipsum dolor st amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
			// 		icon: "sap-icon://employee",
			// 		highlight: "Error",
			// 		info: "Incomplete",
			// 		wrapCharLimit: 100
			// 	}, {
			// 		title: "Title text",
			// 		desc: "Description text",
			// 		icon: "sap-icon://accept",
			// 		highlight: "Information",
			// 		info: "Information",
			// 		wrapCharLimit: 10
			// 	}]
			// };
			// var oModel = new sap.ui.model.json.JSONModel(oData);
			// this.getView().setModel(oModel);
			// const noticeItem = new sap.m.StandardListItem({
			//     title: item.NOTICE_TITLE,
			//     icon: "sap-icon://employee",
			//     highlight: "Success",
			//     info: "Completed",
			//     press: this.handleItemClick.bind(this)
			// });
			// var oList = this.getView().byId("noticeItem");
			// oList.attachItemPress(this.handleItemClick.bind(this));
			// console.log(this.byId("noticeItem"));

			// 임시 주석 했음.
			// var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			// var token = storage.get("token");

			// f.getMethod("http://localhost:3100/user/notice", token)
			// 	.then((data) => {
			// 		var noticeContainer = this.byId("noticeItem");
			// 		const noticeArray = Object.values(data.data);

			// 		if (window.location.hash == "#/Admin/Notice") {
			// 			const addNoticeBtn = new sap.m.StandardListItem({
			// 				title: "글쓰기",
			// 				icon: "sap-icon://add",
			// 				type: "Active",
			// 				press: this.onAddClick.bind(this)
			// 			});
			// 			noticeContainer.addItem(addNoticeBtn);
			// 		}
			// 		// UIComponent.getRouterFor(this).navToWithoutHash("RouteMainView");
			// 		// oRouter.navTo("main");
			// 		console.log(data);
			// 		// console.log(viewAuthArray);
			// 		noticeArray.forEach((item) => {
			// 			const noticeItem = new sap.m.StandardListItem({
			// 				title: item.NOTICE_TITLE,
			// 				icon: "sap-icon://employee",
			// 				highlight: "Success",
			// 				type: "Active",
			// 				press: this.onItemClick.bind(this),
			// 				info: "Completed"
			// 			});
			// 			noticeItem.setDescription(item.NOTICE_CONTENT);
			// 			noticeItem.setWrapCharLimit(50);
			// 			// navItem.attachAfterNavigate(() => {
			// 			// 	const router = sap.ui.core.UIComponent.getRouterFor(this);
			// 			// 	router.navTo(item.VIEW_PATH);
			// 			// });

			// 			noticeContainer.addItem(noticeItem);
			// 		});
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	})
		},

		onItemClick: function (oEvent) {
			var itemData = oEvent.getSource();
			const title = itemData.getTitle();
			const description = itemData.getDescription();

			var oText = new sap.m.Text({
				text: description,
				width: "100%",
				wrapping: true,
				renderWhitespace: true
			});

			var oObjectHeader = new sap.m.ObjectHeader({
				title: title,
				intro: "공지사항"
			});
			this.getView().byId("detailPage").removeAllContent();
			this.getView().byId("detailPage").addContent(oObjectHeader);
			this.getView().byId("detailPage").addContent(oText);
		},

		onAddClick: function (oEvent) {
			var sId1 = sap.ui.core.Fragment.createId("InputTitle");
			var sId2 = sap.ui.core.Fragment.createId("InputTextArea");

			var oTitle = new sap.m.Label({
				text: "제목"
			});
			var oTitleInput = new sap.m.Input({
				id: sId1,
				placeholder: "제목을 입력하세요"
			});
			var oContentsTitle = new sap.m.Label({
				text: "내용"
			});
			var oContentsTextArea = new sap.m.TextArea({
				id: sId2,
				placeholder: "내용을 입력하세요",
				width: "100%"
			});
			var oSubmit = new sap.m.Button({
				text: "제출하기",
				press: function () {
					var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var token = storage.get("token");

					f.postMethod("https://localhost:3100/admin/postNotice", {
							TITLE: oTitleInput.getValue(),
							CONTENTS: oContentsTextArea.getValue()
						}, token)
						.then((data) => {
							console.log(data);
							MessageBox.success("업로드가 완료되었습니다", {
								title: "성공",
								onClose: function (oAction) {
									location.reload();
								}
							});
						})
						.catch((err) => {
							console.log(err);
							MessageBox.warning(
								"관리자에게 연락바랍니다", {
									icon: MessageBox.Icon.WARNING,
									title: "주의",
									styleClass: sResponsivePaddingClasses
								}
							);
						})
				}
			});
			this.getView().byId("detailPage").removeAllContent();
			this.getView().byId("detailPage").addContent(oTitle);
			this.getView().byId("detailPage").addContent(oTitleInput);
			this.getView().byId("detailPage").addContent(oContentsTitle);
			this.getView().byId("detailPage").addContent(oContentsTextArea);
			this.getView().byId("detailPage").addContent(oSubmit);
		},

		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				productPath = oEvent.getSource().getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detail", {
				layout: oNextUIState.layout,
				product: product
			});

			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			var oParent = oItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oItem);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.Notice
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.Notice
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.Notice
		 */
		//	onExit: function() {
		//
		//	}

	});

});