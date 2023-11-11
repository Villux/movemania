import { Audio } from "expo-av";
import { useEffect, useRef } from "react";

import { styled } from "../styled";
import { Text } from "./Text";

type Props = {
  children: string;
  onPress: () => void;
};

export function Button({ children, ...props }: Props) {
  const sound = useRef<Audio.Sound>();

  function onPress() {
    sound.current?.replayAsync().catch(console.log);
    props.onPress();
  }

  useEffect(() => {
    async function loadSound() {
      const result = await Audio.Sound.createAsync(
        require("../../assets/sounds/button.mp3")
      );
      sound.current = result.sound;
      sound.current.setVolumeAsync(0.2);
    }
    loadSound();
  }, []);

  return (
    <ButtonBase {...props} onPress={onPress}>
      <Text variant="button" color="buttonText" align="center">
        {children}
      </Text>
    </ButtonBase>
  );
}

const ButtonBase = styled("TouchableOpacity", {
  fontFamily: "$playful",
  backgroundColor: "$primary",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 0,
  shadowColor: "$primaryDark",
  paddingHorizontal: "$medium",
  paddingVertical: "$small",
  borderRadius: "$medium",
}).attrs((p) => ({
  activeOpacity: 0.9,
}));
