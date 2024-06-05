import React from 'react';
import {View, Dimensions} from 'react-native';
import styles from './AliasManagemtStyle';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../Components/TabNavigate/TabNavigate';
import {useSelector, useDispatch} from 'react-redux';
import {getcitycode} from '../../../Redux/Action/Action';
import {wp} from '../../../Constant';
import {logs} from '../../../Config/Config';
import {Colors} from '../../../Theme';
import analytics from '@react-native-firebase/analytics';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const AliasManagment = (props) => {
  const token = useSelector((state) => state.reducers.token);
  const dispatch = useDispatch();
  const raastPopup = useSelector(
    (state) => state.reducers.overViewData.data.accounts.raastPopup,
  );
  logs.log('userObject.raastPopUp', raastPopup);
  React.useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RAASTIDManagementAliasManagementScreen');
    }
    analyticsLog();
  }, []);

  return (
    <View
      style={[styles.container, {backgroundColor: Colors.backgroundColor}]}
      accessibilityLabel="RAAST ID Management Screen">
      <SubHeader
        navigation={props.navigation}
        title={'Raast ID Management'}
        description={'Manage your Raast ID'}
        // navigateHome={true}
      />
      <View style={{height: wp(6)}} />
      {raastPopup ? (
        <TabNavigator
          // cardissuance={true}
          accessibilityLabel="Press to Register your RAAST ID"
          text={'Create Raast ID'}
          navigation={props.navigation}
          navigateTo={'AliasManagment'}
          // onPress={()=>{
          //   dispatch(getcitycode(token,props.navigation))
          // }}
          border={true}
          alias_register={true}
          boldFont={true}
          // border={true}
          onPress={() => {
            props.navigation.navigate('General_AliasManagment', {
              screen: 'Register',
            });
          }}
        />
      ) : (
        <>
          <TabNavigator
            accessibilityLabel="Press to Link your RAAST ID"
            text={'Link'}
            navigation={props.navigation}
            navigateTo={'AliasManagment'}
            alias_link={true}
            boldFont={true}
            border={true}
            onPress={() => {
              props.navigation.navigate('General_AliasManagment', {
                screen: 'Link',
              });
            }}
          />
          <TabNavigator
            accessibilityLabel="Press to Unlink your RAAST ID"
            text={'Delink'}
            navigation={props.navigation}
            navigateTo={'AliasManagment'}
            alias_unlink={true}
            boldFont={true}
            border={true}
            onPress={() => {
              props.navigation.navigate('General_AliasManagment', {
                screen: 'Unlink',
              });
            }}
          />
          {/* <TabNavigator
            text={'Remove Raast ID'}
            accessibilityLabel="Press to Remove your RAAST ID"
            navigation={props.navigation}
            navigateTo={'AliasManagment'}
            // card_ping={true}
            alias_remove={true}
            boldFont={true}
            border={true}
            onPress={() => {
              props.navigation.navigate('General_AliasManagment', {
                screen: 'Remove',
              });
            }}
          /> */}
        </>
      )}

      {/* <TabNavigator
        
        text={'Alias Change Status'}
        navigation={props.navigation}
        navigateTo={'AliasManagment'}
        alias_status={true}
        onPress={()=>{props.navigation.navigate("Change_Status",{screen:'Change_Status'})}}

      /> */}
    </View>
  );
};

export default AliasManagment;
