//import liraries
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

// create a component
export default function NetworkConnectivityToast() {
  const netinfo = useNetInfo();
  let networkConnectivity = null;
  let isInternetReachable = null;
  let isInternetConnectionExpensive = null;

  if (netinfo && netinfo.details) {
    networkConnectivity = !netinfo.isConnected
      ? 'Check Your Internet Connectivity (Wifi or Cellular Data)'
      : !netinfo.isInternetReachable
      ? 'Check Your Internet Connectivity (Wifi or Cellular Data)'
      : null;
  }

  useEffect(() => {
    if (networkConnectivity) {
      global.showToast.show(networkConnectivity, 5000);
    }
  }, [networkConnectivity]);

  return <View></View>;
}
