const baseUrl = 'http://localhost:5001/languageapp-4985f/us-central1'

async function postMailer() {
    try{
        const response = await axios({
            url: `${baseUrl}/mailer`,
            method: 'POST'
        })
        return response
    }
    catch(e) {
        console.log('error: ', e)
    }
}

// import api, { getUrl } from '../../utils/api/api';

// export enum TransactionType {
//     SEND_CASH = 'SEND_CASH',
//     CASH_OUT_CASH = 'CASH_OUT_CASH',
//     CASH_OUT_OWN_ACCOUNT = 'CASH_OUT_OWN_ACCOUNT',
//     RECHARGE_SERVICE = 'RECHARGE_SERVICE',
//     PAYMENT_SERVICE = 'PAYMENT_SERVICE'
// }

// export interface TransactionPinConfig {
//     id: number;
//     key: TransactionType;
//     needsPin: boolean;
//     onlyFirstPayment: boolean;
// }

// class onuserCreateService {

//     static createUser( values ) {
//         return new Promise( ( resolve, reject ) => {
//                 const params = {
//                     'email': values.currentPin
//                 };

//                 const apiResponse = api.post( getUrl.savePin, params );
//                 apiResponse
//                     .then( () => {
//                         resolve();
//                     })
//                     .catch( () => {
//                         reject();
//                     });
//         });
//     };

//     static sendEmail(): Promise<string> {
//         return new Promise( ( resolve, reject ) => {
//             const useMock = window.mockControl.userProfile.useMock;
//             if ( useMock ) {
//                 setTimeout( () => {
//                     if ( window.mockControl.userProfile.sendEmail.error ) {
//                         reject( window.mockControl.userProfile.sendEmail.errorMessage );
//                     } else {
//                         resolve( window.mockControl.userProfile.sendEmail.successMessage );
//                     }
//                 }, getRandom() );
//             }
//             else {
//                 const apiResponse = api.get( getUrl.recoverPin );

//                 apiResponse
//                     .then( () => {
//                         resolve();
//                     })
//                     .catch( ( error ) => {
//                         reject( error.response );
//                     });
//             }
//         });
//     };
// }

// export default ShrPinManagementService;
