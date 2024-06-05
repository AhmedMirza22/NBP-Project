import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import I18n from '../../Config/Language/LocalizeLanguageString';
import Modal from 'react-native-modal';
import {Colors, Images} from '../../Theme';
import CustomBtn from '../../Components/ModalButton/ModalButton';
import {globalStyling, wp, hp} from '../../Constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {fontFamily} from '../../Theme/Fonts';
import CustomText from '../CustomText/CustomText';
import {TouchableHighlight} from 'react-native';
import {logs} from '../../Config/Config';
import {isRtlState} from '../../Config/Language/LanguagesArray';
import {useTheme} from '../../Theme/ThemeManager';
import store from '../../Redux/Store/Store';
import {closeInformationAlert} from '../../Redux/Action/Action';
import HTML from 'react-native-render-html';
import {ScrollView} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const InformationAlert = (props) => {
  const dispatch = useDispatch();
  const pageInformation = useSelector(
    (state) => state?.reducers?.InformationPage?.props,
  );
  const userObject = useSelector((state) => state?.reducers?.userObject);
  const AccountFormat = userObject?.ftPayment?.accountFormat;
  const bankName = userObject?.ftPayment?.bankName;
  let parts = AccountFormat?.split(/<br \\>|<br \/>/);
  let modifiedAccountFormat = parts?.join('');
  logs.log('bankName', bankName);
  const {activeTheme} = useTheme();
  // const pageInformation = store.getState()?.reducers?.InformationPage?.props;
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const onContentSizeChange = (contentHeight) => {
    const maxHeight = 80;
    if (contentHeight > maxHeight && !scrollEnabled) {
      setScrollEnabled(true);
    } else if (contentHeight <= maxHeight && scrollEnabled) {
      setScrollEnabled(false);
    }
  };
  const fundTransfer = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          Transfer funds swiftly on your fingertips.
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'yellow',
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Funds can be transferred using RAAST, IBFT, LFT, CNIC and QR
                RAAST Channel.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Complete recipient details and amount will be required to
                complete the payment.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const newTransfer = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          Transfer funds swiftly on your fingertips.
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'yellow',
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Funds can be transferred using RAAST or 1Link Channel.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Complete recipient details and amount will be required to
                complete the payment.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const raastId = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Raast Payments
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'yellow',
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                RAAST is an instant payment system developed by the State Bank
                of Pakistan.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Creating your RAAST ID helps others send payments to you using
                your mobile number only without remembering account numbers or
                IBANs.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Mobile Number & IBAN are two optional fields available to
                conduct RAAST transfer.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const ibftandft = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Transfer funds easily to NBP and other bank accounts with ease.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Select Bank to transfer.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter recipient details, select purpose of payment and enter
                amount to transfer.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const qrRaast = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Experience quick and secure payments by scanning QR codes with
                RAAST medium.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Upload RAAST QR code from gallery or scan from Camera.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter amount to pay to complete the transaction.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const cnic = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Seamlessly transfer funds using CNIC details for quick payments.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Choose the purpose of payment for the transaction to initiate
                the transfer process.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter beneficiary’s CNIC, mobile number, and amount to complete
                the process.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const ibft = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: Colors.backgroundColor,
            padding: wp(2),
            width: wp(80),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}>
            <CustomText
              style={{
                fontWeight: 'bold',
                fontSize: wp(3),
                padding: wp(1),
                marginTop: wp(1),
                textAlign: 'center',
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
              }}>
              Effortlessly transfer funds across different banks with
              convenience.
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}>
            <CustomText
              style={{
                fontSize: wp(3),
                alignSelf: 'center',
                textAlign: 'center',
                padding: wp(1),
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
              }}>
              Transfer funds seamlessly between different banks.
            </CustomText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}>
            <CustomText
              style={{
                fontSize: wp(3),
                alignSelf: 'center',
                textAlign: 'center',
                padding: wp(1),
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
              }}>
              Conduct convenient interbank transactions.
            </CustomText>
          </View>
        </View>
        <View style={{height: hp(2)}} />
        <View style={{height: wp(8)}}></View>
      </>
    );
  };

  const utilityBill = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Transaction bill payments swiftly by selecting desired biller.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Select wide range of billers listed in the sub menu.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Choose the specific company associated with the selected biller.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the consumer number linked with the selected company.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Download E-Transaction Receipt upon confirmation of payment.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const bill1Payment = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Execute seamless payments to 1Bill registered consumers.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Enter payment voucher, topup or credit card whichever aligns
                with the transaction type.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter consumer number associated with selected type of payment
                to complete payment process.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const donation = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Make charitable contributions from the comfort of your home.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Choose the specific charity representing the cause you wish to
                support.
              </CustomText>
            </View>
          </View>

          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the desired donation amount to contribute to the selected
                cause.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const debitCard = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Effortlessly manage your existing debit cards and request new
                UPI/Paypak debit cards for enhanced financial control.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Select Debit Card to view debit card details.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Manage existing debit cards through available options.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Request a new UPI/Paypak Debit Card for added convenience.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const virtualCard = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Place request for Digital Debit Card.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Take control of your digital finances by making secure
                e-commerce payments.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Digital Debit Card can be used for local & International QRC
                Payments for Online & Physical Purchases.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const EducationPayments = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Submit education fees within few clicks.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Select the specific institute you intend to make a payment to.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the Consumer Number associated with the selected payee for
                swift payment.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const MobileTopup = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Recharge mobile balance swiftly from the comfort of your home.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Select Telco from the given list.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Select type of Topup Prepaid or Postpaid.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter mobile number and amount to recharge.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const Sports = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Under this option the members of NBP Sports Complex can make
                payments of club fees from the comfort of their home.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter amount to pay.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter Member ID to complete payment process.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const FBRTaxPayments = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Make payments swiftly to existing beneficiaries by selecting
                from the given list.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Select "Pay to New Beneficiary" to initiate a new payment.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the beneficiary's information using their Mobile Number,
                CNIC Number, Account Number, or Consumer Number.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the beneficiary's information using their Mobile Number,
                CNIC Number, Account Number, or Consumer Number.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const BeneficiaryPayments = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Make payments swiftly to existing beneficiaries by selecting
                from the given list.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Select Pay to New Beneficiary to initiate a new payment.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the beneficiary's information using their Mobile Number,
                CNIC Number, Account Number, or Consumer Number.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const MyAccounts = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Efficiently manage account related activities.
              </CustomText>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                View details related to transaction activity.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Add or delete multiple accounts registered against CNIC.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Set default account settings, as preferred.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Download various account related “Certificates” at your
                fingertips.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                View your accrued profit earned against your saving account.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Customize your transaction limit for the listed payment methods,
                as per need of the hour.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Review your utilized limit against the total assigned limit.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const GovernmentPayments = () => {
    return (
      <>
        <View
          style={{
            padding: wp(2),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              {/* <CustomText
                style={{
                  fontSize: wp(4),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(80),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
             Transact payments conveniently to government entities to the given list of payees. 
              </CustomText> */}
            </View>
          </View>
        </View>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Transact payments conveniently to government entities to the
                given list of payees.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Choose the specific payee you intend to make a payment to.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(75),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter the Consumer Number corresponding to the selected payee
                for a quick and secure transaction.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const DynamicModal = () => {
    return (
      <View
        style={{
          padding: wp(2),
          width: wp(85),
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: wp(75),
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: Colors.backgroundColor,
            marginBottom: hp(2),
            padding: wp(1),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}>
            <CustomText
              style={{
                fontSize: wp(3.5),
                alignSelf: 'center',
                textAlign: 'center',
                padding: wp(1),
                width: wp(60),
                fontFamily: fontFamily['ArticulatCF-DemiBold'],
              }}>
              {modifiedAccountFormat}
            </CustomText>
          </View>
        </View>
      </View>
    );
  };

  const AcountNoINfo = () => {
    return (
      <View
        style={{
          padding: wp(2),
          width: wp(85),
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: wp(75),
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: Colors.backgroundColor,
            marginBottom: hp(2),
            padding: wp(1),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
            }}>
            <HTML
              source={{html: pageInformation?.accountFormat}}
              baseFontStyle={{fontSize: wp(4), color: 'grey'}}
              containerStyle={{
                width: '90%',
                alignSelf: 'center',
                marginVertical: wp(2),
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const InternetPayments = () => {
    return (
      <>
        {/* <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Internet Payments?
        </CustomText> */}
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Conduct Internet Payments from the comfort of your home.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Enter consumer number to complete the payment process.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(0.5),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Select biller from the given list
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };
  const BillerRef = () => {
    return (
      <View
        style={{
          padding: wp(2),
          width: wp(85),
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            width: wp(80),
            alignItems: 'center',
            alignSelf: 'center',
            // backgroundColor: Colors.backgroundColor,
            marginBottom: hp(2),
            padding: wp(1),
          }}>
          <View style={{overflow: 'hidden', width: wp(60), height: wp(60)}}>
            <Image
              source={{uri: `${pageInformation.billerRefImage}`}}
              style={[globalStyling.image]}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    );
  };

  const PayViaRaast = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Raast Payments?
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Raast Payment is Pakistan Modern payment solution by the
                Statebank. Instanltly transfer money 24/7
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                You can send money using beneficiary mobile number or iban
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(0.5),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                You can link and delink your Raast ID which is your Mobile
                Number
              </CustomText>
            </View>
          </View>
          {/* <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                You can send & recieve money using QR code
              </CustomText>
            </View>
          </View> */}
        </View>
      </>
    );
  };

  const Investment = () => {
    return (
      <>
        {/* <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Investments?
        </CustomText> */}
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Manage your savings by exploring investment options.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Select investment option from the given list.
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(0.5),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                Visit website to inquire about available options.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const LimitManagement = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Limit Management?
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Customize your transaction limit for the listed payment methods,
                as per need of the hour.
              </CustomText>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                Review your utilized limit against the total assigned limit.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };

  const MyProfit = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          What is Profit ?
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                View your accrued profit earned against your saving account.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };
  const newIbft = () => {
    return (
      <>
        <CustomText
          style={{
            fontSize: wp(4),
            alignSelf: 'center',
            padding: wp(1),
          }}>
          Mobile Number & IBAN are two optional fields available to conduct
          RAAST transfer.
        </CustomText>
        <View
          style={{
            padding: wp(2),
            width: wp(85),
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'yellow',
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.75),
                  padding: wp(1),
                  marginTop: wp(1),
                  textAlign: 'center',
                  width: wp(60),
                }}>
                In case selected bank is not a member of RAAST, please switch to
                1Link Channel..
              </CustomText>
            </View>
          </View>
          <View
            style={{
              width: wp(85),
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.backgroundColor,
              marginBottom: hp(2),
              padding: wp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}>
              <CustomText
                style={{
                  fontSize: wp(3.5),
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: wp(1),
                  width: wp(60),
                  fontFamily: fontFamily['ArticulatCF-DemiBold'],
                }}>
                RAAST ID can be linked/delinked from RAAST ID Management icon
                available on floating menu.
              </CustomText>
            </View>
          </View>
        </View>
      </>
    );
  };
  // const Utility = () => {
  //   return (
  //     <Modal
  //       animationIn="slideInRight"
  //       animationOut="slideOutRight"
  //       onBackButtonPress={() => {
  //         setTimeout(() => {
  //           props.onPressCancel ? props.onPressCancel() : null;
  //         }, 300);
  //       }}
  //       isVisible={props.overlay_state}
  //       backdropOpacity={0.3}
  //       onBackdropPress={() => {
  //         setTimeout(() => {
  //           props.onPressCancel ? props.onPressCancel() : null;
  //         }, 300);
  //       }}>
  //       <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
  //         <View
  //           style={{
  //             flexDirection: 'column',
  //             justifyContent: 'center',
  //             flex: 1,
  //           }}>
  //           <View
  //             style={{
  //               backgroundColor: activeTheme.alertBackGroundColor,
  //               maxHeight: wp(180),
  //               borderRadius: wp(1),
  //               padding: wp(2),
  //             }}>
  //             <AntDesign
  //               name={'closecircle'}
  //               size={wp(5)}
  //               color={Colors.themeGrey}
  //               style={{alignSelf: 'flex-end'}}
  //               onPress={() => {
  //                 props.onPressCancel();
  //               }}
  //             />

  //             <Image
  //               source={Images.alertIcon}
  //               style={{
  //                 alignSelf: 'center',
  //                 width: wp(15),
  //                 height: wp(15),
  //               }}
  //             />
  //             <View
  //               style={{
  //                 padding: wp(2),
  //                 alignItems: 'center',
  //                 alignSelf: 'center',
  //               }}>
  //               <View
  //                 style={{
  //                   alignItems: 'center',
  //                   alignSelf: 'center',
  //                   padding: wp(1),
  //                 }}>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'baseline',
  //                   }}>
  //                   <CustomText
  //                     style={{
  //                       fontSize: wp(4),
  //                       alignSelf: 'center',
  //                       textAlign: 'center',
  //                       padding: wp(1),
  //                       width: wp(80),
  //                       fontWeight: 'bold',
  //                       fontFamily: fontFamily['ArticulatCF-DemiBold'],
  //                     }}>
  //                     Where to find your Consumer Number?
  //                   </CustomText>
  //                 </View>
  //               </View>
  //             </View>
  //             <View
  //               style={{
  //                 padding: wp(2),
  //                 width: wp(85),
  //                 alignItems: 'center',
  //                 alignSelf: 'center',
  //               }}>
  //               <View
  //                 style={{
  //                   width: wp(75),
  //                   alignItems: 'center',
  //                   alignSelf: 'center',
  //                   backgroundColor: Colors.backgroundColor,
  //                   marginBottom: hp(2),
  //                   padding: wp(1),
  //                 }}>
  //                 <View>
  //                   <Image
  //                     resizeMode="contain"
  //                     source={require('../../Assets/KE.png')}
  //                   />
  //                 </View>
  //               </View>
  //             </View>

  //             {props.yesNoButtons ? (
  //               <View
  //                 style={{
  //                   flexDirection: 'column',
  //                   alignItems: 'center',
  //                   justifyContent: 'space-around',
  //                   width: '80%',
  //                 }}>
  //                 <CustomBtn
  //                   btn_txt={I18n['Yes']}
  //                   onPress={() => {
  //                     props.onPressYes();
  //                   }}
  //                   btn_width={wp(70)}
  //                   backgroundColor={Colors.primary_green}
  //                 />
  //                 <View style={{height: wp(5)}}></View>
  //                 <CustomBtn
  //                   btn_txt={'No'}
  //                   onPress={() => {
  //                     props.onPressNo();
  //                   }}
  //                   btn_width={wp(70)}
  //                   color={Colors.blackColor}
  //                   backgroundColor={Colors.lightGrey}
  //                 />
  //               </View>
  //             ) : (
  //               <CustomBtn
  //                 btn_txt={'Ok'}
  //                 onPress={() => {
  //                   props.onPressOkay();
  //                 }}
  //                 btn_width={wp(70)}
  //                 backgroundColor={Colors.primary_green}
  //               />
  //             )}
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>
  //   );
  // };

  const openModal = () => {
    switch (pageInformation?.page) {
      case 'RAAST':
        return fundTransfer();
      case 'newTransfer':
        return newTransfer();
      case 'raastId':
        return raastId();
      case 'qrRaast':
        return qrRaast();
      case 'cnic':
        return cnic();
      case 'ibftandft':
        return ibftandft();
      case 'ibft':
        return ibft();
      case 'utilityBill':
        return utilityBill();
      case 'bill1Payment':
        return bill1Payment();
      case 'donation':
        return donation();
      case 'virtualCard':
        return virtualCard();
      case 'debitCard':
        return debitCard();
      case 'EducationPayments':
        return EducationPayments();
      case 'MobileTopup':
        return MobileTopup();
      case 'Sports':
        return Sports();
      case 'newIBFT':
        return newIbft();
      case 'FBRTaxPayments':
        return FBRTaxPayments();
      case 'BeneficiaryPayments':
        return BeneficiaryPayments();
      case 'MyAccounts':
        return MyAccounts();
      case 'GovernmentPayments':
        return GovernmentPayments();
      case 'AcountNoINfo':
        return AcountNoINfo();
      case 'BillerRef':
        return BillerRef();
      case 'PayViaRaast':
        return PayViaRaast();
      case 'Investment':
        return Investment();
      case 'internetBillPayment':
        return InternetPayments();
      case 'limitManagement':
        return LimitManagement();
      case 'myProfit':
        return MyProfit();

      default:
        return null;
    }
  };

  return (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackButtonPress={() => {
        setTimeout(() => {
          props.onPressCancel ? props.onPressCancel() : null;
        }, 300);
      }}
      isVisible={pageInformation?.state}
      backdropOpacity={0.3}
      onBackdropPress={() => {
        setTimeout(() => {
          props.onPressCancel ? props.onPressCancel() : null;
        }, 300);
      }}>
      <View
        style={{
          backgroundColor: activeTheme.alertBackGroundColor,
          maxHeight: hp(80),
          borderRadius: wp(1),
          padding: wp(2),
        }}>
        <AntDesign
          name={'closecircle'}
          size={wp(5)}
          color={Colors.themeGrey}
          style={{alignSelf: 'flex-end'}}
          onPress={() => {
            dispatch(closeInformationAlert());
          }}
        />

        {/* <Image
          source={Images.alertIcon}
          style={{
            alignSelf: 'center',
            width: wp(15),
            height: wp(15),
          }}
        /> */}
        <CustomText
          style={{
            fontSize: wp(4.5),
            alignSelf: 'center',
            padding: wp(2),
            fontFamily: fontFamily['ArticulatCF-DemiBold'],
            fontWeight: 'bold',
          }}>
          {pageInformation?.title}
        </CustomText>
        {/* {openModal()}
         */}
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={onContentSizeChange}
          showsVerticalScrollIndicator={false}>
          {openModal()}
        </ScrollView>
        <CustomBtn
          btn_txt={'Ok'}
          onPress={() => {
            dispatch(closeInformationAlert());
          }}
          btn_width={wp(70)}
          backgroundColor={Colors.primary_green}
        />
      </View>
    </Modal>
  );
};

export default InformationAlert;
