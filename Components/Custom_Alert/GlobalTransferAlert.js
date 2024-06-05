import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
// import Modal from 'react-native-modal';
import Share from 'react-native-share';
import {Colors, Images} from '../../Theme';
import {globalStyling, wp, hp, currencyFormat} from '../../Constant';
import {Platform} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import CustomText from '../CustomText/CustomText';
import {captureRef} from 'react-native-view-shot';
import Entypo from 'react-native-vector-icons/Entypo';

var RNFetchBlob = require('rn-fetch-blob').default;
const PictureDir =
  Platform.OS === 'android'
    ? RNFetchBlob.fs.dirs.DownloadDir
    : RNFetchBlob.fs.dirs.DocumentDir;
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../Redux/Action/Action';
import {logs} from '../../Config/Config';
import {maskedAccount} from '../../Helpers/Helper';
import moment from 'moment';
import {renderNode} from 'react-native-elements/dist/helpers';

const GlobalTransferAlert = () => {
  const languageRedux = useSelector(
    (state) => state.reducers?.Localiztion?.language?.languageCode,
  );
  const viewRef = useRef();
  const [previewSource, setPreviewResource] = useState(null);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [value, setValue] = useState({
    format: 'jpg',
    quality: 0.9,
  });
  const [currentDate, setCurrentDate] = useState(
    moment(new Date()).format('DD MMM, YYYY'),
  );
  const [currentTime, setCurrentTime] = useState(
    moment(new Date()).format('hh:mm:ss a'),
  );
  const globalAlertTransfer = useSelector(
    (state) => state.reducers.globalAlertTransfer,
  );
  const dispatch = useDispatch();
  const [language, setlanguage] = useState(false);

  React.useEffect(() => {
    setlanguage(true);
  }, [languageRedux]);

  const AmountTandEndBalance = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: Colors.childContainer,
          width: wp(80),
          alignSelf: 'center',
          borderRadius: wp(1),
        }}>
        <View
          style={{
            width: wp(80),

            alignSelf: 'center',
            // borderRadius: wp(1),
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: wp(15),
            paddingHorizontal: wp(2),
          }}>
          <CustomText
            style={{
              alignSelf: 'center',
              fontSize: hp(1.5),
            }}>
            {`Amount\nTransferred`}
          </CustomText>
          <CustomText
            boldFont={true}
            style={{
              alignSelf: 'center',
              fontSize: hp(3),
            }}>
            Rs.
            {globalAlertTransfer?.props?.amount
              ? currencyFormat(Number(globalAlertTransfer?.props?.amount))
              : '00.00'}
          </CustomText>
        </View>
        {EndBalance()}
      </View>
    );
  };
  const EndBalance = () => {
    return (
      <>
        {globalAlertTransfer?.props?.endBalance ? (
          <View
            style={{
              width: wp(80),
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: wp(15),
              paddingHorizontal: wp(2),
            }}>
            <CustomText
              style={{
                alignSelf: 'center',
                fontSize: hp(1.5),
              }}>
              {`End\nBalanced`}
            </CustomText>
            <CustomText
              boldFont={true}
              style={{
                alignSelf: 'center',
                fontSize: hp(3),
              }}>
              Rs.
              {globalAlertTransfer?.props?.endBalance
                ? currencyFormat(Number(globalAlertTransfer?.props?.endBalance))
                : 'Rs.00.00'}
            </CustomText>
          </View>
        ) : null}
      </>
    );
  };
  const fromAcc = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
          }}>
          <CustomText style={styles.lightText}>From</CustomText>
          <View style={{width: wp(60)}}>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.fromName
                ? globalAlertTransfer?.props?.fromName
                : 'xxxxxxxxxx'}
            </CustomText>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.fromAccount
                ? maskedAccount(globalAlertTransfer?.props?.fromAccount)
                : 'xxxxxxxxx'}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
      </>
    );
  };
  const toAcc = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            // backgroundColor: 'red',
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
          }}>
          <CustomText style={styles.lightText}>To</CustomText>
          <View style={{width: wp(60)}}>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.toName
                ? globalAlertTransfer?.props?.toName
                : 'xxxxxxxx'}
            </CustomText>
            <CustomText style={styles.generalRightDetails}>
              {globalAlertTransfer?.props?.toAccount
                ? maskedAccount(globalAlertTransfer?.props?.toAccount)
                : '----------'}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
      </>
    );
  };
  const benefAliasView = () => {
    return (
      <>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            // backgroundColor: 'black',
            alignSelf: 'center',
            marginTop: wp(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            // margin: wp(2),
          }}>
          <CustomText style={styles.lightText}>{`Nickname`}</CustomText>
          <CustomText
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
              width: wp(40),
            }}>
            {globalAlertTransfer?.props?.benefAlias
              ? globalAlertTransfer?.props?.benefAlias
              : ''}
          </CustomText>
        </View>
      </>
    );
  };
  const purposeOfPaymentView = () => {
    return (
      <>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            // backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(2),
          }}>
          <CustomText
            style={styles.lightText}>{`Purpose Of\nPayment`}</CustomText>
          <CustomText
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
              width: wp(40),
            }}>
            {globalAlertTransfer?.props?.purposeOfPayment
              ? globalAlertTransfer?.props?.purposeOfPayment
              : ''}
          </CustomText>
        </View>
      </>
    );
  };
  const comment = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Comment`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.comments
            ? globalAlertTransfer?.props?.comments
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const memberID = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Member ID`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.comments
            ? globalAlertTransfer?.props?.comments
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const merchantName = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`merchantName`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.merchantName
            ? globalAlertTransfer?.props?.merchantName
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const merchantCode = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`merchantCode`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.merchantCode
            ? globalAlertTransfer?.props?.merchantCode
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const city = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`city`}</CustomText>
        <CustomText
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.city
            ? globalAlertTransfer?.props?.city
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };

  const transacDes = () => {
    return (
      <>
        <View
          style={{
            height: 0.5,
            width: wp(75),
            backgroundColor: 'black',
            alignSelf: 'center',
            margin: wp(2),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            // margin: wp(2),
          }}>
          <CustomText
            style={styles.lightText}>{`Transaction\nDescription`}</CustomText>
          <CustomText
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
              width: wp(40),
            }}>
            {globalAlertTransfer?.props?.transactiondesc
              ? globalAlertTransfer?.props?.transactiondesc
              : ''}
          </CustomText>
        </View>
      </>
    );
  };

  const trasacDate = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            width: wp(80),
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            margin: wp(1),
          }}>
          <CustomText style={styles.lightText}>
            {`Transaction\nDate`}
          </CustomText>
          <CustomText
            style={{
              textAlign: 'right',
              fontSize: wp(3.5),
              alignSelf: 'center',
            }}>
            {globalAlertTransfer?.props?.currentDate
              ? `${globalAlertTransfer?.props?.currentDate}`
              : `${currentDate}`}
            {globalAlertTransfer?.props?.showTime === false
              ? null
              : globalAlertTransfer?.props?.currentTime
              ? `\n${globalAlertTransfer?.props?.currentTime}`
              : `\n${currentTime}`}
          </CustomText>
        </View>
      </>
    );
  };
  const stanID = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Stan ID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}>
          {globalAlertTransfer?.props?.stanId
            ? globalAlertTransfer?.props?.stanId
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };
  const rrn = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`RRN`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.rrn
            ? globalAlertTransfer?.props?.rrn
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };

  const tran_Id = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction ID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.tran_Id
            ? globalAlertTransfer?.props?.tran_Id
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };

  const transDet = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction Detail`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
            width: wp(40),
          }}
          numberOfLines={2}>
          {globalAlertTransfer?.props?.transactionDetail
            ? globalAlertTransfer?.props?.transactionDetail
            : ''}
        </CustomText>
      </View>
    );
  };
  const errorView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction Status`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.error
            ? globalAlertTransfer?.props?.error
            : ''}
        </CustomText>
      </View>
    );
  };

  const companyName = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Biller Name`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.companyName
            ? globalAlertTransfer?.props?.companyName
            : 'XXXXX'}
        </CustomText>
      </View>
    );
  };

  const transId = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: wp(80),
          justifyContent: 'space-between',
          paddingHorizontal: wp(2),
          margin: wp(2),
        }}>
        <CustomText style={styles.lightText}>{`Transaction\nID`}</CustomText>
        <CustomText
          style={{
            textAlign: 'right',
            fontSize: wp(3.5),
            alignSelf: 'center',
          }}>
          {globalAlertTransfer?.props?.transId
            ? globalAlertTransfer?.props?.transId
            : 'XXXXXX'}
        </CustomText>
      </View>
    );
  };

  const sharebtn = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.secondaryColor,
          height: wp(10),
          width: wp(30),
          justifyContent: 'center',
          borderRadius: wp(100),
          flexDirection: 'row',
          alignSelf: 'center',
        }}
        onPress={() => {
          // takeScreenShot(true);
          dispatch(
            changeGlobalTransferAlertState(
              false,
              globalAlertTransfer.navigation,
              globalAlertTransfer.props,
            ),
          );
          globalAlertTransfer.navigation.navigate('ShareTransferReciept', {
            routeName: 'screenshot',
          });
        }}>
        <CustomText
          style={[
            {alignSelf: 'center', color: Colors.whiteColor},
            globalStyling.textFontBold,
          ]}>
          {'Share '}
        </CustomText>
        <Image
          source={
            Platform.OS == 'ios'
              ? Images.iosShareWhite
              : Images.androidIconWhiteShare
          }
          style={{width: wp(4), height: wp(4), alignSelf: 'center'}}
        />
      </TouchableOpacity>
    );
  };
  const downloadbtn = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          height: wp(10),
          width: wp(30),
          justifyContent: 'center',
          borderRadius: wp(100),
          flexDirection: 'row',
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: Colors.transferReciptDownlaodBtn,
        }}
        onPress={() => {
          dispatch(
            changeGlobalTransferAlertState(
              false,
              globalAlertTransfer.navigation,
              globalAlertTransfer.props,
            ),
          );
          globalAlertTransfer.navigation.navigate('ShareTransferReciept', {
            routeName: 'download',
          });
          // takeScreenShot(true);
        }}>
        <CustomText
          style={[
            {alignSelf: 'center', color: Colors.transferReciptDownlaodBtn},
            globalStyling.textFontBold,
          ]}>
          {'Download  '}
        </CustomText>
        <AntDesign
          size={wp(4.5)}
          color={Colors.transferReciptDownlaodBtn}
          name={'download'}
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      // visible={true}
      visible={globalAlertTransfer?.state}
      transparent={true}
      animationType={'slide'}
      ref={viewRef}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000080',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{alignSelf: 'center'}}>
          <View style={{paddingHorizontal: wp(5)}}>
            {globalAlertTransfer?.props?.status === 'Fail' ? (
              <Image
                source={Images.failAlert}
                style={{
                  width: wp(15),
                  height: wp(15),
                  alignSelf: 'center',
                  top: wp(8),
                  zIndex: 2,
                  // backgroundColor: 'white',
                }}
              />
            ) : (
              <Image
                source={Images.successAlert}
                style={{
                  width: wp(15),
                  height: wp(15),
                  alignSelf: 'center',
                  top: wp(8),
                  zIndex: 2,
                }}
              />
            )}
            <View
              style={{
                width: wp(90),
                alignSelf: 'center',
                backgroundColor: Colors.subContainer,
                borderRadius: wp(1),
              }}>
              <AntDesign
                onPress={() => {
                  globalAlertTransfer?.props.onPressClose();
                }}
                name={'closecircle'}
                size={wp(6)}
                color={Colors.themeGrey}
                style={{alignSelf: 'flex-end', padding: wp(2)}}
              />
              <View
                ref={viewRef}
                style={{backgroundColor: Colors.subContainer}}>
                <View style={{height: wp(4)}} />
                <CustomText
                  style={{alignSelf: 'center', fontSize: wp(6)}}
                  boldFont={true}>
                  {globalAlertTransfer?.props?.paymentType
                    ? globalAlertTransfer?.props?.paymentType
                    : '------------'}
                </CustomText>
                <View style={{height: wp(4)}} />
                {AmountTandEndBalance()}
                <View style={{height: wp(4)}} />
                {globalAlertTransfer?.props?.fromAccount ? fromAcc() : null}
                {globalAlertTransfer?.props?.toAccount ? toAcc() : null}

                {/* transection description */}

                {globalAlertTransfer?.props?.transactiondesc
                  ? transacDes()
                  : null}
                {/* transection description */}
                {/* {globalAlertTransfer?.props?.benefAlias
                  ? benefAliasView()
                  : null} */}

                {globalAlertTransfer?.props?.purposeOfPayment
                  ? purposeOfPaymentView()
                  : null}

                {/* drcr */}
                {globalAlertTransfer?.props?.drcr ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      width: wp(80),
                      justifyContent: 'space-between',
                      paddingHorizontal: wp(2),
                      margin: wp(2),
                    }}>
                    <CustomText style={styles.lightText}>{`DR/CR`}</CustomText>
                    <CustomText
                      style={{
                        textAlign: 'right',
                        fontSize: wp(3.5),
                        alignSelf: 'center',
                      }}
                      boldFont={true}>
                      {globalAlertTransfer?.props?.drcr
                        ? globalAlertTransfer?.props?.drcr
                        : ''}
                    </CustomText>
                  </View>
                ) : null}
                {/* drcr */}

                {/* cheque number */}
                {globalAlertTransfer?.props?.drcr ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        width: wp(80),
                        justifyContent: 'space-between',
                        paddingHorizontal: wp(2),
                        margin: wp(2),
                      }}>
                      <CustomText
                        style={styles.lightText}>{`Cheque Number`}</CustomText>
                      <CustomText
                        style={{
                          textAlign: 'right',
                          fontSize: wp(3.5),
                          alignSelf: 'center',
                        }}>
                        {/* {globalAlertTransfer?.props?.drcr
                      ? globalAlertTransfer?.props?.drcr
                      : ''} */}
                        -
                      </CustomText>
                    </View>
                    <View
                      style={{
                        height: 0.5,
                        width: wp(75),
                        backgroundColor: 'black',
                        alignSelf: 'center',
                        margin: wp(2),
                      }}
                    />
                  </>
                ) : null}
                {/* cheque number */}

                {globalAlertTransfer?.props?.companyName ? companyName() : null}
                {trasacDate()}
                {/* stan Id */}

                {globalAlertTransfer?.props?.stanId ? stanID() : null}
                {globalAlertTransfer?.props?.rrn ? rrn() : null}
                {globalAlertTransfer?.props?.NbpSport
                  ? memberID()
                  : globalAlertTransfer?.props?.comments
                  ? comment()
                  : null}
                {globalAlertTransfer?.props?.tran_Id ? tran_Id() : null}
                {/* {globalAlertTransfer?.props?.comments ? comment() : null} */}
                {globalAlertTransfer?.props?.merchantName
                  ? merchantName()
                  : null}
                {globalAlertTransfer?.props?.merchantCode
                  ? merchantCode()
                  : null}
                {globalAlertTransfer?.props?.city ? city() : null}
                {/* stan Id */}
                {/* transection detail */}
                {/* {globalAlertTransfer?.props?.companyName ? companyName() : null} */}
                {globalAlertTransfer?.props?.transactionDetail
                  ? transDet()
                  : null}
                {/* transection detail */}
                {/* error */}
                {globalAlertTransfer?.props?.error ? errorView() : null}
                {/* erro */}
                {/* //trans id  */}
                {globalAlertTransfer?.props?.transId ? transId() : null}
                {/* transidd */}

                <View style={{height: wp(3)}} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                {sharebtn()}
                <View style={{width: wp(2)}} />
                {downloadbtn()}
              </View>
              <View style={{height: wp(3)}} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  lightText: {
    // color: Colors.blackColor,
    alignSelf: 'center',
  },
  generalTextSize: {
    fontSize: wp(4.5),
    alignSelf: 'center',
    textAlign: 'center',
    // width: wp(70),
  },
  generalDetails: {
    fontSize: wp(3.5),
    alignSelf: 'flex-end',
  },
  generalRightDetails: {
    fontSize: wp(3.5),
    alignSelf: 'flex-end',
    // backgroundColor: 'blue',

    // textAlign: 'right',
  },
  seperator: {},
});

//make this component available to the app
export default GlobalTransferAlert;
