sap.ui.define([
	'sap/ui/demo/cart/controller/BaseController',
	'sap/ui/demo/cart/model/formatter',
	'sap/ui/Device',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel',
], function (BaseController,
			 formatter,
			 Device,
			 Filter,
			 FilterOperator,
			 JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Category", {
		formatter : formatter,

		onInit: function () {
			console.log("onInit");
			var oComponent = this.getOwnerComponent();
			this._sId = "";
			this._router = oComponent.getRouter();
			this._router.getRoute("category").attachMatched(this._loadCategory, this);
	//		this._router.getRoute("product").attachMatched(this._loadCategory, this);
		},

		_loadCategory: function(oEvent) {
			var oProductList = this.getView().byId("productList");
			this._changeNoDataTextToIndicateLoading(oProductList);
			var oBinding = oProductList.getBinding("items");
		//	oBinding.attachDataReceived(this.fnDataReceived, this);
			var sId = oEvent.getParameter("arguments").id;
			this._sId = "Hello";
			this._sProductId = oEvent.getParameter("arguments").productId;
			
			var endPoint = "http://localhost:3000/ui5items/" + sId;
	//		var oCatModel = new JSONModel();
	//		oCatModel.loadData(endPoint);
		//	oCatModel.attachRequestCompleted(function() {
	//	        console.log(oCatModel.getData());
	//	    });
	
			this.getView().byId("productList");
			this.catModel = new JSONModel();
			this.catModel.loadData(endPoint);
			console.log(this.catModel);
			this.getView().setModel(this.catModel, "cat");

			
		},

		_changeNoDataTextToIndicateLoading: function (oList) {
			var sOldNoDataText = oList.getNoDataText();
			oList.setNoDataText("Loading...");
			oList.attachEventOnce("updateFinished", function() {oList.setNoDataText(sOldNoDataText);});
		},

		fnDataReceived: function() {
			console.log("_loadCategory");
			var that = this,
				oList = this.getView().byId("productList");
			var aListItems = oList.getItems();
			aListItems.some(function(oItem) {
				if (oItem.getBindingContext().sPath === "/Products('" + that._sProductId + "')") {
					oList.setSelectedItem(oItem);
					return true;
				}
			
			});
		},

		/**
		 * Event handler to determine which list item is selected
		 * @param {sap.ui.base.Event} oEvent the list select event
		 */
		onProductListSelect : function (oEvent) {
			
			this._showProduct(oEvent);
		},

		/**
		 * Event handler to determine which sap.m.ObjectListItem is pressed
		 * @param {sap.ui.base.Event} oEvent the sap.m.ObjectListItem press event
		 */
		onProductListItemPress : function (oEvent) {
			
			this._showProduct(oEvent);
		},

		_showProduct: function (oEvent) {
			var oIndexLin = oEvent.getParameter("listItem").sId;
			var linLength = oIndexLin.length;
			oIndexLin = oIndexLin.substring(linLength - 1);
			
			//console.log(oEvent.getParameter("listItem").sId);
			//console.log("JSONmodel");
			var oMod = this.catModel.getProperty("/articles/");
			//alert(oMod[oIndexLin]._id);
		//	var oBindContext;
		//	var item = oEvent.getParameter("arguments").id
		//	alert(item);
			/*
			if (sap.ui.Device.system.phone) {
				oBindContext = oEvent.getSource().getBindingContext();
			} else {
				
				oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
			}
			*/
			//console.log("model" + oEvent.getSource().getBindingContext());
			//var oModel = oBindContext.getModel();
			var sCategoryId = oMod[oIndexLin].category;
			var sProductId = oMod[oIndexLin]._id;
			//console.log(this._router);
			this._router.navTo("product", {id: sCategoryId, productId: sProductId}, !Device.system.phone);
		},

		/**
		 * Navigation back to home view
		 */
		onNavButtonPress : function () {
			this.getOwnerComponent().myNavBack();
		},

		/**
		 * Navigation to cart view
		 */
		onCartButtonPress :  function () {
			console.log("onCartButtonPress");
			this._router.navTo("cart");
		},

		/**
		 * Event handler to determine if the sap.m.ToggleButton is pressed or not
		 * @param {sap.ui.base.Event} oEvent sap.m.ToggleButton press event
		 */
		onAvailabilityFilterToggle : function (oEvent) {
			var oList = this.getView().byId("productList");
			var oBinding = oList.getBinding("items");
			var oStatusFilter = new Filter("Status", FilterOperator.EQ, "A");

			if(oEvent.getParameter("pressed")) {
				oBinding.filter([oStatusFilter]);
			}
			else {
				oBinding.filter(null);
			}
		}
	});
});
