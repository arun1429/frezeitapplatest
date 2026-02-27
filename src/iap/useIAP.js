import {useEffect} from 'react';
import * as RNIap from 'react-native-iap';

const productIds = ['com.freizeit.exclusive.content'];

export default function useIAP(onSuccess) {

useEffect(() => {
let purchaseUpdateSub;
let purchaseErrorSub;


const init = async () => {
  await RNIap.initConnection();

  // Fetch products
  const products = await RNIap.getSubscriptions(productIds);
  console.log('Products =>', products);

  // LISTENER: purchase success
  purchaseUpdateSub = RNIap.purchaseUpdatedListener(async purchase => {
    const receipt = purchase.transactionReceipt;

    if (receipt) {
      console.log('Receipt =>', receipt);

      // send to backend
      await onSuccess(receipt);

      // tell Apple purchase finished
      await RNIap.finishTransaction({purchase});
    }
  });

  // LISTENER: purchase failed
  purchaseErrorSub = RNIap.purchaseErrorListener(error => {
    console.log('Purchase error', error);
  });
};

init();

return () => {
  purchaseUpdateSub?.remove();
  purchaseErrorSub?.remove();
  RNIap.endConnection();
};


}, []);
}
