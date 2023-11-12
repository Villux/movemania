import { useState } from "react";

import { Button, Overlay, Stack, Text, Image } from "./components";
import { styled } from "./styled";
import { MAIN_PLAYER } from "./constants";

export function LevelHighlightsOverlay({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <Overlay>
      <Stack axis="y" spacing="normal" style={{ padding: 20 }}>
        <Image
          autoSize={{ width: 100 }}
          source={require("../assets/images/highlights.png")}
          style={{ alignSelf: "center" }}
        />
        <Stack axis="y" spacing="medium">
          <Stack axis="y" spacing="small" align="center">
            <Text variant="title" color="primary">
              Compliment time!
            </Text>

            <Text align="center" style={{ fontSize: 16, lineHeight: 22 }}>
              Pick one of your teammates to pass a compliment to:
            </Text>
          </Stack>

          <LevelStatsContainer>
            <HighlightSelector />
          </LevelStatsContainer>

          <Button onPress={onContinue}>Finish</Button>
        </Stack>
      </Stack>
    </Overlay>
  );
}

const users = [
  {
    name: "Julien",
    description: "King of comedy",
    avatar: require("../assets/images/user-avatar-2.png"),
  },
  {
    name: "Andreas",
    description: "Mastermind of creativity",
    avatar: require("../assets/images/user-avatar-3.png"),
  },
  {
    name: "Ville",
    description: "Ultimate support champion",
    avatar: require("../assets/images/user-avatar-4.png"),
  },
];

function HighlightSelector() {
  const [checked, setChecked] = useState(MAIN_PLAYER);

  return (
    <Stack axis="y" spacing="small">
      {users.map((user, index) => (
        <RadioButtonWrapper key={index} onPress={() => setChecked(user.name)}>
          <RadioInput axis="x" spacing="large" justify="between" align="center">
            <Stack axis="x" spacing="small" align="center">
              <Image
                source={user.avatar}
                style={{ width: 50, height: 50, borderRadius: 99 }}
              />

              <Stack axis="y" spacing="xxsmall">
                <Text variant="default" color="text">
                  {user.name}
                </Text>
                <Text variant="default" color="text" style={{ fontSize: 14 }}>
                  {user.description}
                </Text>
              </Stack>
            </Stack>

            <RadioButton checked={checked === user.name}>
              {checked === user.name && <RadioButtonInner />}
            </RadioButton>
          </RadioInput>
        </RadioButtonWrapper>
      ))}
    </Stack>
  );
}

const LevelStatsContainer = styled("View", {
  display: "flex",
  flexDirection: "row",
  gap: 12,
});

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
  padding: 8,
  alignItems: "center",
  justifyContent: "center",
  variants: {
    checked: {
      true: {
        borderColor: "$primary",
      },
      false: {
        borderColor: "#fff",
      },
    },
  },
});

const RadioButtonInner = styled("View", {
  height: 12,
  width: 12,
  borderRadius: 6,
  backgroundColor: "$primary",
});

const RadioButtonWrapper = styled("TouchableOpacity", {});
