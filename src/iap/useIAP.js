import * as RNIap from 'react-native-iap';

const PRODUCT_ID = 'com.freizeit.exclusive.content';

class IAPService {

  purchaseUpdateSub = null;
  purchaseErrorSub = null;
  onSuccess = null;

  async init(onSuccessCallback) {
  try {
    this.onSuccess = onSuccessCallback;

    await RNIap.initConnection();

    // iOS pending cleanup
    await RNIap.clearTransactionIOS();

    // ✅ NEW API (v14)
    const { products } = await RNIap.fetchProducts({
      skus: ['com.freizeit.exclusive.content'],
    });

    console.log('Products => ', products);

    // SUCCESS LISTENER
    this.purchaseUpdateSub = RNIap.purchaseUpdatedListener(async purchase => {
      
    //  console.log("purchase :2222",purchase)
      var transaction_id = purchase.transactionId
      if (!transaction_id) return;

      await this.onSuccess(transaction_id);

      await RNIap.finishTransaction({
        purchase,
        isConsumable: false,
      });
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