import React, {useState, useEffect} from 'react';
import {View, Dimensions, Text} from 'react-native';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import CustomModal from '../../../Components/CustomModal/CustomModal';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import CustomTextField from '../../../Components/CustomTextField/CustomTextField';
import styles from './PaymentDetailStyling';
import {Colors} from '../../../Theme';
import {useSelector, useDispatch} from 'react-redux';
import {getbenefpaybill} from '../../../Redux/Action/Action';
import {wp} from '../../../Constant';
const screenWidth = Dimensions.get('window').width;

const PaymentDetail = React.memo((props) => {
  const consno = props.route.params?.data['benefAccount'];
  const ucid = props.route.params?.data['imd'];
  const companyname = props.route.params?.data['companyName'];
  const benefType = props.route.params?.data['benefType'].toString();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducers.token);

  const acc = useSelector((state) => state.reducers.viewAccountsData);
  const [myacc, changeacc] = useState(acc);
  const [showModal, changeModalState] = useState(false);
  const [showPurposeOfPayment, changePurposeOfPayment] = useState(false);
  const [paymenttext, changepaytext] = useState('Please select from');

  return (
    <View style={styles.container}>
      {/* <GlobalHeader navigation={props.navigation} /> */}
      <SubHeader
        navigation={props.navigation}
        title={
          props.route.params?.data['benefType'].toString() === '1'
            ? 'Fund Transfer'
            : props.route.params?.data['benefType'].toString() === '2'
            ? 'Inter Bank Fund Transfer'
            : props.route.params?.data['benefType'].toString() === '3'
            ? 'Utility Bill Payment'
            : props.route.params?.data['benefType'].toString() === '4'
            ? 'Mobile Bill Payment'
            : props.route.params?.data['benefType'].toString() === '5'
            ? 'Internet Bill Payment'
            : props.route.params?.data['benefType'].toString() === '6'
            ? 'Online Shopping'
            : props.route.params?.data['benefType'].toString() === '7'
            ? 'Insurance Payment'
            : props.route.params?.data['benefType'].toString() === '8'
            ? 'Education Payment'
            : props.route.params?.data['benefType'].toString() === '9'
            ? 'Investments'
            : props.route.params?.data['benefType'].toString() === '10'
            ? 'Other'
            : props.route.params?.data['benefType'].toString() === '11'
            ? 'Government Payments'
            : props.route.params?.data['benefType'].toString() === '13'
            ? '1Bill Credit Card Bills'
            : props.route.params?.data['benefType'].toString() === '14'
            ? '1Bill Top Up'
            : props.route.params?.data['benefType'].toString() === '15'
            ? '1Bill Voucher/ Fee Payment'
            : ''
        }
        description={
          props.route.params?.data['benefType'].toString() === '1'
            ? 'Transfer Funds to any NBP Account'
            : props.route.params?.data['benefType'].toString() === '2'
            ? 'Transfer Funds to any Banks Account'
            : props.route.params?.data['benefType'].toString() === '3'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '4'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '5'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '6'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '7'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '8'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '9'
            ? 'Pay for your Investments'
            : props.route.params?.data['benefType'].toString() === '10'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '11'
            ? 'Make Payments for your Taxes'
            : props.route.params?.data['benefType'].toString() === '13'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '14'
            ? 'Make Payments for your Bills'
            : props.route.params?.data['benefType'].toString() === '15'
            ? 'Make Payments for your Bills'
            : ''
        }
        internetBillPayment={
          props.route.params?.data['benefType'].toString() === '5'
            ? true
            : false
        }
        governmentPayments={
          props.route.params?.data['benefType'].toString() === '11'
            ? true
            : false
        }
        investment={
          props.route.params?.data['benefType'].toString() === '9'
            ? true
            : false
        }
        insurancePayment={
          props.route.params?.data['benefType'].toString() === '7'
            ? true
            : false
        }
        educationPayment={
          props.route.params?.data['benefType'].toString() === '8'
            ? true
            : false
        }
        onlineShopping={
          props.route.params?.data['benefType'].toString() === '6'
            ? true
            : false
        }
        fundsTransfer={
          props.route.params?.data['benefType'].toString() === '1'
            ? true
            : false
        }
        interBankTransfer={
          props.route.params?.data['benefType'].toString() === '2'
            ? true
            : false
        }
        utilityBillPayments={
          props.route.params?.data['benefType'].toString() === '3'
            ? true
            : false
        }
        mobilePayment={
          props.route.params?.data['benefType'].toString() === '4'
            ? true
            : false
        }
        creditCardBills={
          props.route.params?.data['benefType'].toString() === '13'
            ? true
            : false
        }
        topUp={
          props.route.params?.data['benefType'].toString() === '14'
            ? true
            : false
        }
        voucherPayment={
          props.route.params?.data['benefType'].toString() === '15'
            ? true
            : false
        }
        others={
          props.route.params?.data['benefType'].toString() === '10'
            ? true
            : false
        }
      />

      {props.route.params?.data['benefType'].toString() === '1' ||
      props.route.params?.data['benefType'].toString() === '2' ? (
        <View>
          <Text style={styles.title}>Transfer Funds From:</Text>
          <TabNavigator
            text={`Tap here to select an option`}
            // navigation={props.navigation}
            fontSize={wp(3.6)}
            width={'90%'}
            color={'white'}
            backgroundColor={Colors.primary_green}
            onPress={() => {
              changeModalState(true);
              // props.navigation.navigate('PaymentDescription');
            }}
          />
          <Text style={styles.title}>Purpose of Payment</Text>
          <TabNavigator
            text={`Others`}
            // navigation={props.navigation}
            fontSize={wp(4.5)}
            width={'90%'}
            onPress={() => {
              changeModalState(true);
              changePurposeOfPayment(true);
            }}
          />
          <Text style={styles.title}>Transfer Funds To:</Text>
          <TabNavigator
            text={`Others`}
            navigation={props.navigation}
            fontSize={wp(4.5)}
            width={'90%'}
            onPress={() => {
              changeModalState(true);
            }}
          />
          <Text style={styles.title}>Amount:</Text>

          <CustomTextField
            placeholder={'PKR'}
            Textfield_label={'Enter Debit/ATM Card Number'}
            onChangeText={(value) => {
              'Card number :';
            }}
            width={'90%'}
            keyboardType={'number-pad'}
          />
          <View style={styles.marginTop}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                changeAlertState(true);
              }}
              btn_width={screenWidth / 2}
              backgroundColor={Colors.primary_green}
            />
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.labelText}>Payment From:</Text>
          <TabNavigator
            text={paymenttext}
            navigation={props.navigation}
            fontSize={wp(4)}
            width={'95%'}
            onPress={() => {
              changeModalState(true);
              // props.navigation.navigate('PaymentDescription');
            }}
          />
          <Text style={styles.labelText}>Payment To:</Text>
          <TabNavigator
            text={`${props.route.params?.data['benefAccount']}`}
            navigation={props.navigation}
            multipleLines={2}
            fontSize={wp(4.4)}
            width={'95%'}
            hideOverlay={true}
            onPress={() => {
              changeModalState(true);
            }}
          />
          <View style={styles.margined}>
            <CustomBtn
              btn_txt={'Continue'}
              onPress={() => {
                // props.navigation.navigate('PaymentDescription', {
                //   data: props.route.params?.data,
                // });
                dispatch(
                  getbenefpaybill(
                    token,
                    props.navigation,
                    consno,
                    ucid,
                    paymenttext,
                    companyname,
                    benefType,
                  ),
                );
              }}
              btn_width={screenWidth / 2}
              backgroundColor={Colors.primary_green}
            />
          </View>
        </View>
      )}
      <CustomModal
        visible={showModal}
        headtext={'Please Select Option Below'}
        data={myacc}
        accounts={true}
        onPress_item={(param) => {
          changeModalState(false);
          changepaytext(param.account);
          changepaytext(`${param.accountType}-${param.account}`);
        }}
        accountNumber={true}
        onCancel={() => changeModalState(false)}
      />
      <CustomModal
        visible={showPurposeOfPayment}
        headtext={'Please Select Option Below'}
        data={myacc}
        accounts={true}
        onPress_item={(param) => {
          changePurposeOfPayment(false);

          // currentModal === 'others' ? changePurposeOfPayment(param) : null;
          // changeModalState(!showModalState);
          // currentModal === 'transferTo'
          //   ? changeTransferFundModalState(true)
          //   : null;
        }}
        onCancel={() => changePurposeOfPayment(false)}
      />
    </View>
  );
});

export default PaymentDetail;
