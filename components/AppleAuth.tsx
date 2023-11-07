import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../utils/supabase";

export function AppleAuth() {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 200, height: 64 }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });

          if (credential.identityToken) {
            const {
              error,
              data: { user },
            } = await supabase.auth.signInWithIdToken({
              provider: "apple",
              token: credential.identityToken,
            });
            if (!error) {
              if (credential.fullName?.givenName) {
                await supabase
                  .from("profiles")
                  .upsert({
                    id: user?.id,
                    first_name: credential.fullName?.givenName,
                    last_name: credential.fullName?.familyName,
                  })
                  .eq("id", user?.id);
              }
            }
          } else {
            throw new Error("No identityToken.");
          }
        } catch (e) {
          // handle other errors
        }
      }}
    />
  );
}
