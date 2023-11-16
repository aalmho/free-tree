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
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { uploadImage } from "../api/api";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { v4 as uuidv4 } from "uuid";
import { useCreatePost } from "../hooks/use-posts";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreatePostScreen = ({ navigation }: any) => {
  const [fileName, setFilename] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [fileUri, setFileUri] = useState("");
  const [postInfo, setPostInfo] = useState({
    description: "",
    postalCode: "",
    city: "",
    date: new Date(),
  });

  const { mutate: createPostMutation, isPending } = useCreatePost();

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
            paddingTop: 40,
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                width: 150,
              }}
            >
              <Text>Afhetningsdato</Text>
              <DateTimePicker
                value={postInfo.date}
                mode="date"
                onChange={(event, date) => {
                  setPostInfo({ ...postInfo, date: date! });
                }}
              />
            </View>
            <Pressable onPress={selectImage}>
              <View
                style={{
                  height: 150,
                  width: 150,
                  borderColor: "green",
                  borderWidth: 1,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  borderStyle: "dashed",
                }}
              >
                {fileUri && (
                  <Image style={styles.image} source={{ uri: fileUri }} />
                )}
                {!fileUri && <Ionicons name="camera-outline" size={30} />}
              </View>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              inputMode="numeric"
              style={[styles.input, { width: 150 }]}
              value={postInfo.postalCode}
              onChangeText={(val) =>
                setPostInfo({ ...postInfo, postalCode: val })
              }
              placeholder="Postnummer"
            />
            <TextInput
              style={[styles.input, { width: 150 }]}
              value={postInfo.city}
              onChangeText={(data) => setPostInfo({ ...postInfo, city: data })}
              placeholder="By"
            />
          </View>
          <TextInput
            multiline
            style={[styles.input, { width: 310, height: 80 }]}
            value={postInfo.description}
            onChangeText={(val) =>
              setPostInfo({ ...postInfo, description: val })
            }
            placeholder="Tilføj beskrivelse"
          />
          <Pressable onPress={submitPost} disabled={isPending}>
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 24,
                minWidth: 100,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                Opret
              </Text>
            </View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default CreatePostScreen;
