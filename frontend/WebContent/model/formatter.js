sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
	"use strict";

	var mStatusState = {
		"A": "Success",
		"O": "Warning",
		"D": "Error"
	};

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} oCartEntries current cart entries
		 * @return {string} string with the total value
		 */
		totalPrice: function (oCartEntries) {
			var oBundle = this.getResourceBundle(),
				fTotalPrice = 0;

			Object.keys(oCartEntries).forEach(function (sProductId) {
				var oProduct = oCartEntries[sProductId];
				fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
			});

			return oBundle.getText("CART_TOTAL_PRICE", [formatter.price(fTotalPrice)]);
		},

		/**
		 * Returns the status text based on the product status
		 * @param {string} sStatus product status
		 * @return {string} the corresponding text if found or the original value
		 */
		statusText: function (sStatus) {
			var oBundle = this.getResourceBundle();

			var mStatusText = {
				"A": oBundle.getText("STATUS_A"),
				"O": oBundle.getText("STATUS_O"),
				"D": oBundle.getText("STATUS_D")
			};

			return mStatusText[sStatus] || sStatus;
		},

		/**
		 * Returns the product state based on the status
		 * @param {string} status product status
		 * @return {string} the state text
		 */
		statusState: function (sStatus) {
			return mStatusState[sStatus] || "None";
		},

		/**
		 * Returns the relative URL to a product picture
		 * @param {string} sUrl image URL
		 * @return {string} relative image URL
		 */
		pictureUrl: function (sUrl) {
			var mongoPath = "http://localhost:3000/static//";
		//	return jQuery.sap.getResourcePath("sap/ui/demo/cart/" + sUrl);
			return mongoPath + sUrl;
		},

		imageUrl: function(sUrl){
			var mongoPath = "http://localhost:3000/static";
			return mongoPath + sUrl;
		},
		/**
		 * Returns the footer text for the cart based on the amount of products
		 * @param {object} oSavedForLaterEntries the entries in the cart
		 * @return {string} "" for no products, the i18n text for >0 products
		 */
		footerTextForCart: function (oSavedForLaterEntries) {
			var oBundle = this.getResourceBundle();

			if (Object.keys(oSavedForLaterEntries).length === 0) {
				return "";
			}
			return oBundle.getText("CART_SAVED_FOR_LATER_FOOTER_TEXT");
		}
	};

	return formatter;
});
