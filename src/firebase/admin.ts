// This file is intended to be used on the server-side only.
// It is not part of the client-side bundle.

import { getApps, initializeApp, getApp, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore | undefined;

const serviceAccount: ServiceAccount = {
  projectId: "studio-5348613997-5036e",
  clientEmail: "firebase-adminsdk-fbsvc@studio-5348613997-5036e.iam.gserviceaccount.com",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCveJVB0o2nHawh\nbt6WbqyLL2sIBgD6clxLzoU6H09+wapp/SvxAq7cP0Ot3fa0RLOCRkbEtjYUtQJT\naRRs0LNn1J1kqBdrlu3C7s3rfE8Nht+59dkyiuZqpOI7VDwpA8ExFDkLac4gWtBf\nWHyjbLDJw4r9HVi7SW7l5aeKNtJ8pyfdKEusxQA9tmGUEa2tvX8w2TWrQ3jiAPDw\ndYjBounPDin3YpT0Kpzr4CwUNXkB5h0GkB11ZaBNYLm4Y9O+pJz7nsWvVBH2eCqc\nSO4J8MLdWT7zpiSYODbbrG3pw5y3OtSU391x4UiyrUVYRPoHO1G3MsBw2NLA8LwH\nSG4beQmhAgMBAAECggEABzqbxY78oUejULfkiV4f+bz3ak8ONimR3Iw/aCe9kR6L\nHE8FXJC/rowYFPJJyJJZZd+dnA5Yqu1sUUGvouFnOFR/TODXupA74kKPbukblaMg\n/CRUSu62s7dWwnR2/qAshgHY05V+9ZpgLsL/VLlBc3jjNNUDOik6KlQvg1qjI2aR\naUlN5qvMpsbQQmWvZH4bHq+Tv3KC1V7U+uHca2RBLwlNKbTCmanBB7TKhuaBKzkk\nvUpVB0/KwHkCusY0ubE4sY9qVY9lSjfRa+54MSPLZCCmdLJ6PeaaqBZdeCwQ5ARJ\nqO01faOR/l+ITyrILWG5qi43OMIAaa/H3SJHwiJs5QKBgQDmpqDFvwRy7FmObfjR\nS741i2UImCZxz3oRN4KOhcTfgxh2hvvjbI+VRiRWJeRWHlVHi18JYcmpcbi0tbN/\nG8kK2Dp3WzIJx7fCipsfM8orp06mq2lEfDJjxbu/dO1UeWwD81eX/xzzypfZVVfU\nJ+g8ixITLXdaARUaZ4KeTdFjlQKBgQDCwXeltqxUiz8nPZkRbOCn7/rcHPuiksPJ\n7XH3E4LZFUG6y86PR55DhelJn0ZdAQ1zO9tgbaBKmAllXojDgV5o2iPzIupiVTo2\nrxNGEA+uF84hxDZIL9qhUnDIYpwk6hd0xqzHXIbSMW0zNPUIT98fU6FMzdgK5pwu\nF+33n/lK3QKBgQCC+lyR7sc3+79fglOphrmc7muRVdV/C7Ll0//vr0b9JhTeOgkQ\nPLXMrugzg5EG1nLXDe4KBd3euxWIiSZFKCIiZmfNH5xqsV9Iui0cquxDnd6sBurg\nWSbEQaU8M8oSDmGoXKeBSP3H82QHps8ZSxA2UUMSYN9F3Rd+xwkFnGsrgQKBgADu\n4F3g5C57hE/x0Zvtw53KXo9TbDk5Lsr24kbmxwe3PFtiwpiZJT75k0aRBstHSAM3\nVDPAEraIx/K+YzVcl1E1SlrN3gWelurQJ+18Ajc5UfmDcScjY47GUFgFcO4UWQxs\nL0O9Q8AaEIXgSRRDHbSOuAUgL1rOBA2Me81l7NHZAoGBAJ7j0JESD9IAh6lSQnvY\n06pd2q5R+YubV3blwSHIyCiseqOdQXViD0h8pmFwimWy6mNaNJMjw7fmUgn9vVuk\nNO8FOYiWxCfFXbUMCzWoyNHwagtNNU6HngUaKGwKN8q6mjYnhOtOP9tviX2oFpsn\nIkHZbQFS//wiMGqkeFXgsplV\n-----END PRIVATE KEY-----\n",
};

function getAdminDb(): Firestore {
  if (adminDb) {
    return adminDb;
  }
  
  try {
    let adminApp: App;
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      adminApp = getApp();
    }
    
    adminDb = getFirestore(adminApp);
    return adminDb;
  } catch (error: any) {
    console.error('Failed to initialize Firebase Admin SDK.', error);
    throw new Error(`Could not initialize Firebase Admin SDK. Original error: ${error.message}`);
  }
}

export { getAdminDb };
