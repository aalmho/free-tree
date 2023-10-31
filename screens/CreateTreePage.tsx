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
  Text
} from "react-native";
import { uploadImage } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import { useCreatePost } from "../hooks/use-posts";
import DateTimePicker from '@react-native-community/datetimepicker';

const deviceWidth = Dimensions.get("window").width;

const CreateTreePage = () => {
  const [description, setDescription] = useState("");
  const [fileName, setFilename] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [fileUri, setFileUri] = useState("");
  const [date, setDate] = useState(new Date())
  const uploadImageText = fileUri ? "Change image" : "Upload image";

  const { mutate: createPostMutation } = useCreatePost();

  const cleanUp = useCallback(() => {
    setDescription("");
    setFilename("");
    setFormData(null);
    setFileUri("");
  }, []);

  const submitPost = useCallback(async () => {
    if (formData) {
      await uploadImage(fileName, formData);
      createPostMutation({ fileName, description, date });
      cleanUp();
    }
  }, [fileName, formData, description]);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title={uploadImageText} onPress={selectImage} />
        {fileUri && <Image style={styles.image} source={{ uri: fileUri }} />}
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Make a description"
        />
        <Button onPress={submitPost} title="Submit" />
        <Text>Select date of pick up</Text>
      <DateTimePicker
        value={date}
        mode="date"
        onChange={(event, date) => {
          setDate(date!)
        }}
      />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    minWidth: 200,
    height: 40,
    margin: 12,
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

export default CreateTreePage;
