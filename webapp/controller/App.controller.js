sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"HSDEV/HSDEV/module/fetchConn"
], function (Controller, MessageBox, f) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	return Controller.extend("HSDEV.HSDEV.controller.App", {
		onInit: function () {
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");
			var init = storage.get("init");
			if (token == null) {
				window.location.href = "./login.html";
				MessageBox.warning(
					"로그인이 필요합니다", {
						icon: MessageBox.Icon.WARNING,
						title: "주의",
						styleClass: sResponsivePaddingClasses
					}
				);
			} else {
				f.getMethod("http://localhost:3100/user/isLogin", token)
					.then((data) => {
						var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
						var userId = storage.get("userId");

						f.postMethod("http://localhost:3100/user/view", {
								ID: userId
							}, token)
							.then((data) => {
								// console.log(data);
								if (init == null) {
									if (data.data.viewAuth[0].VIEWNAME == "Admin") {
										window.location.href = "./index.html#/Admin/Home";
									} else {
										window.location.href = "./index.html#/User/Home";
									}
									storage.put("init", "X");
								}
								const navList = this.byId("navTest");
								const viewAuthArray = Object.values(data.data.viewAuth[0].VIEW_PATH);

								viewAuthArray.forEach((item) => {
									const navItem = new sap.tnt.NavigationListItem({
										text: item.VIEWNAME,
										icon: item.VIEW_ICON,
										key: item.VIEWNAME
									});

									navItem.setHref("#/" + item.VIEW_PATH);

									navList.addItem(navItem);
								});
							})
							.catch((err) => console.log(err))
					})
					.catch((err) => {
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
						window.location.href = "./login.html";
					})
			}
		},

		onLogout: function () {
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			storage.remove("userId");
			storage.remove("token");
			storage.remove("userName");
			storage.remove("init");
			MessageBox.success(
				"로그아웃 되었습니다", {
					icon: MessageBox.Icon.SUCCESS,
					title: "성공",
					styleClass: sResponsivePaddingClasses,
					onClose: function (oAction) {
						location.reload();
					}
				}
			);
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},
	});
});