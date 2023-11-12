import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { uploadImage } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import { useCreatePost } from "../hooks/use-posts";
import DateTimePicker from "@react-native-community/datetimepicker";

const deviceWidth = Dimensions.get("window").width;

const CreatePostScreen = ({ navigation }: any) => {
  const [fileName, setFilename] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [fileUri, setFileUri] = useState("");
  const uploadImageText = fileUri ? "Change image" : "Upload image";
  const [postInfo, setPostInfo] = useState({
    description: "",
    postalCode: "",
    city: "",
    date: new Date(),
  });

  const { mutate: createPostMutation } = useCreatePost();

  const cleanUp = useCallback(() => {
    setPostInfo({
      description: "",
      postalCode: "",
      city: "",
      date: new Date(),
    });
    setFilename("");
    setFormData(null);
    setFileUri("");
  }, []);

  const submitPost = useCallback(async () => {
    if (formData) {
      await uploadImage(fileName, formData);
      createPostMutation({
        fileName,
        description: postInfo.description,
        date: postInfo.date,
        postalCode: postInfo.postalCode,
        city: postInfo.city,
      });
      cleanUp();
      navigation.navigate("Mine træer");
    }
  }, [fileName, formData, postInfo]);

  const selectImage = useCallback(async () => {
    if (permission?.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const fileExt = image.uri.split(".").pop();
        const generatedFileName = `${uuidv4()}.${fileExt}`;

        const formData = new FormData();
        formData.append(
          "files",
          JSON.parse(
            JSON.stringify({
              uri: image.uri,
              type: "image/jpeg",
              name: generatedFileName,
            })
          )
        );
        setFilename(generatedFileName);
        setFileUri(image.uri);
        setFormData(formData);
      }
    } else {
      requestPermission();
    }
  }, [permission]);

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Button title={uploadImageText} onPress={selectImage} />
          {fileUri && <Image style={styles.image} source={{ uri: fileUri }} />}
          <TextInput
            style={styles.input}
            value={postInfo.description}
            onChangeText={(val) =>
              setPostInfo({ ...postInfo, description: val })
            }
            placeholder="Tree description"
          />
          <TextInput
            inputMode="numeric"
            style={styles.input}
            value={postInfo.postalCode}
            onChangeText={(val) =>
              setPostInfo({ ...postInfo, postalCode: val })
            }
            placeholder="Postal code"
          />
          <TextInput
            style={styles.input}
            value={postInfo.city}
            onChangeText={(data) => setPostInfo({ ...postInfo, city: data })}
            placeholder="City"
          />
          <Text>Date of pick up</Text>
          <DateTimePicker
            value={postInfo.date}
            mode="date"
            onChange={(event, date) => {
              setPostInfo({ ...postInfo, date: date! });
            }}
          />
          <Button onPress={submitPost} title="Submit" />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    minWidth: 200,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: deviceWidth / 2,
    height: deviceWidth / 2,
    borderRadius: 8,
  },
});

export default CreatePostScreen;
