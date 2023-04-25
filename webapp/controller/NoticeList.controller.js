sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	"HSDEV/HSDEV/module/fetchConn",
	'sap/f/library'
], function (Controller, Filter, FilterOperator, Sorter, MessageBox, f, fioriLibrary, Card, Item) {
	"use strict";
	var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
	var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	var token = storage.get("token");
	var userId = storage.get("userId");

	return Controller.extend("HSDEV.HSDEV.controller.NoticeList", {
		onInit: function () {
			if (userId != "TESTUSER") {
				this.getView().byId("NoticeAddBtn").setVisible(false);
			}

			f.getMethod("http://localhost:3100/user/notice", token)
				.then((data) => {
					console.log(data);
					// var par = data;
					var oTable = this.getView().byId("noticeTable");
					const noticeArray = Object.values(data.data);
					for (var i = 0; i < noticeArray.length; i++) {
						// debugger;
						var oRow = noticeArray[i];

						var oTitle = new sap.m.ObjectIdentifier({
							title: oRow.NOTICE_TITLE
								// text: oRow.NOTICE_CONTENT
						});

						var oCreatedDate = new sap.m.Text({
							text: oRow.CREATED_DATE
						});

						var oAuthor = new sap.m.Text({
							text: oRow.CREATED_BY
						});

						var oItem = new sap.m.ColumnListItem({
							type: "Active",
							cells: [oTitle, oCreatedDate, oAuthor],
							press: this.onListItemPress.bind(this, data)
						});
						// oItem.attachPress(this.onListItemPress).bind(this);
						oTable.addItem(oItem);
					}
				})
				.catch((err) => {
					console.log(err);
				})
		},

		onListItemPress: function (data, oEvent) {
			// console.log(oEvent.getSource());
			// console.log(oEvent.getSource().mAggregations.cells[0].mProperties.title);
			// console.log(data);
			// console.log(oEvent.getSource().mAggregations.cells[0].sId);
			// var idx = oEvent.getSource().getId().substring(oEvent.getSource().getId().indexOf("m") + 1);
			// console.log(oEvent.getSource().mAggregations.cells[0].sId.replace("__identifier", ""));
			// var idx = oEvent.getSource().mAggregations.cells[0].sId.replace("__identifier", "");
			// console.log(data.data.findIndex(i => i.NOTICE_TITLE == oEvent.getSource().mAggregations.cells[0].mProperties.title));
			var idx = data.data.findIndex(i => i.NOTICE_TITLE == oEvent.getSource().mAggregations.cells[0].mProperties.title);
			// console.log("data : " + data);
			console.log("idx : " + idx);
			var model = data.data[idx];
			console.log(model);
			// console.log(model);
			// console.log("model : " + model);
			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];

			var oPanel = new sap.m.Panel({
				headerText: model.NOTICE_TITLE
			});

			var oText_Content = new sap.m.Text({
				text: model.NOTICE_CONTENT,
				width: "100%",
				wrapping: true,
				renderWhitespace: true
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
			if (userId != "TESTUSER") {
				oButton_Delete.setVisible(false);
			}

			var oButton_Edit = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://edit",
				press: this.onEdit.bind(this, data, idx)
			});
			if (userId != "TESTUSER") {
				oButton_Edit.setVisible(false);
			}
			// var oObjectHeader = new sap.m.ObjectHeader({
			// 	title: model.NOTICE_TITLE,
			// 	intro: "공지사항"
			// });

			oPanel.addContent(oText_Content);

			detailView.byId("detailPage").removeAllContent();
			detailView.byId("detailPage").addContent(oButton_Close);
			detailView.byId("detailPage").addContent(oButton_Delete);
			detailView.byId("detailPage").addContent(oButton_Edit);
			// detailView.byId("detailPage").addContent(oObjectHeader);
			detailView.byId("detailPage").addContent(oPanel);

			// detailView.byId("testLabel").setText(model.NOTICE_TITLE);
			// console.log(detail.byId("testLabel"));
			// var oDetailPage = this.getView().byId("flexibleColumnLayout").getMidColumnPages()[0];
			// console.log(oDetailView);

			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
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

		onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			}

			this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
		},

		onAdd: function () {
			// fiori 스타일 메시지
			// MessageBox.information("This functionality is not ready yet.", {
			// 	title: "Aw, Snap!"
			// });
			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];

			var oButton_Close = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://decline",
				press: this.handleClose.bind(this)
			});

			var oTitle = new sap.m.Label({
				text: "제목"
			});
			var oTitleInput = new sap.m.Input({
				placeholder: "제목을 입력하세요"
			});
			var oContentsTitle = new sap.m.Label({
				text: "내용"
			});
			var oContentsTextArea = new sap.m.TextArea({
				placeholder: "내용을 입력하세요",
				width: "100%",
				height: "500px"
			});
			var oObjectHeader = new sap.m.ObjectHeader();

			var oSubmit = new sap.m.Button({
				text: "제출하기",
				press: function () {
					const now = new Date();
					const options = {
						timeZone: "Asia/Seoul"
					};
					const koreanTime = now.toLocaleString("ko-KR", options);

					f.postMethod("https://localhost:3100/admin/postNotice", {
							TITLE: oTitleInput.getValue(),
							CONTENTS: oContentsTextArea.getValue(),
							CREATED_DATE: koreanTime
						}, token)
						.then((data) => {
							console.log(data);
							MessageBox.success("업로드 되었습니다.", {
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
			detailView.byId("detailPage").removeAllContent();
			detailView.byId("detailPage").addContent(oButton_Close);
			detailView.byId("detailPage").addContent(oObjectHeader);
			detailView.byId("detailPage").addContent(oTitle);
			detailView.byId("detailPage").addContent(oTitleInput);
			detailView.byId("detailPage").addContent(oContentsTitle);
			detailView.byId("detailPage").addContent(oContentsTextArea);
			detailView.byId("detailPage").addContent(oSubmit);

			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
		},

		onReload: function () {
			location.reload();
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oProductsTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
	});
});