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
	return Controller.extend("HSDEV.HSDEV.controller.BusinessRoleList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf HSDEV.HSDEV.view.BusinessRoleList
		 */
		onInit: function () {
			f.getMethod("http://localhost:3100/admin/roleAll", token)
				.then((data) => {
					console.log("Role");
					console.log(data);
					// var par = data;
					var oTable = this.getView().byId("rollTable");
					const roleArray = Object.values(data.data);
					for (var i = 0; i < roleArray.length; i++) {
						// debugger;
						var oRow = roleArray[i];

						var oTitle = new sap.m.ObjectIdentifier({
							title: oRow.NAME
								// text: oRow.NOTICE_CONTENT
						});

						var oCreatedDate = new sap.m.Text({
							text: oRow.CREATE_DATE
						});

						var oAuthor = new sap.m.Text({
							text: oRow.CREATE_BY
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

		// <f:Form id="FormDisplayColumn_oneGroup" editable="false">
		// 				<f:title>
		// 					<core:Title text="Address"/>
		// 				</f:title>
		// 				<f:layout>
		// 					<f:ColumnLayout/>
		// 				</f:layout>
		// 				<f:formContainers>
		// 					<f:FormContainer>
		// 						<f:formElements>
		// 							<f:FormElement label="Name">
		// 								<f:fields>
		// 									<Text text="{SupplierName}" id="nameText"/>
		// 								</f:fields>
		// 							</f:FormElement>
		// 							<f:FormElement label="Street">
		// 								<f:fields>
		// 									<Text text="{Street} {HouseNumber}"/>
		// 								</f:fields>
		// 							</f:FormElement>
		// 							<f:FormElement label="ZIP Code/City">
		// 								<f:fields>
		// 									<Text text="{ZIPCode} {City}"/>
		// 								</f:fields>
		// 							</f:FormElement>
		// 							<f:FormElement label="Country">
		// 								<f:fields>
		// 									<Text text="{Country}" id="countryText"/>
		// 								</f:fields>
		// 							</f:FormElement>
		// 						</f:formElements>
		// 					</f:FormContainer>
		// 				</f:formContainers>
		// 			</f:Form>
		onListItemPress: function (data, oEvent) {
			console.log("Item Clicked");
			var idx = data.data.findIndex(i => i.NAME == oEvent.getSource().mAggregations.cells[0].mProperties.title);
			var clickedRole = oEvent.getSource().mAggregations.cells[0].mProperties.title;
			console.log("idx : " + idx);
			var model = data.data[idx];
			console.log(model);
			var detailView = this.getView().getParent().getParent().getMidColumnPages()[0];

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
					text: model.NAME
				}),
				layout: new sap.ui.layout.form.ColumnLayout(),
				formContainers: [
					new sap.ui.layout.form.FormContainer({
						formElements: [
							new sap.ui.layout.form.FormElement({
								label: "생성자",
								fields: [
									new sap.m.Text({
										text: model.CREATE_BY
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "생성일",
								fields: [
									new sap.m.Text({
										text: model.CREATE_DATE
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "수정자",
								fields: [
									new sap.m.Text({
										text: model.MODIFY_BY
									})
								]
							}),
							new sap.ui.layout.form.FormElement({
								label: "수정일",
								fields: [
									new sap.m.Text({
										text: model.MODIFY_DATE
									})
								]
							})
						]
					})
				]
			});

			f.getMethod("http://localhost:3100/admin/viewAll?ROLE_UUID=" + model.UUID, token)
				.then((data) => {
					console.log(data);
					const viewArray = Object.values(data.data).sort((a, b) => {
						if (a.SEQ > b.SEQ) return 1;
						if (a.SEQ < b.SEQ) return -1;
						return 0;
					});
					for (var i = 0; i < viewArray.length; i++) {
						var oRow = viewArray[i];

						if (oRow.PAR_UUID != "") {
							var oViewList = new sap.m.InputListItem({
								label: oRow.VIEW_NAME,
								content: [
									new sap.m.CheckBox({
										selected: false, // 초기 선택 상태 설정
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

			// <!--<List headerText="Input">-->
			// <!--	<InputListItem label="Flight Mode">-->
			// <!--		<CheckBox selected="true"/>-->
			// <!--	</InputListItem>-->
			// <!--</List>-->

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

					f.putMethod("https://f2be-175-193-135-160.jp.ngrok.io/admin/editNotice", {
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
		 * @memberOf HSDEV.HSDEV.view.BusinessRoleList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf HSDEV.HSDEV.view.BusinessRoleList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf HSDEV.HSDEV.view.BusinessRoleList
		 */
		//	onExit: function() {
		//
		//	}

	});

});