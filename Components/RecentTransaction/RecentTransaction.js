import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  setLoader,
  updateSessionToken,
  catchError,
  serviceResponseCheck,
  changeGlobalTransferAlertState,
  closeGlobalTransferAlert,
} from '../../Redux/Action/Action';
import {Service, getTokenCall} from '../../Config/Service';
import {logs} from '../../Config/Config';
import {wp, hp} from '../../Constant';
import {Colors, Images} from '../../Theme';
import CustomText from '../CustomText/CustomText';
import {useTheme} from '../../Theme/ThemeManager';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {purposeOfPaymentById} from '../../Containers/purposeOfPayments';
import moment from 'moment';

const RecentTransaction = (props) => {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);

  const transDate = (date) => {
    if (date) {
      return moment(date, 'DD-MM-YYYY hh:mm:ss A').format('DD MMM, YYYY');
    } else {
      return '--------';
    }
  };
  const transTime = (time) => {
    if (time) {
      return moment(time, 'DD-MM-YYYY hh:mm:ss A').format('hh:mm:ss A');
    } else {
      return '--------';
    }
  };

  const animation = new Animated.Value(50); // Initial height of the tab

  const getlastTransaction = async () => {
    logs.log('getlastTransaction logging');
    try {
      dispatch(setLoader(true));
      const response = await getTokenCall(
        Service.getLastTransaction,
        `fromAccount=${props?.FromAccount}&transactionType=${props?.AccountType}&toAccount=${props?.ToAccount}`,
      );
      logs.log('response---->', response);
      if (response?.data?.responseCode === '00') {
        setShowIcon(true);
        setShowTransaction(true);
        setTransactions(response.data.data);
        dispatch(setLoader(false));
        dispatch(updateSessionToken(response));

        // Spring animation for the expanding effect
        Animated.spring(animation, {
          toValue: 100, // Final height of the tab after data is loaded
          useNativeDriver: false,
          speed: 1,
          bounciness: 10, // Adjust this value for more or less bounce
        }).start();

        logs.log('Data loaded---->', response.data.data);
      } else {
        dispatch(serviceResponseCheck(response, props.navigation));
        dispatch(updateSessionToken(response));
      }
    } catch (error) {
      logs.log('errors', error);
      dispatch(catchError(error));
    } finally {
      setLoaded(true);
    }
  };
  const renderItem = ({item, id}) => {
    logs.log('Item-----', item);
    return (
      <TouchableWithoutFeedback
        style={{
          marginBottom: wp(5),
        }}
        onPress={() => {
          logs.log('Item in E -List', item);
          dispatch(
            changeGlobalTransferAlertState(true, props.navigation, {
              paymentType: item.activity,
              amount: item.amount,
              fromName: item.fromName,
              fromAccount: item.fromAccount,
              toName: item.toName,
              toAccount: item.toAccount,
              rrn: item.rrn ? item.rrn : false,
              stanId: item.stan ? item.stan : false,
              purposeOfPayment:
                item?.purposeOfPayment &&
                purposeOfPaymentById[item?.purposeOfPayment]
                  ? purposeOfPaymentById[item?.purposeOfPayment]
                  : false,
              benefAlias:
                item?.benefAlias && item?.benefAlias !== ''
                  ? item?.benefAlias
                  : false,
              currentDate: `${transDate(item?.stampDate)}`,
              currentTime: `${transTime(item?.stampDate)}`,
              companyName: item?.companyName,
              onPressClose: () => {
                dispatch(
                  closeGlobalTransferAlert(
                    // props.navigation,
                    '',
                    true,
                  ),
                );
              },
            }),
          );
        }}>
        <View
          style={{
            backgroundColor: Colors.childContainer,
            width: wp(90),
            alignSelf: 'center',
            margin: wp(2),
            borderRadius: wp(1),
            // borderWidth: 0.4,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <View
            style={{
              padding: wp(1),
              margin: wp(1),
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
            keyExtractor={id}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  padding: wp(2),
                  margin: wp(2),
                  borderRadius: 100,
                  backgroundColor: Colors.subContainer,
                  justifyContent: 'center',
                }}>
                <Feather
                  style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                  name={'arrow-up-right'}
                  size={wp(6)}
                  color={Colors.primary_green}
                />
              </View>
              <View style={{flexDirection: 'column'}}>
                <CustomText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: wp(3.5),
                    color: Colors.grey,
                    width: wp(20),
                  }}>
                  Amount
                </CustomText>
                <CustomText
                  boldFont={true}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: wp(4),
                    width: wp(20),
                  }}>
                  {`Rs ${item.amount}`}
                </CustomText>
                <CustomText>{`Ref ID: ${item.rrn}`}</CustomText>
              </View>
            </View>
            <View style={{alignSelf: 'center'}}>
              <View style={{marginBottom: hp(5), marginRight: wp(3)}}>
                <CustomText
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{
                    fontSize: wp(3),
                    color: Colors.grey,
                  }}>
                  {item.stampDate}
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Animated.View style={{minHeight: animation}}>
      <TouchableOpacity
        onPress={() => {
          // if (!loaded) {
          //   showTransaction === false ? getlastTransaction() : null;
          // }
          showTransaction === false
            ? getlastTransaction()
            : setShowTransaction(false);
        }}>
        <View
          style={{
            backgroundColor: Colors.subContainer,
            // height: '90%',
            width: '100%',
            alignSelf: 'center',
            padding: wp(4),
            // margin: wp(3),
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Fontisto
            name={'arrow-swap'}
            size={wp(5)}
            color={Colors.tabNavigateLeftIcon}
          />
          <CustomText
            boldFont={true}
            style={{
              width: '92%',
              fontSize: wp(4.2),
              marginLeft: wp(4),
            }}>
            Recent Transaction
          </CustomText>
          <Icon
            name={showTransaction === true ? 'chevron-up' : 'chevron-down'}
            style={{fontSize: wp(6)}}
            color={Colors.tabNavigateLeftIcon}
          />
        </View>
      </TouchableOpacity>
      {showTransaction === true ? (
        <View style={{backgroundColor: Colors.subContainer}}>
          <FlatList
            style={{marginBottom: wp(10)}}
            data={transactions}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <CustomText
                style={{textAlign: 'center', marginTop: 20, fontSize: wp(4)}}>
                {loaded ? 'No Transactions Found' : ''}
              </CustomText>
            )}
          />
        </View>
      ) : null}
    </Animated.View>
  );
};

export default RecentTransaction;
