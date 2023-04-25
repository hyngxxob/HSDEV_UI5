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
	var userId = storage.get("userId");

	return Controller.extend("HSDEV.HSDEV.controller.UserBoardList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.UserBoardList
		 */
		onInit: function () {
			var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var token = storage.get("token");
			//19
			f.getMethod("http://localhost:3100/user/board", token)
				.then((data) => {
					console.log(data);
					// var par = data;
					var oTable = this.getView().byId("boardTable");
					const boardArray = Object.values(data.data);
					for (var i = 0; i < boardArray.length; i++) {
						// debugger;
						var oRow = boardArray[i];
						var extractDate = oRow.BOARD_CREATED_AT.substring(0, 19);
						var parseDate = new Date(extractDate);

						var oBoardNum = new sap.m.Text({
							text: oRow.BOARD_ID
						});
						var oTitle = new sap.m.ObjectIdentifier({
							title: oRow.BOARD_TITLE
								// text: oRow.NOTICE_CONTENT
						});
						var oCreatedDate = new sap.m.Text({
							text: parseDate
						});
						var oBoardAuthor = new sap.m.Text({
							text: oRow.BOARD_AUTHOR
						});
						var oItem = new sap.m.ColumnListItem({
							type: "Active",
							cells: [oBoardNum, oTitle, oCreatedDate, oBoardAuthor],
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
			console.log("List 선택됨");
			var idx = data.data.findIndex(i => i.BOARD_ID == oEvent.getSource().mAggregations.cells[0].mProperties.text);
			var model = data.data[idx];
			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];

			var oPanel = new sap.m.Panel({
				headerText: model.BOARD_TITLE
			});

			var oText_Content = new sap.m.Text({
				text: model.BOARD_CONTENT,
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
			if (model.BOARD_AUTHOR != "TESTUSER") {
				oButton_Delete.setVisible(false);
			}

			var oButton_Edit = new sap.m.OverflowToolbarButton({
				type: "Transparent",
				icon: "sap-icon://edit",
				press: this.onEdit.bind(this, data, idx)
			});
			if (model.BOARD_AUTHOR != "TESTUSER") {
				oButton_Edit.setVisible(false);
			}

			var oObjectHeader = new sap.m.ObjectHeader({
				title: model.BOARD_TITLE,
				intro: "게시판"
			});

			var oFeedInput = new sap.m.FeedInput({
				post: this.onPostComment.bind(this, data, idx)
			});

			oPanel.addContent(oText_Content);

			detailView.byId("boardDetailPage").removeAllContent();
			detailView.byId("boardDetailPage").addContent(oButton_Close);
			detailView.byId("boardDetailPage").addContent(oButton_Delete);
			detailView.byId("boardDetailPage").addContent(oButton_Edit);
			// detailView.byId("boardDetailPage").addContent(oObjectHeader);
			detailView.byId("boardDetailPage").addContent(oPanel);
			// detailView.byId("boardDetailPage").addContent(oText_Content);
			detailView.byId("boardDetailPage").addContent(oFeedInput);

			var setUrl = "http://localhost:3100/user/boardComment?boardUUID=" + model.BOARD_UUID;

			f.getMethod(setUrl, token)
				.then((data) => {
					const commentArray = Object.values(data.data);
					var sortedArray = commentArray.sort((a, b) => {
						if (a.COMMENT_CREATED_AT < b.COMMENT_CREATED_AT) return 1;
						if (a.COMMENT_CREATED_AT > b.COMMENT_CREATED_AT) return -1;
						return 0;
					})

					var oList = new sap.m.List({
						showSeparators: "Inner",
					});

					for (var i = 0; i < commentArray.length; i++) {
						var oRow = commentArray[i];
						// List Item 생성
						var oFeedListItem = new sap.m.FeedListItem({
							sender: oRow.COMMENT_WRITER,
							icon: "sap-icon://employee",
							text: oRow.COMMENT_CONTENT,
							timestamp: oRow.COMMENT_CREATED_AT
						});
						oList.addItem(oFeedListItem);
					}
					// List에 List Item 추가
					detailView.byId("boardDetailPage").addContent(oList);
				})
				.catch((err) => {
					console.log(err);
				})

			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
		},

		onPostComment: function (data, idx, oEvent) {
			console.log("post");
			var that = this;
			var detailView = that.getView().getParent().getParent().getMidColumnPages()[0];
			var InputComment = oEvent.getParameter("value");
			// var currentDate = new Date();
			const now = new Date();
			const options = {
				timeZone: "Asia/Seoul"
			};
			const koreanTime = now.toLocaleString("ko-KR", options);

			var model = data.data[idx];
			console.log(model);

			f.postMethod("https://localhost:3100/user/boardComment", {
					BOARD_UUID: model.BOARD_UUID,
					COMMENT_CONTENT: InputComment,
					COMMENT_CREATED_AT: koreanTime,
					COMMENT_UPDATED_AT: koreanTime,
				}, token)
				.then((data) => {
					console.log(data);
					MessageBox.success("댓글이 작성되었습니다.", {
						title: "성공",
						onClose: function (oAction) {
							// location.reload();
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
		},

		handleClose: function () {
			var oFCL = this.getView().getParent().getParent();
			oFCL.setLayout(sap.f.LayoutType.OneColumn);

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("master");
		},

		onMessageDelete: function (data, idx, oEvent) {
			var that = this;
			var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
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
			console.log(model);

			f.deleteMethod("http://localhost:3100/user/board", {
					BOARD_ID: model.BOARD_ID,
					BOARD_UUID: model.BOARD_UUID
				}, token)
				.then((data) => {
					// console.log(data);
					MessageBox.success("공지사항이 삭제되었습니다", {
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
				title: model.BOARD_TITLE,
				intro: "공지사항"
			});

			var oSubmit = new sap.m.Button({
				text: "수정하기",
				press: function () {
					var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var token = storage.get("token");

					f.putMethod("https://localhost:3100/user/board", {
							BOARD_ID: model.BOARD_ID,
							BOARD_CONTENT: oText_Content.getValue()
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
			console.log(model.BOARD_CONTENT);
			oText_Content.setValue(model.BOARD_CONTENT);
			detailView.byId("boardDetailPage").removeAllContent();
			detailView.byId("boardDetailPage").addContent(oButton_Close);
			detailView.byId("boardDetailPage").addContent(oButton_Delete);
			detailView.byId("boardDetailPage").addContent(oObjectHeader);
			detailView.byId("boardDetailPage").addContent(oText_Content);
			detailView.byId("boardDetailPage").addContent(oSubmit);
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
					var storage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var token = storage.get("token");

					f.postMethod("https://localhost:3100/user/board", {
							BOARD_TITLE: oTitleInput.getValue(),
							BOARD_CONTENT: oContentsTextArea.getValue()
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
			detailView.byId("boardDetailPage").removeAllContent();
			detailView.byId("boardDetailPage").addContent(oButton_Close);
			detailView.byId("boardDetailPage").addContent(oObjectHeader);
			detailView.byId("boardDetailPage").addContent(oTitle);
			detailView.byId("boardDetailPage").addContent(oTitleInput);
			detailView.byId("boardDetailPage").addContent(oContentsTitle);
			detailView.byId("boardDetailPage").addContent(oContentsTextArea);
			detailView.byId("boardDetailPage").addContent(oSubmit);

			var oFCL = this.oView.getParent().getParent();
			oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf HSDEV.HSDEV.view.UserBoardList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.UserBoardList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.UserBoardList
		 */
		//	onExit: function() {
		//
		//	}

	});

});