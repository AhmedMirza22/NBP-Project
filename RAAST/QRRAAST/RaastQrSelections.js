import React, {useEffect} from 'react';
import {View} from 'react-native';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {useSelector, useDispatch} from 'react-redux';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {globalStyling, hp} from '../../../Constant';
import {
  setUserObject,
  setAppAlert,
  QRParsing,
  helpInforamtion,
} from '../../../Redux/Action/Action';
import {logs} from '../../../Config/Config';
import {launchImageLibrary} from 'react-native-image-picker';
import {QRreader} from 'react-native-qr-decode-image-camera';
import {Colors} from '../../../Theme';
import InformationIcon from '../../../Components/InformationIcon/InformationIcon';

const RaastQrSelections = (props) => {
  const goBack = (Expire) => {
    if (Expire) {
      dispatch(setAppAlert('Expired QR', '', props.navigation));
    } else {
      dispatch(setAppAlert('Invalid QR', '', props.navigation));
    }
  };
  const dispatch = useDispatch();

  const cameraOffFunction = () => {};
  return (
    <View
      style={[
        globalStyling.container,
        {backgroundColor: Colors.backgroundColor},
      ]}
      accessibilityLabel="Select Type of Transfer">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        // transfers={true}
        navigation={props.navigation}
        title="QR Raast Payments"
        description="Transfer Funds to other Account"
        navigateHome={true}
      />
      <View style={{height: hp(2.5)}} />

      <TabNavigator
        accessibilityLabel="Press for Gallery"
        text=" Gallery"
        border={true}
        Gallery={true}
        // navigation={props.navigation}
        onPress={() => {
          // console.log('ImagePicker');
          launchImageLibrary({}, (response) => {
            // console.log('Response = ', response);
            // console.log('Response Inner = ', response.uri);

            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              // console.log('User tapped custom button: ', response.customButton);
            } else {
              logs.log('in else');
              if (response.assets[0].uri) {
                logs.log('if response.uri', response.assets[0].uri);
                var path = response.assets[0].path;
                if (!path) {
                  path = response.assets[0].uri;
                  logs.log('path', path);
                }
                QRreader(path)
                  .then(async (data) => {
                    let obj = {};
                    // console.log('QR Code:', data);
                    obj.data = data;
                    dispatch(
                      QRParsing(
                        obj,
                        cameraOffFunction,
                        goBack,
                        props.navigation,
                      ),
                    );
                  })
                  .catch((err) => {
                    logs.log('error', err);
                    dispatch(
                      setAppAlert(
                        'Invalid Qr Image',
                        '',
                        props.navigation,
                        () => {},
                      ),
                    );
                  });
              }
            }
          });
        }}
        boldFont={true}
      />
      <TabNavigator
        accessibilityLabel="Press for Camera"
        text=" Camera"
        border={true}
        Camera={true}
        // navigation={props.navigation}
        onPress={() => {
          props.navigation.navigate('SendMoneyRAAST');
          //   QRScreenNavigate();
        }}
        boldFont={true}
      />
      <InformationIcon
        onPress={() => {
          dispatch(
            helpInforamtion({
              title: 'QR RAAST',
              page: 'qrRaast',
              state: true,
            }),
          );
        }}
      />
    </View>
  );
};

export default RaastQrSelections;
