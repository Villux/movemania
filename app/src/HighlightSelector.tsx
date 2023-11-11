import { Image, View } from "react-native";
import React from "react";
import { styled } from "./styled";
import { Text } from "./components";
import { Stack } from "./components/Stack";

export default function HighlightSelector() {
  const [checked, setChecked] = React.useState("Teemu");

  const users = [
    {
      name: "Julien",
      description: "Collected most coins",
      avatar: require("../assets/images/user-avatar.jpg"),
    },
    {
      name: "Teemu",
      description: "Walked the most",
      avatar: require("../assets/images/user-2-avatar.png"),
    },
    {
      name: "Ville",
      description: "Found the mystery chest",
      avatar: require("../assets/images/user-3-avatar.png"),
    },
  ];

  return (
    <HighlightSelectorContainer axis="y" spacing="small">
      {users.map((user, index) => (
        <RadioButtonWrapper key={index} onPress={() => setChecked(user.name)}>
          <RadioInput axis="x" spacing="large" justify="between" align="center">
            <Stack axis="x" spacing="small" align="center">
              <Image
                source={user.avatar}
                style={{ width: 50, height: 50, borderRadius: 99 }}
              />

              <View>
                <Text variant="button" color="text">
                  {user.name}
                </Text>
                <Text variant="default" color="text">
                  {user.description}
                </Text>
              </View>
            </Stack>
            <RadioButton
              style={{
                backgroundColor:
                  checked === user.name ? "#FFF500" : "transparent",
              }}
            />
          </RadioInput>
        </RadioButtonWrapper>
      ))}
    </HighlightSelectorContainer>
  );
}

const HighlightSelectorContainer = styled(Stack, {});

const RadioInput = styled(Stack, {
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 99,
  backgroundColor: "rgba(255, 255, 255, 0.10)",
});

const RadioButton = styled("View", {
  height: 24,
  width: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
});

const RadioButtonWrapper = styled("TouchableOpacity", {});
