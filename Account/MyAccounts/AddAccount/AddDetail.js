import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import {globalStyling, wp} from '../../../../Constant';
import CustomTextField from '../../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../../Theme';
import {
  // addAccountCreate,
  addAccountPut,
  setCurrentFlow,
} from '../../../../Redux/Action/Action';
import {useDispatch} from 'react-redux';
import I18n from '../../../../Config/Language/LocalizeLanguageString';
import analytics from '@react-native-firebase/analytics';
export default function AddDetail(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const [accountTitle, setAccountTitle] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [atmPin, setAtmPin] = useState('');
  const dispatch = useDispatch();
  const checkValidation = () => {
    if (cardNumber.length !== 16) {
      global.showToast.show(I18n['Please enter a valid card number.'], 1000);
    } else if (atmPin.length !== 4) {
      global.showToast.show(I18n['Invalid ATM pin.'], 1000);
    } else {
      // dispatch(
      //   addAccountCreate(atmPin, cardNumber, props.route.params?.data.cnic),
      // );
      dispatch(
        addAccountPut(
          props.navigation,
          atmPin,
          cardNumber,
          props.route.params?.data.cnic,
          props.route.params?.data ? props.route.params?.data : {},
        ),
      );
    }
  };

  React.useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(setCurrentFlow('Add Account'));
    });
    async function analyticsLog() {
      await analytics().logEvent('AddAccountDetail');
    }
    analyticsLog();
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={40}
      style={globalStyling.container}
      accessibilityLabel="Add Details Screen">
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Add Account'}
        description={'Link your other accounts'}
        addAccount={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Account Title:</Text>
        <Text style={styles.fixedTitle}>
          {String(props.route.params?.data.title).toUpperCase()}
        </Text>
        <Text style={styles.label}>Enter Debit/ATM Card Number:</Text>
        <CustomTextField
          ref={ref1}
          placeholder={'e.g: XXXXXXXXXXXXXXXX'}
          text_input={cardNumber}
          onChangeText={(value) => {
            setCardNumber(String(value).replace(/[^0-9]/g, ''));
          }}
          onSubmitEditing={() => {
            ref2.current.focus();
          }}
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
          maxLength={16}
          keyboardType="number-pad"
        />
        <Text style={styles.label}>Enter Debit Card PIN:</Text>
        <CustomTextField
          ref={ref2}
          placeholder={'e.g: XXXX'}
          onChangeText={(value) => {
            setAtmPin(value);
          }}
          keyboardType="number-pad"
          ispass={true}
          maxLength={4}
        />
        <View style={{marginTop: wp(4)}}>
          <CustomBtn
            accessibilityLabel="Add Account"
            btn_txt={'Add Account'}
            onPress={() => {
              checkValidation();
            }}
            btn_width={wp(50)}
            backgroundColor={Colors.primary_green}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    width: '85%',
    alignSelf: 'center',
    fontSize: wp(4.3),
    paddingVertical: wp(4),
  },
  fixedTitle: {
    width: '92%',
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: wp(0.15),
    borderColor: Colors.primary_green,
    paddingVertical: wp(3.5),
    fontSize: wp(4),
    borderRadius: wp(1),
  },
});
