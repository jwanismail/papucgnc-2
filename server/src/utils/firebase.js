import admin from 'firebase-admin';

// Firebase Admin SDK'yı başlat
let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Environment variables'dan Firebase config'i al
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
    });

    console.log('✅ Firebase Admin SDK başlatıldı');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase başlatma hatası:', error);
    throw error;
  }
};

// Firebase Storage'a dosya yükle
export const uploadToFirebase = async (file, folder = 'products') => {
  try {
    const app = initializeFirebase();
    const bucket = admin.storage().bucket();
    
    // Unique dosya adı oluştur
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const fileName = `${folder}/product-${timestamp}-${random}${getFileExtension(file.originalname)}`;
    
    // Buffer'ı Firebase Storage'a yükle
    const fileUpload = bucket.file(fileName);
    
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Firebase upload hatası:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          // Public URL oluştur
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          console.log('✅ Firebase\'e yüklendi:', publicUrl);
          resolve({
            url: publicUrl,
            fileName: fileName,
            originalName: file.originalname
          });
        } catch (error) {
          console.error('Public URL oluşturma hatası:', error);
          reject(error);
        }
      });

      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Firebase upload genel hatası:', error);
    throw error;
  }
};

// Dosya uzantısını al
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export default initializeFirebase;
