import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../firebase-key.json";
import { envConfig } from "../configs/env.config";

export class UploadService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: "https://upload-doan.firebaseapp.com",
      storageBucket: envConfig.STOGARE_BUCKET,
    });
  }

  private getBucket() {
    return admin.storage().bucket();
  }

  private getStorage() {
    return admin.storage();
  }
}
