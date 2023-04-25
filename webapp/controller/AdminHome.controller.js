sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"HSDEV/HSDEV/module/fetchConn",
	"HSDEV/HSDEV/module/setHomeCardJson",
	"sap/ui/model/json/JSONModel",
	"sap/ui/integration/widgets/Card",
	"sap/ui/core/Item"
], function (Controller, f, hcj, JSONModel, Card, Item) {
	"use strict";
	var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	var token = storage.get("token");
	var userName = storage.get("userName");

	return Controller.extend("HSDEV.HSDEV.controller.AdminHome", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.AdminHome
		 */
		onInit: function () {
			if (token != null) {
				f.getMethod("http://localhost:3100/user/isLogin", token)
					.then((data) => {
						console.log(data);
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
			// console.log(this.getView().byId("slideTile"));
			var slideTileContainer = this.getView().byId("slideTile");

			this.getView().byId("homeHeaderTitle").setText(userName + " 님, 안녕하세요!");
			var oModel = new JSONModel(sap.ui.require.toUrl("HSDEV/HSDEV/model/data.json"));
			this.getView().setModel(oModel);
			var oCardManifests = new JSONModel(sap.ui.require.toUrl("HSDEV/HSDEV/model/cardManifests.json"));
			this.getView().setModel(oCardManifests, "manifests");

			f.getMethod("http://localhost:3100/admin/homeRecentPostCnt", token)
				.then((data) => {
					var recentBoardCnt = data.noticeCnt.length;
					var recentNoticeCnt = data.boardCnt.length;

					var oRecentCardModel = new sap.ui.model.json.JSONModel();
					var result = hcj.setRecentBoardCard(recentBoardCnt, recentNoticeCnt);
					oRecentCardModel.setData(result);
					this.getView().setModel(oRecentCardModel, "recentPost");

					if (recentBoardCnt > 0 || recentNoticeCnt > 0) {
						console.log("entered");
						var recentPostCard = this.getView().byId("recentPostCard");

						var oBadgeCustomData = new sap.m.BadgeCustomData({
							key: "myBadgeCustomData",
							value: "new"
						});

						recentPostCard.addCustomData(oBadgeCustomData);
					}
				})
				.catch((err) => {
					console.log(err);
				})

			f.getMethod("http://localhost:3100/admin/homeUserList", token)
				.then((data) => {
					console.log(data);
					var oCurrUserListCardModel = new sap.ui.model.json.JSONModel();
					var result = hcj.setCurrentUserListCard(data);
					oCurrUserListCardModel.setData(result);
					this.getView().setModel(oCurrUserListCardModel, "currUserList");
				})
				.catch((err) => {
					console.log(err);
				})

			const apiKey = "3cb5154340c94c3e87cfa9aa880bd86b";
			f.getMethod("/googleNews?country=kr&category=general&apiKey=" + apiKey)
				.then((data) => {
					// console.log(data);
					const newsArray = Object.values(data.articles);
					// console.log(newsArray);
					for (var i = 0; i < newsArray.length; i++) {
						// debugger;
						var oRow = newsArray[i];
						// console.log(oRow);
						// debugger;
						// console.log(oRow.publishedAt);
						var gt = new sap.m.GenericTile({
							// header: "Generic Tile Header",
							// subheader: "Generic Tile Subheader",
							backgroundImage: "test-resources/sap/m/demokit/sample/SlideTile/images/NewsImage1.png",

							//클로저(closure) 때문에 bind
							press: function (url) {
								window.open(url);
							}.bind(this, oRow.url),
							frameType: "TwoByOne",
							tileContent: [
								new sap.m.TileContent({
									// unit: "EUR",
									// size: "Auto",
									// footer: "Tile Content Footer",
									footer: oRow.publishedAt.substring(0, oRow.publishedAt.indexOf("T")),
									content: [
										// new sap.m.Image({
										// 	src: "path/to/image.jpg",
										// 	width: "100%"
										// })
										new sap.m.NewsContent({
											// contentText: "News Content Text",
											contentText: oRow.title,
											// subheader: "News Content Subheader",
											subheader: oRow.author
												// content: [
												// 	new sap.m.Image({
												// 		src: "path/to/image.jpg",
												// 		width: "100%"
												// 	})
												// ]
										})
									]
								})
							]
						});
						slideTileContainer.addTile(gt);
					}
				})
				.catch((err) => {
					console.log(err);
				})

			// var url = "/googleNews?sources=google-news&apiKey=" + apiKey;

			// $.ajax({
			// 	url: url,
			// 	type: "GET",
			// 	success: function (data) {
			// 		var articles = data.articles;
			// 		var randomIndex = Math.floor(Math.random() * articles.length);
			// 		var randomArticle = articles[randomIndex];
			// 		console.log("news");
			// 		console.log(randomArticle);
			// 		// Display the random article in UI5
			// 	},
			// 	error: function (err) {
			// 		console.log(err);
			// 	}
			// });
		},

		onDrop: function (oInfo) {
			var oDragged = oInfo.getParameter("draggedControl"),
				oDropped = oInfo.getParameter("droppedControl"),
				sInsertPosition = oInfo.getParameter("dropPosition"),
				oGrid = oDragged.getParent(),
				oModel = this.getView().getModel(),
				aItems = oModel.getProperty("/items"),
				iDragPosition = oGrid.indexOfItem(oDragged),
				iDropPosition = oGrid.indexOfItem(oDropped);

			// remove the item
			var oItem = aItems[iDragPosition];
			aItems.splice(iDragPosition, 1);

			if (iDragPosition < iDropPosition) {
				iDropPosition--;
			}

			// insert the control in target aggregation
			if (sInsertPosition === "Before") {
				aItems.splice(iDropPosition, 0, oItem);
			} else {
				aItems.splice(iDropPosition + 1, 0, oItem);
			}

			oModel.setProperty("/items", aItems);
		},

		navToSettings: function () {
			location.href = "#/Admin/Settings";
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.AdminHome
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.AdminHome
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.AdminHome
		 */
		//	onExit: function() {
		//
		//	}

	});

});