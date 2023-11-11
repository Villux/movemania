import LottieView from "lottie-react-native";
import { Fragment, useEffect, useRef } from "react";
import { Audio } from "expo-av";

import { Reward } from "./types";
import { Overlay, Text } from "./components";
import { rewardAssets } from "../assets/assets";

export function FoundRewardOverlay({
  reward,
  hide,
}: {
  reward: Reward;
  hide: () => void;
}) {
  const lottieRef = useRef<LottieView>(null);
  const assets = rewardAssets[reward];

  useEffect(() => {
    async function handle() {
      const { sound } = await Audio.Sound.createAsync(assets.sound);
      sound.playAsync().catch((e) => console.log(e));
      lottieRef.current?.play();
    }

    setTimeout(handle, 500);
  }, []);

  return (
    <Overlay>
      <Fragment>
        <Text style={{ textAlign: "center" }}>You've found a {reward}!</Text>
        <LottieView
          ref={lottieRef}
          loop={false}
          autoPlay={false}
          speed={1.5}
          style={{ width: 200, height: 200 }}
          source={assets.animation}
          onAnimationFinish={() => hide()}
        />
      </Fragment>
    </Overlay>
  );
}
