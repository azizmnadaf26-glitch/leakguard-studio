import algosdk from 'algosdk';

/**
 * Executes a fetch request wrapped with x402 payment handling.
 * If a 402 Payment Required response is received, it triggers a wallet prompt
 * using the provided transactionSigner, then retries the request.
 * 
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options (method, headers, body)
 * @param {string} activeAddress - The connected wallet address
 * @param {function} transactionSigner - Wallet transaction signer function
 * @returns {object} - The parsed JSON response
 */
export async function executeWithX402Payment(url, options, activeAddress, transactionSigner) {
  // 1. Initial request (expecting 402)
  const initRes = await fetch(url, options);

  if (initRes.status !== 402) {
    if (!initRes.ok) {
      throw new Error(`Server error: ${await initRes.text()}`);
    }
    return initRes.json();
  }

  // 2. Extract payment requirements
  const paymentHeaderStr = initRes.headers.get('payment-required');
  if (!paymentHeaderStr) {
    throw new Error("402 response missing payment-required header");
  }

  const decodedHeader = atob(paymentHeaderStr);
  const paymentReqObj = JSON.parse(decodedHeader);
  const paymentReq = paymentReqObj.accepts[0];

  if (!activeAddress || !transactionSigner) {
    throw new Error("Payment required: Please connect your wallet first!");
  }

  // 3. Construct the Payment Transaction using Algorand SDK
  const algod = new algosdk.Algodv2('', 'https://testnet-api.4160.nodely.dev', '');
  const params = await algod.getTransactionParams().do();
  
  let txn;
  try {
    txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: activeAddress,
      receiver: paymentReq.payTo.replace(/[<>]/g, ''),
      amount: parseInt(paymentReq.amount),
      assetIndex: parseInt(paymentReq.asset),
      suggestedParams: {
        ...params,
        fee: paymentReq.extra?.feePayer ? 0 : params.fee,
        flatFee: paymentReq.extra?.feePayer ? true : false,
      },
    });
  } catch (innerErr) {
    throw new Error(`Txn Error: ${innerErr.message}. from='${activeAddress}', to='${paymentReq?.payTo}'`);
  }

  // 4. Sign the transaction via the connected wallet
  const signedTxns = await transactionSigner([txn], [0]);
  
  // Base64 encode the signed transaction for the x-payment proof
  const proofBase64 = btoa(String.fromCharCode.apply(null, signedTxns[0]));

  // 5. Retry the original request with the payment proof
  const retryHeader = JSON.stringify({
    x402Version: 2,
    payload: {
      proof: proofBase64
    },
    accepted: {
      scheme: paymentReq.scheme,
      network: paymentReq.network,
      asset: paymentReq.asset,
      amount: paymentReq.amount,
      payTo: paymentReq.payTo,
      maxTimeoutSeconds: paymentReq.maxTimeoutSeconds,
      extra: paymentReq.extra
    }
  });

  const retryOptions = {
    ...options,
    headers: {
      ...options.headers,
      'payment-signature': btoa(retryHeader)
    }
  };

  const retryRes = await fetch(url, retryOptions);

  if (!retryRes.ok) {
    const errText = await retryRes.text();
    throw new Error("Payment rejected or server error: " + errText);
  }

  return retryRes.json();
}
