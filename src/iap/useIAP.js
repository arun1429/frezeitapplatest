import * as RNIap from 'react-native-iap';

const PRODUCT_ID = 'com.freizeit.exclusive.content';

class IAPService {

  purchaseUpdateSub = null;
  purchaseErrorSub = null;
  onSuccess = null;

  async init(onSuccessCallback) {
    try {
      this.onSuccess = onSuccessCallback;

      // connect store
      await RNIap.initConnection();

      // IMPORTANT for iOS pending transactions
      await RNIap.clearTransactionIOS();

      // get products
      const products = await RNIap.getSubscriptions({ skus: [PRODUCT_ID] });
      console.log('Products =>', products);

      // SUCCESS LISTENER
      this.purchaseUpdateSub = RNIap.purchaseUpdatedListener(async purchase => {
        try {
          console.log("PURCHASE OBJECT => ", purchase);

          const receipt = purchase.transactionReceipt;

          if (!receipt) return;

          // send receipt to backend
          await this.onSuccess(receipt);

          // FINISH TRANSACTION (MANDATORY)
          await RNIap.finishTransaction({
            purchase: purchase,
            isConsumable: false,
          });

        } catch (e) {
          console.log("Listener error", e);
        }
      });

      // ERROR LISTENER
      this.purchaseErrorSub = RNIap.purchaseErrorListener(error => {
        console.log('Purchase error => ', error);
      });

    } catch (err) {
      console.log('IAP init error => ', err);
    }
  }

  // 🔥 NEW PURCHASE METHOD (v14)
  async buySubscription() {
    try {
      await RNIap.requestPurchase({
      request: {
        ios: {
          sku: PRODUCT_ID,
        },
      },
    });
    } catch (err) {
      console.log('Buy error => ', err);
    }
  }

  end() {
    this.purchaseUpdateSub?.remove();
    this.purchaseErrorSub?.remove();
    RNIap.endConnection();
  }
}

export default new IAPService();