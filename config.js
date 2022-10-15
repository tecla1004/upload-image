import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    
        apiKey: "AIzaSyCZ4-33tm0GDlO2vLKj6Ui8ew1WhSI0jOs",
        authDomain: "upload-image-314f4.firebaseapp.com",
        projectId: "upload-image-314f4",
        storageBucket: "upload-image-314f4.appspot.com",
        messagingSenderId: "372981206055",
        appId: "1:372981206055:web:a5372a6a35aa50fc369202"
      
    }

    if (!firebase.apps.length){
        firebase.initializeApp(firebaseConfig)
    }
    
    export {firebase};
