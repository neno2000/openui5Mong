sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/ui/model/json/JSONModel'
], function (MessageBox, MessageToast, JSONModel) {
	"use strict";

	return {

		/**
		 * Checks for the status of the product that is added to the cart.
		 * If the product is not available, a message dialog will open.
		 * Otherwise the helper function <code>_updateCartItem</code> will be called.
		 * @public
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProduct Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 */
		addToCart: function (oBundle, oProduct, oCartModel) {
			// start by retrieving the cart in MongoD

			// Items to be added from the welcome view have their content inside a product object
			if (oProduct.getData().details._id !== undefined) {
			//	oProduct = oProduct.getData().details._id;
			}
			console.log("oProduct.details._id: "  + oProduct);
			console.log("oProduct   :" + oProduct);
			console.log("oCartModel   :" + oCartModel);
			console.log("oBundle   :" + oBundle);
			/*
			switch (oProduct.Status) {
				case "D":
					//If item is "discontinued" show message dialog
					MessageBox.show(
						oBundle.getText("PRODUCT_STATUS_DISCONTINUED_MSG"), {
							icon: MessageBox.Icon.ERROR,
							titles: oBundle.getText("PRODUCT_STATUS_DISCONTINUED_TITLE"),
							actions: [MessageBox.Action.CLOSE]
						});
					break;
				case "O":
					// If item is "out of stock" show message dialog
					MessageBox.show(
						oBundle.getText("PRODUCT_STATUS_OUT_OF_STOCK_MSG"), {
							icon: MessageBox.Icon.QUESTION,
							title: oBundle.getText("PRODUCT_STATUS_OUT_OF_STOCK_TITLE"),
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							onClose: function (oAction) {
								// order
								if (MessageBox.Action.OK === oAction) {
									this._updateCartItem(oBundle, oProduct, oCartModel);
								}
							}.bind(this)
						});
					break;
				case "A":
				//If item is "available" add it to cart. Also default,
				//if no status-property is set or case does not match
				default:
					this._updateCartItem(oBundle, oProduct, oCartModel);
					break;
			}*/
			this._updateCartItem(oBundle, oProduct, oCartModel);
		},
	
		/**
		 * Function that updates the cart model when a product is added to the cart.
		 * Therefore it first checks, if the products is already in the cart. Then it only updates the counter.
		 * If not, a new object with quantity 1 is added to the cart model.
		 * @private
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProductToBeAdded Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 */
		_updateCartItem: function (oBundle, oProductToBeAdded, oCartModel) {
			console.log("_updateCartItem");
			// get the data from the database. use the hardcoded user the first time
			
			
			var oCartData = oCartModel.getData();
			console.log(oCartData);

			// find existing entry for product
			//var oCartEntry = oCartData.cartEntries[oProductToBeAdded.ProductId];
			var oCartEntry = oCartData.cartEntries[oProductToBeAdded.getData().details._id];
			console.log("oCartEntry " + oCartEntry);

			if (oCartEntry === undefined) {
				// create new entry
				oCartEntry = $.extend({}, oProductToBeAdded.getData());
				oCartEntry.Quantity = 1;
				oCartData.cartEntries[oProductToBeAdded.getData().details._id] = oCartEntry;
			} else {
				// update existing entry
				oCartEntry.Quantity += 1;
			}
			//if there is at least one entry, the edit button is shown
			oCartModel.setData(oCartData);
			oCartModel.setProperty("/showEditButton", true);
			oCartModel.setProperty("/showProceedButton", true);
			// we need to update the binding to show the total price
			oCartModel.updateBindings(true);
			MessageToast.show(oBundle.getText("PRODUCT_MSG_ADDED_TO_CART", [oProductToBeAdded.getData().details.title] ));
		}
	};
});