sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var UserProfile = BlockBase.extend("HSDEV.HSDEV.tabs.profile.UserProfile", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "HSDEV.HSDEV.tabs.profile.UserProfile",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "HSDEV.HSDEV.tabs.profile.UserProfileS",
					type: ViewType.XML
				}
			}
		}
	});
	return UserProfile;
});