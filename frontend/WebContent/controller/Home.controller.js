sap.ui.define([
	'sap/ui/demo/cart/controller/BaseController',
	'sap/ui/demo/cart/model/formatter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel',
	'sap/ui/demo/cart/model/cart',
	'sap/ui/demo/cart/model/LocalStorageModel'
], function (BaseController,
			 formatter,
			 Filter,
			 FilterOperator,
			 JSONModel,
			 cart,
			 LocalStorageModel) {
			 
	"use strict";

	return BaseController.extend("sap.ui.demo.cart.controller.Home", {
		formatter : formatter,
		cart: cart,

		onInit: function () {

			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
// trigger first search to set visibilities right
//initialize the model
			/**
			 * get the data from Mongo
			 */	
			var oCartModel = new LocalStorageModel("SHOPPING_CART", {
				cartEntries: {},
				savedForLaterEntries: {},
				showEditButton: false,
				showProceedButton: false
			});
			this.setModel(oCartModel, "cartProducts");
			var oResourceBundle = this.getOwnerComponent().getModel("i18n")
			.getResourceBundle();
		    var oMongoCartModel = new JSONModel();
			//var oMongoCartModel = this.getView().getModel("sCart");;
			var oCartModel = this.getView().getModel("cartProducts");
			console.log(this);
			//create and set cart model
			console.log("mode" + oMongoCartModel);
			oMongoCartModel.loadData("http://localhost:3000/ui5Cart");
			console.log("OBS");
			console.log(oMongoCartModel);
			oMongoCartModel.attachRequestCompleted(function() {
				var obj = jQuery.parseJSON(oMongoCartModel.getJSON());
			    $.each(obj.cart.items, function(key,value) {
			    	var oProduct = new JSONModel({"details":value});
					  cart.addToCart(oResourceBundle, oProduct, oCartModel);
			    }); 

		    });
				
			/*
			 * get the data from the cart and pass to the session model
			 */
		
//end initialize the model			
			this._search();
		},

		onSearch: function () {
			this._search();
		},

		onRefresh: function () {
			var that = this;

			// trigger search again and hide pullToRefresh when data ready
			var oProductList = this.getView().byId("productList");
			var oBinding = oProductList.getBinding("items");
			var fnHandler = function () {
				that.getView().byId("pullToRefresh").hide();
				oBinding.detachDataReceived(fnHandler);
			};
			oBinding.attachDataReceived(fnHandler);
			that._search();
		},

		_search: function () {
			var oView = this.getView();
			var oProductList = oView.byId("productList");
			var oCategoryList = oView.byId("categoryList");
			var oSearchField = oView.byId("searchField");
			
			// switch visibility of lists
			var bShowSearchResults = oSearchField.getValue().length !== 0;
			oProductList.setVisible(bShowSearchResults);
			oCategoryList.setVisible(!bShowSearchResults);

			if (bShowSearchResults) {
				this._changeNoDataTextToIndicateLoading(oProductList);
			}

			// filter product list
			var oBinding = oProductList.getBinding("items");
			if (oBinding) {
				if (bShowSearchResults) {
					var oFilter = new Filter("Name", FilterOperator.Contains, oSearchField.getValue());
					oBinding.filter([oFilter]);
				} else {
					oBinding.filter([]);
				}
			}
		},

		_changeNoDataTextToIndicateLoading: function (oList) {
			var sOldNoDataText = oList.getNoDataText();
			oList.setNoDataText("Loading...");
			oList.attachEventOnce("updateFinished", function () {
				oList.setNoDataText(sOldNoDataText);
			});
		},

		onCategoryListItemPress: function (oEvent) {
			var oBindContext = oEvent.getSource().getBindingContext();
			var sCategoryId = oBindContext.getProperty("_id");
			this._router.navTo("category", {id: sCategoryId});
		},

		onProductListSelect: function (oEvent) {
			var oItem = oEvent.getParameter("listItem");
			this._showProduct(oItem);
		},

		onProductListItemPress: function (oEvent) {
			var oItem = oEvent.getSource();
			this._showProduct(oItem);
		},

		_showProduct: function (oItem) {
			var oBindContext = oItem.getBindingContext();
			var oModel = oBindContext.getModel();
			var sId = oModel.getData(oBindContext.getPath()).ProductId;
			this._router.navTo("cartProduct", {productId: sId}, !sap.ui.Device.system.phone);
		},

		onNavButtonPress : function () {
			this.getOwnerComponent().myNavBack();
		},

		onCartButtonPress: function () {
			this._router.navTo("cart");
		}
	});
});