sap.ui.define([ 'jquery.sap.global',
		'sap/ui/demo/cart/controller/BaseController',
		'sap/ui/demo/cart/model/formatter', 'sap/ui/demo/cart/model/cart',
		'sap/m/MessageToast', 'sap/m/MessageBox', 'sap/ui/model/json/JSONModel'

], function($, BaseController, formatter, cart, MessageToast, MessageBox,
		JSONModel) {
	return BaseController.extend("sap.ui.demo.cart.controller.Product", {
		formatter : formatter,
		cart : cart,

		onInit : function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("product").attachMatched(
					this._routePatternMatched, this);
			this._router.getRoute("cartProduct").attachMatched(
					this._routePatternMatched, this);

			// register for events
			var oBus = sap.ui.getCore().getEventBus();
			oBus.subscribe("shoppingCart", "updateProduct",
					this.fnUpdateProduct, this);
		},

		_routePatternMatched : function(oEvent) {
			var sId = oEvent.getParameter("arguments").productId, 
			oView = this.getView(),
			sEndPoint = "http://localhost:3000/ui5itemsDesc/" + sId;
			console.log(sEndPoint);
			oProdModel = this.getView().getModel("det");
			oProdModel.loadData(sEndPoint);
		},

		fnUpdateProduct : function(sChannel, sEvent, oData) {
			
			console.log("event:" + sEvent);
			//var sId = sEvent.getParameter("arguments").productId, 
			var sId = oData.productId, 
			oView = this.getView(),
			sEndPoint = "http://localhost:3000/ui5itemsDesc/" + sId;
			console.log(sEndPoint);
			oProdModel = this.getView().getModel("det");
			oProdModel.loadData(sEndPoint);
		},

		_checkIfProductAvailable : function(sPath) {
			var oModel = this.getModel();
			var oData = oModel.getData(sPath);
			// show not found page
			if (!oData) {
				this._router.getTargets().display("notFound");
			}
		},

		onAddButtonPress : function() {
			console.log("onAddButtonPress");
			var oResourceBundle = this.getOwnerComponent().getModel("i18n")
					.getResourceBundle();
			var oProduct = this.getView().getModel("det");
			var oCartModel = this.getView().getModel("cartProducts");
			cart.addToCart(oResourceBundle, oProduct, oCartModel);
			
		},

		onCartButtonPress : function() {
			console.log("onCartButtonPress");
			this._router.navTo("cart");
		},

		onNavButtonPress : function() {
			console.log("onNavButtonPress");
			this.getOwnerComponent().myNavBack();
		},

		onPicturePress : function() {
			console.log("onPicturePress");
			this.byId("lightBox").open();
		}

	});
});