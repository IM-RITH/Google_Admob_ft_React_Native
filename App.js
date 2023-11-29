import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "expo-dev-client";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { useEffect, useState } from "react";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
const adUnitId_2 = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
// interstitial ads
const interstitial = InterstitialAd.createForAdRequest(adUnitId_2, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});
// reward ads
const adUnitId_3 = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loaded2, setLoaded2] = useState(false);
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);
  //No advert ready to show yet
  if (!loaded) {
    return null;
  }

  // reward ads
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded2(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded2) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContainer}>
        <Text>Google Admob with React Native</Text>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.LARGE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
        <StatusBar style="auto" />
        {/* Interstitial Ads */}
        <TouchableOpacity
          style={styles.showIntertail}
          onPress={() => interstitial.show()}
        >
          <Text>Show Interstitial Ads</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.showReward}
          onPress={() => rewarded.show()}
        >
          <Text>Show Reward Ads</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  viewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  showIntertail: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    top: 20,
  },
  showReward: {
    width: 300,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    top: 30,
  },
});
