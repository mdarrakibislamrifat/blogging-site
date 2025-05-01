import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxtL_It8UMPULyYu2Fnk_Gg3bVid7xFCI",
  authDomain: "blog-site-b1a5c.firebaseapp.com",
  projectId: "blog-site-b1a5c",
  storageBucket: "blog-site-b1a5c.appspot.com",
  messagingSenderId: "175900530673",
  appId: "1:175900530673:web:baed5d3dce4b2f250f1650",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
