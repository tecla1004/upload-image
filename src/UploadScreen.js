import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, Button } from 'react-native'
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import {firebase} from '../config'

const UploadScreen = () => {

//Launching camera
let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const imagePickerPermission = await ImagePicker.requestMediaLibraryPermissionsAsync(); //upload
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  const [image, setImage] = useState(null);
const [uploading, setUploading] = useState(false);

const pickImage = async()=>{
    //no permissions request is neccessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.All,
        allowsEditing:true, 
        aspect: [4,3],
        quality:1,
    });

    const source = {uri:result.uri};
    console.log(source)
    setImage(source);
}

const uploadImage = async () => {
    setUploading(true)
    const response = await fetch(image.uri)
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/')+1);
    var ref = firebase.storage().ref().child(filename).put(blob);

    try{
        await ref;
    } catch(e){
        console.log(e);
    }

    setUploading(false);
    Alert.alert(
        'photo uploaded !!'
    )
    setImage(null)
}


  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }
//upload image

  return (
    <SafeAreaView style={styles.container}>
         <Camera ref={cameraRef}>
            <TouchableOpacity title="Take Pic" onPress={takePic} style={styles.takePicButton} >
                <Text style={styles.buttonText}>Take Picture</Text>
           </TouchableOpacity>
        </Camera>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        <View>
            {image && <Image source={{uri: image.uri}} style={{width:300, height:300}} />}
            <TouchableOpacity
            style={styles.uploadButton} onPress={uploadImage}
            >
                <Text style={styles.buttonText}>
                    Upload Image
                </Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default UploadScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#000',
        justifyContent:'center'
    },
    cameraContainer:{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
    takePicButton:{
        borderRadius:5,
        width:150,
        height:50,
        backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    },
    selectButton:{
        borderRadius:5,
        width:150,
        height:50,
        backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center'
    },
    uploadButton:{
        borderRadius:5,
        width:150,
        height:50,
        backgroundColor:'green',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{
        color:'white',
        fontSize:18,
        fontSize:18,
        fontWeight:'bold'
    },
    imageContatiner:{
        marginTop:30,
        marginBottom:50,
        alignItems:'center'
    }
})