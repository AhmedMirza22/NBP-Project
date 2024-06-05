import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import styles from './PaymentDescriptionStyling';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {Colors} from '../../../Theme';
import CustomAlert from '../../../Components/Custom_Alert/CustomAlert';
import i18n from "../../../Config/Language/LocalizeLanguageString";
const screenWidth = Dimensions.get('screen').width;
import {useSelector, useDispatch} from 'react-redux';
import {billpaymentbeeficiary} from '../../../Redux/Action/Action';
import {currencyFormat, globalStyling} from '../../../Constant';
import {TouchableWithoutFeedback} from 'react-native';
import {Keyboard} from 'react-native';

export default function PaymentDescription(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.billObject);
  const fromacc = props.route.params?.data['fromAccount'];
  const toacc = props.route.params?.data['consumerNumber'];
  const amount = token.amountPayable;
  const customername = token.customerName;
  const billername = props.route.params?.data['biller'];
  const due = token.dueDate;
  const status = token.billStatus;
  const billtoken = token.billToken;
  const benefitype = props.route.params?.data.benifType;
  const imd = token.imd;
  const benefiId = token.benefID;

  const [showAlert, changeAlertState] = useState(false);
  const [comments, changecomm] = useState('');
  const [ammount, changeamm] = useState();
  const [email, chnageemail] = useState('');
  const [phoneno, changeno] = useState('');
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={40}
        style={globalStyling.whiteContainer}
        accessibilityLabel="Payment Description Screen">
        {/* <GlobalHeader navigation={props.navigation} /> */}
        <SubHeader
          navigation={props.navigation}
          title={
            props.route.params?.data.benifType === '1'
              ? 'Fund Transfer'
              : props.route.params?.data.benifType === '2'
              ? 'Inter Bank Fund Transfer'
              : props.route.params?.data.benifType === '3'
              ? 'Utility Bill Payment'
              : props.route.params?.data.benifType === '4'
              ? 'Mobile Bill Payment'
              : props.route.params?.data.benifType === '5'
              ? 'Internet Bill Payment'
              : props.route.params?.data.benifType === '6'
              ? 'Online Shopping'
              : props.route.params?.data.benifType === '7'
              ? 'Insurance Payment'
              : props.route.params?.data.benifType === '8'
              ? 'Education Payment'
              : props.route.params?.data.benifType === '9'
              ? 'Investments'
              : props.route.params?.data.benifType === '10'
              ? 'Other'
              : props.route.params?.data.benifType === '11'
              ? 'Government Payments'
              : props.route.params?.data.benifType === '13'
              ? '1Bill Credit Card Bills'
              : props.route.params?.data.benifType === '14'
              ? '1Bill Top Up'
              : props.route.params?.data.benifType === '15'
              ? '1Bill Voucher/ Fee Payment'
              : ''
          }
          description={
            props.route.params?.data.benifType === '1'
              ? 'Transfer Funds to any NBP Account'
              : props.route.params?.data?.benifType === '2'
              ? 'Transfer Funds to any Banks Account'
              : props.route.params?.data?.benifType === '3'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '4'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '5'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '6'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '7'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '8'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '9'
              ? 'Pay for your Investments'
              : props.route.params?.data?.benifType === '10'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '11'
              ? 'Make Payments for your Taxes'
              : props.route.params?.data?.benifType === '13'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '14'
              ? 'Make Payments for your Bills'
              : props.route.params?.data?.benifType === '15'
              ? 'Make Payments for your Bills'
              : ''
          }
          internetBillPayment={
            props.route.params?.data?.benifType === '5' ? true : false
          }
          governmentPayments={
            props.route.params?.data?.benifType === '11' ? true : false
          }
          investment={
            props.route.params?.data?.benifType === '9' ? true : false
          }
          insurancePayment={
            props.route.params?.data?.benifType === '7' ? true : false
          }
          educationPayment={
            props.route.params?.data?.benifType === '8' ? true : false
          }
          onlineShopping={
            props.route.params?.data?.benifType === '6' ? true : false
          }
          fundsTransfer={
            props.route.params?.data?.benifType === '1' ? true : false
          }
          interBankTransfer={
            props.route.params?.data?.benifType === '2' ? true : false
          }
          utilityBillPayments={
            props.route.params?.data?.benifType === '3' ? true : false
          }
          mobilePayment={
            props.route.params?.data?.benifType === '4' ? true : false
          }
          creditCardBills={
            props.route.params?.data?.benifType === '13' ? true : false
          }
          topUp={props.route.params?.data?.benifType === '14' ? true : false}
          voucherPayment={
            props.route.params?.data?.benifType === '15' ? true : false
          }
          others={props.route.params?.data?.benifType === '10' ? true : false}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={globalStyling.whiteContainer}>
          <Text style={styles.title}>Please Confirm Details Below:</Text>
          <View style={styles.viewStyle}>
            <View style={styles.row}>
              <Text style={styles.text}>From Account:</Text>
              <Text style={styles.textAligned}>{fromacc}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Policy Number:</Text>
              <Text style={styles.textAligned}>{toacc}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Bill Details:</Text>
              <Text style={styles.textAligned}>{customername}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Biller Name:</Text>
              <Text style={styles.textAligned}>{billername}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Amount:</Text>
              <Text style={styles.textAligned}>
                {currencyFormat(Number(amount))}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Due Date:</Text>
              <Text style={styles.textAligned}>{due}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Status:</Text>
              <Text style={styles.textAligned}>{status}</Text>
            </View>
          </View>
          <View style={{marginVertical: 12}}>
            <CustomTextField
              ref={ref1}
              placeholder={'Amount (Full/Partial of Bill Amount)'}
              accessibilityLabel={'Amount (Full/Partial of Bill Amount)'}
              Textfield_label={''}
              text_input={ammount}
              onChangeText={(value) => {
                changeamm(String(value).replace(/[^0-9]/g, ''));
              }}
              onSubmitEditing={() => {
                ref2.current.focus();
              }}
              currencyInput={true}
              returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
              keyboardType={'number-pad'}
              width={'90%'}
            />
          </View>
          <View style={{marginVertical: 12}}>
            <CustomTextField
              ref={ref2}
              placeholder={'Comments (Optional)'}
              Textfield_label={'Enter Debit/ATM Card Number'}
              accessibilityLabel={'Enter Debit/ATM Card Number'}
              onChangeText={(value) => {
                changecomm(value);
              }}
              onSubmitEditing={() => {
                ref3.current.focus();
              }}
              returnKeyType={'next'}
              width={'90%'}
              maxLength={50}
            />
          </View>
          <View style={{marginVertical: 12}}>
            <CustomTextField
              ref={ref3}
              placeholder={'Phone (Optional)'}
              accessibilityLabel={'Phone (Optional)'}
              Textfield_label={''}
              text_input={phoneno}
              onChangeText={(value) => {
                changeno(String(value).replace(/[^0-9]/g, ''));
              }}
              onSubmitEditing={() => {
                ref4.current.focus();
              }}
              maxLength={11}
              returnKeyType={'next'}
              width={'90%'}
            />
          </View>
          <View style={{marginVertical: 12}}>
            <CustomTextField
              ref={ref4}
              placeholder={'Email (Optional)'}
              Textfield_label={'Enter Debit/ATM Card Number'}
              accessibilityLabel={'Enter Debit/ATM Card Number'}
              onChangeText={(value) => {
                chnageemail(value);
              }}
              keyboardType={'email-address'}
              width={'90%'}
            />
          </View>
          {status && status === 'Paid' ? null : (
            <View style={styles.margined}>
              <CustomBtn
                btn_txt={'Submit'}
                accessibilityLabel={'Submit'}
                onPress={() => {
                  // changeAlertState(true);
                  dispatch(
                    billpaymentbeeficiary(
                      token,
                      props.navigation,
                      billtoken,
                      toacc,
                      benefitype,
                      imd,
                      amount,
                      benefiId,
                      comments,
                      billername,
                      customername,
                      fromacc,
                    ),
                  );
                }}
                btn_width={screenWidth / 2}
                backgroundColor={Colors.primary_green}
              />
            </View>
          )}
          <CustomAlert
            overlay_state={showAlert}
            onPressCancel={() => {
              changeAlertState(false);
            }}
            yesNoButtons={true}
            onPressYes={() => changeAlertState(false)}
            onPressNo={() => changeAlertState(false)}
            iscancelbtn={false}
            onPressOkay={() => {
              // changeAppeaedOnceState(false);
              changeAlertState(false);
            }}
            title={'Bill Payment'}
            alert_text={i18n['Do you want to proceed with the transaction.']}
            accessibilityLabel={'Do you want to proceed with the transaction.'}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
