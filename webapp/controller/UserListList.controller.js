sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	"HSDEV/HSDEV/module/fetchConn",
	'sap/f/library'
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, f, fioriLibrary) {
	"use strict";
	var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	var token = storage.get("token");
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";

	return Controller.extend("HSDEV.HSDEV.controller.UserListList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.UserListList
		 */
		onInit: function () {
			f.getMethod("http://localhost:3100/admin/userAll", token)
				.then((data) => {
					console.log("Role");
					console.log(data);
					// var par = data;
					var oTable = this.getView().byId("userListTable");
					const userListArray = Object.values(data.data);
					for (var i = 0; i < userListArray.length; i++) {
						// debugger;
						var oRow = userListArray[i];
						console.log(oRow);
						var oTitle = new sap.m.ObjectIdentifier({
							title: oRow.ID
								// text: oRow.NOTICE_CONTENT
						});

						var oUserName = new sap.m.Text({
							text: oRow.USERNAME
						});

						var oAuthor = new sap.m.Text({
							text: oRow.ID
						});

						var oItem = new sap.m.ColumnListItem({
							type: "Active",
							cells: [oTitle, oUserName],
							press: this.onListItemPress.bind(this, data)
						});

						oTable.addItem(oItem);
					}
				})
				.catch((err) => {
					console.log(err);
				})

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
		onListItemPress: function (data, oEvent) {
			console.log("Item Clicked");
			var idx = data.data.findIndex(i => i.ID == oEvent.getSource().mAggregations.cells[0].mProperties.title);
			var clickedRole = oEvent.getSource().mAggregations.cells[0].mProperties.title;
			// console.log("idx : " + idx);
			var model = data.data[idx];
			console.log(model);
			var currUserUUID = model.UUID;
			var RoleArray = [];

			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];

			f.getMethod("http://localhost:3100/admin/currUserRole?USER_UUID=" + model.UUID, token)
				.then((data) => {
					console.log(data);
					var currRole = data.data[0].NAME;

					f.getMethod("http://localhost:3100/admin/roleAll", token)
						.then((data) => {
							// console.log(data);
							const roleArray = Object.values(data.data);
							RoleArray.push(roleArray);
							for (var i = 0; i < roleArray.length; i++) {
								var oRow = roleArray[i];
								console.log(oRow);
								if (oRow.NAME == currRole) {
									var oViewList = new sap.m.InputListItem({
										label: oRow.NAME,
										content: [
											new sap.m.CheckBox({
												selected: true,
												select: function (oEvent) {
													// Checkbox 선택 상태가 변경되었을 때 호출되는 함수
													// oEvent.getSource().getSelected()를 사용하여 선택 상태를 가져올 수 있음
												}
											})
										]
									})
								} else {
									var oViewList = new sap.m.InputListItem({
										label: oRow.NAME,
										content: [
											new sap.m.CheckBox({
												selected: false,
												select: function (oEvent) {
													// Checkbox 선택 상태가 변경되었을 때 호출되는 함수
													// oEvent.getSource().getSelected()를 사용하여 선택 상태를 가져올 수 있음
												}
											})
										]
									})
								}
								detailView.byId("roleDetailPage").addContent(oViewList);
							}
						})
						.catch((err) => {
							console.log(err);
						})
				})
				.catch((err) => {
					console.log(err);
				})
				// var oPanel = new sap.m.Panel({
				// 	headerText: model.NAME
				// });

			// var oText_Content = new sap.m.Text({
			// 	text: model.NOTICE_CONTENT,
			// 	width: "100%",
			// 	wrapping: true,
			// 	renderWhitespace: true
			// });

			var oForm = new sap.ui.layout.form.Form({
				editable: false,
				title: new sap.ui.core.Title({
					text: "유저 정보"
				}),
				layout: new sap.ui.layout.form.ColumnLayout(),
				formContainers: [
					new sap.ui.layout.form.FormContainer({
						formElements: [
							new sap.ui.layout.form.FormElement({
								label: "아이디",
								fields: [
									new sap.m.Text({
										text: model.ID
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "닉네임",
								fields: [
									new sap.m.Text({
										text: model.USERNAME
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "이메일",
								fields: [
									new sap.m.Text({
										text: model.USER_EMAIL
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "휴대전화",
								fields: [
									new sap.m.Text({
										text: model.USER_PHONENUM
									})
								]
							})
						]
					})
				]
			});

			// f.getMethod("http://localhost:3100/admin/roleAll", token)
			// 	.then((data) => {
			// 		console.log(data);
			// 		const roleArray = Object.values(data.data);
			// 		for (var i = 0; i < roleArray.length; i++) {
			// 			var oRow = roleArray[i];
			// 			console.log(oRow);
			// 			if (oRow.NAME == currRole) {
			// 				var oViewList = new sap.m.InputListItem({
			// 					label: oRow.NAME,
			// 					content: [
			// 						new sap.m.CheckBox({
			// 							selected: true, // 초기 선택 상태 설정
			// 							select: function (oEvent) {
			// 								// Checkbox 선택 상태가 변경되었을 때 호출되는 함수
			// 								// oEvent.getSource().getSelected()를 사용하여 선택 상태를 가져올 수 있음
			// 							}
			// 						})
			// 					]
			// 				})
			// 			} else {
			// 				var oViewList = new sap.m.InputListItem({
			// 					label: oRow.NAME,
			// 					content: [
			// 						new sap.m.CheckBox({
			// 							selected: false, // 초기 선택 상태 설정
			// 							select: function (oEvent) {
			// 								// Checkbox 선택 상태가 변경되었을 때 호출되는 함수
			// 								// oEvent.getSource().getSelected()를 사용하여 선택 상태를 가져올 수 있음
			// 							}
			// 						})
			// 					]
			// 				})
			// 			}
			// 			detailView.byId("roleDetailPage").addContent(oViewList);
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	})

			// <!--<List headerText="Input">-->
			// <!--	<InputListItem label="Flight Mode">-->
			// <!--		<CheckBox selected="true"/>-->
			// <!--	</InputListItem>-->
			// <!--</List>-->
			var oEdit = new sap.m.Button({
				text: "수정하기(테스트중)",
				press: this.onRoleEdit.bind(this, currUserUUID, RoleArray)
			});

			var oButton_Close = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://decline",
				press: this.handleClose.bind(this)
			});

			var oButton_Delete = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://delete",
				press: this.onMessageDelete.bind(this, data, idx)
			});
			if (model.CREATED_BY != "TESTUSER") {
				oButton_Delete.setVisible(false);
			}

			var oButton_Edit = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://edit",
				press: this.onEdit.bind(this, data, idx)
			});
			if (model.CREATE_BY != "TESTUSER") {
				oButton_Edit.setVisible(false);
			}

			detailView.byId("roleDetailPage").removeAllContent();
			detailView.byId("roleDetailPage").addContent(oButton_Close);
			detailView.byId("roleDetailPage").addContent(oButton_Delete);
			detailView.byId("roleDetailPage").addContent(oButton_Edit);
			// detailView.byId("detailPage").addContent(oObjectHeader);
			detailView.byId("roleDetailPage").addContent(oForm);
			detailView.byId("roleDetailPage").addContent(oEdit);

			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
		},
		// 버튼 수정중
		onRoleEdit: function (currUserUUID, RoleArray, oEvent) {
			var contents = this.getView().getParent().getParent().getMidColumnPages()[0].getContent()[0].mAggregations.content;
			for (var i = 0; contents.length; i++) {
				var sId = contents[i].sId.indexOf("__item");
				if (sId == 0) {
					if (contents[i].getContent()[0].getSelected()) {
						var name = contents[i].mProperties.label;
						var roleUUID = "";

						for (var j = 0; j < RoleArray[0].length; j++) {
							var oRow = RoleArray[0][j];
							if (oRow.NAME == name) {
								roleUUID = oRow.UUID;
							}
						}

						f.postMethod("http://localhost:3100/admin/currUserRoleEdit", {
								BP_UUID: currUserUUID,
								ROLE_UUID: roleUUID
									// CREATED_DATE: koreanTime
							}, token)
							.then((data) => {
								console.log(data);
								MessageBox.success("권한이 수정되었습니다.", {
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
				}
			}
			// .getAggregation("items");
			// for (var i = 0; i < itemList.length; i++) {
			// 	var checkBox = itemList[i]; // InputListItem 내 CheckBox 가져오기
			// 	console.log(checkBox.getSelected()); // CheckBox의 체크 여부 출력
			// }
		},

		handleClose: function () {
			var oFCL = this.getView().getParent().getParent();
			oFCL.setLayout(sap.f.LayoutType.OneColumn);

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("master");
		},

		onMessageDelete: function (data, idx, oEvent) {
			var that = this;
			MessageBox.warning(
				"해당 공지사항을 삭제하시겠습니까?", {
					icon: MessageBox.Icon.WARNING,
					title: "주의",
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					initialFocus: MessageBox.Action.CANCEL,
					styleClass: sResponsivePaddingClasses,
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.OK) {
							that.onDeleteNotice(data, idx, oEvent);
						} else if (oAction === MessageBox.Action.CANCEL) {
							console.log("Cancel");
						}
					}
				}
			);
		},

		onDeleteNotice: function (data, idx, oEvent) {
			var model = data.data[idx];

			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");
			f.deleteMethod("http://localhost:3100/admin/deleteNotice", {
					TITLE: model.NOTICE_TITLE,
					CONTENT: model.NOTICE_CONTENT
				}, token)
				.then((data) => {
					// console.log(data);
					MessageBox.success("공지사항이 삭제되었습니다.", {
						title: "성공",
						onClose: function (oAction) {
							location.reload();
						}
					});
				})
				.catch((err) => {
					console.log(err);
				});
		},

		onEdit: function (data, idx, oEvent) {
			var model = data.data[idx];
			console.log(model);

			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];
			var oText_Content = new sap.m.TextArea({
				width: "100%",
				height: "80%"
			});

			var oButton_Close = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://decline",
				press: this.handleClose.bind(this)
			});

			var oButton_Delete = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://delete",
				press: this.onDeleteNotice.bind(this, data, idx)
			});

			var oObjectHeader = new sap.m.ObjectHeader({
				title: model.NOTICE_TITLE,
				intro: "공지사항"
			});

			var oSubmit = new sap.m.Button({
				text: "수정하기",
				press: function () {
					var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var token = storage.get("token");

					f.putMethod("https://localhost:3100/admin/editNotice", {
							TITLE: model.NOTICE_TITLE,
							CONTENTS: oText_Content.getValue()
						}, token)
						.then((data) => {
							console.log(data);
							MessageBox.success("수정이 완료되었습니다.", {
								title: "수정 완료",
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
			console.log(model.NOTICE_CONTENT);
			oText_Content.setValue(model.NOTICE_CONTENT);
			detailView.byId("detailPage").removeAllContent();
			detailView.byId("detailPage").addContent(oButton_Close);
			detailView.byId("detailPage").addContent(oButton_Delete);
			detailView.byId("detailPage").addContent(oObjectHeader);
			detailView.byId("detailPage").addContent(oText_Content);
			detailView.byId("detailPage").addContent(oSubmit);
			console.log(detailView);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.UserListList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.UserListList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.UserListList
		 */
		//	onExit: function() {
		//
		//	}

	});

});