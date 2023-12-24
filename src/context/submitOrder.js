// // import { v4 as uuidv4 } from "uuid";
// import VM from '@vippsno/vipps-sdk'
// // import open from 'open';



// // const clientId = "ad3618a8-661e-4aa8-9561-8ef37091d564";
// // const clientSecret = "D1Z8Q~OwaY8k45i8zph8~R22~MiXSSxbLh~6AcdG";
// // const subKey = "7c6eb73f864a41a7ab153a2cd0ad23f9";
// // const MSI = "854459";


// // const client = new VM({
// //   clientId,
// //   clientSecret,
// //   subscriptionKey: subKey,
// //   merchantSerialNumber: MSI,
// //   vippsSystemName: "Acme Commerce",
// //   vippsSystemVersion: "2.6",
// //   pluginName: "acme-webshop",
// //   pluginVersion: "4.3",
// //   useTestMode: false ,
// // });

// // const callbackAuthorizationToken = uuidv4();


// // // Create a unique reference for this payment
// // const reference = uuidv4();


// // // The phone number of the customer


// // const pay = async ()=>{
    
// // // Create a checkout session
// // await  client.checkout.createSession({
// //     merchantInfo: {
// //       callbackUrl: "https://example.com/callbackUrl",
// //       returnUrl: "https://example.com/fallbackPage",
// //       callbackAuthorizationToken
// //     },
// //     transaction: {
// //       amount: {
// //         currency: 'NOK',
// //         value: 10*100 // This value equals 10 NOK
// //       },
// //       reference,
// //       paymentDescription: 'order From Silline Bakeri'
// //     },
// //   });
  
// //   const checkoutSessionDetails = await client.checkout.getSessionDetails(reference);
// //   console.log("Session details are:\n", checkoutSessionDetails);
  
  
  
// //   // Create a new payment
// //   const payment = await client.ePayment.createPayment({
// //     amount: {
// //         currency: 'NOK',
// //         value: 10*100, // This value equals 10 NOK
// //     },
// //     reference,
// //     paymentMethod: {
// //         type: 'WALLET',
// //     },
// //     userFlow: 'WEB_REDIRECT',
// //     returnUrl: 'https://developer.vippsmobilepay.com/docs/example-pages/result-page',
// //     paymentDescription: "One pair of socks",
// //   });
  
// //   // Get the payment details
// //   const paymentDetails = await client.ePayment.getPayment(reference);
  
// //   // Open the default browser with the redirect URL
// //   await open(paymentDetails.redirectUrl);
// // } 

// // export default pay ;