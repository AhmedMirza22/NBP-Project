import React, {useEffect} from 'react';
import {View, Text, StyleSheet, BackHandler} from 'react-native';
import SubHeader from '../../../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomBtn from '../../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../../Theme';
import {CommonActions} from '@react-navigation/native';
import {wp} from '../../../../../Constant';
import {setCurrentFlow} from '../../../../../Redux/Action/Action';
import {useDispatch} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

export default function InterBankFundsTransferResponse(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    props.navigation.addListener(
      'focus',
      () => {
        dispatch(setCurrentFlow('Interbank Fund Transfer'));
        async function analyticsLog() {
          await analytics().logEvent('IBFTFundTransferResponseScreen');
        }
        analyticsLog();
      },
      [],
    );
  }, []);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container} accessibilityLabel="IBFT Response">
      <SubHeader
        // transfers={true}
        navigation={props.navigation}
        title={'Interbank Fund Transfer'}
        description={'Transfer funds to other bank accounts'}
        onNavigation={() => {}}
      />

      <View
        style={{
          flex: 0.8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.whiteContainer}>
          <Text style={styles.text}>
            {props.route.params?.data.transactionDetails.displayMessage}
          </Text>
          <View style={styles.marginVertical}>
            <CustomBtn
              btn_txt={'OK'}
              accessibilityLabel="Tap to Proceed"
              onPress={() => {
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              }}
              btn_width={wp(50)}
              backgroundColor={Colors.primary_green}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    width: '90%',
    fontSize: wp(4),
    alignSelf: 'center',
    marginTop: wp(10),
  },
  whiteContainer: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    marginVertical: wp(5),
    padding: wp(2),
  },
  response: {
    fontSize: wp(4.2),
  },
  marginVertical: {
    marginTop: wp(10),
    marginBottom: wp(10),
  },
});
