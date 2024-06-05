import {WebView} from 'react-native-webview';
import React, {useEffect, useState} from 'react';
import {View, Dimensions, SafeAreaView, ScrollView} from 'react-native';
import styles from './RAASTTermsStyle';
import {Colors} from '../../../Theme';
import CustomBtn from '../../../Components/Custom_btn/Custom_btn';
import {CheckBox} from 'react-native-elements';
import CustomLoader from '../../../Components/Custom_Loader/Custom_Loader';
import GlobalHeader from '../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../Components/GlobalHeader/SubHeader/SubHeader';
import {wp} from '../../../Constant';
import {useDispatch, useSelector} from 'react-redux';
import {
  setLoader,
  getWebViewHTML,
  overview,
} from '../../../Redux/Action/Action';
import HTML, {IGNORED_TAGS} from 'react-native-render-html';
import {ActivityIndicator} from 'react-native';
import {Config} from '../../../Config/Config';
import {isRtlState} from '../../../Config/Language/LanguagesArray';
import analytics from '@react-native-firebase/analytics';

const heighto = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
const Term_Cond = (props) => {
  const dispatch = useDispatch();
  const webViewHTML = useSelector((state) => state.reducers.webViewHTML);
  const [isSelected, setSelection] = useState(false);
  const [loader, setloader_state] = useState(true);
  const [agree, setAgree] = useState('AGREE');
  const [disagree, setDisagree] = useState('DISAGREE');
  const [web_url, set_web_url] = useState(
    `${Config.base_url.UAT_URL}webpages/getTermsAndConditions`,
  );
  useEffect(() => {
    async function analyticsLog() {
      await analytics().logEvent('RAASTTermandCondition');
    }
    analyticsLog();

    if (!isRtlState()) {
      set_web_url(
        `${Config.base_url.UAT_URL}webpages/getTermsAndConditionsInUrdu`,
      );
    }
  }, []);

  function Webview_urdu() {
    set_web_url(
      `${Config.base_url.UAT_URL}webpages/getTermsAndConditionsInUrdu`,
    );
  }
  function Webview_eng() {
    set_web_url(`${Config.base_url.UAT_URL}webpages/getTermsAndConditions`);
  }
  function onBackPress() {
    props.navigation.goBack();
  }
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      let str = web_url.split(/[\s/]+/);
      dispatch(getWebViewHTML(str[str.length - 1], props.navigation));
    });
  }, []);
  useEffect(() => {
    let str = web_url.split(/[\s/]+/);
    dispatch(getWebViewHTML(str[str.length - 1], props.navigation));
  }, [web_url]);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      dispatch(overview(props.navigation));
    });
  }, []);
  return (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="RAAST Terms Screen">
      {/* <GlobalHeader navigation={props.navigation} hideBoth={true} /> */}
      <SubHeader
        navigation={props.navigation}
        title={'Terms & Conditions'}
        description={'Terms of Services'}
        creditCardBills={true}
      />

      <View
        style={{
          width: '80%',
          height: heighto / 13,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <CustomBtn
          accessibilityLabel="Press for English"
          btn_txt={'English'}
          btn_width={width / 3}
          onPress={() => {
            Webview_eng();
            setAgree('AGREEs');
            setDisagree('DISAGREE');
          }}
          backgroundColor={Colors.primary_green}
        />
        <CustomBtn
          accessibilityLabel="Press for Urdu"
          btn_txt={'اردو'}
          btn_width={width / 3}
          onPress={() => {
            Webview_urdu();
            setAgree('اِتفاق');
            setDisagree('عدم اِتفاق');
          }}
          backgroundColor={Colors.primary_green}
        />
      </View>
      <WebView
        source={{uri: web_url}}
        onLoadStart={() => {
          // setloader_state(true);
          dispatch(setLoader(true));
        }}
        onLoadEnd={() => {
          // setloader_state(false);
          dispatch(setLoader(false));
        }}
        onError={() => {
          // setloader_state(false);
          dispatch(setLoader(false));
        }}
        onHttpError={() => {
          // setloader_state(false);
          dispatch(setLoader(false));
        }}
        // textZoom={wp(55)}
        style={{
          alignSelf: 'center',
          width: '95%',
        }}
        // injectedJavaScript={INJECTEDJAVASCRIPT}
      />
      {/* <View style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HTML
            source={{
              uri: web_url,
            }}
            baseFontStyle={{margin: 0, padding: 0}}
            containerStyle={{
              width: '95%',
              alignSelf: 'center',
              marginVertical: wp(2),
            }}
            ignoredStyles={['font-family', ...IGNORED_TAGS]}
          />
        </ScrollView>
      </View> */}

      <View
        style={{
          width: '95%',
          height: wp(18),
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: width,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: wp(3),
          }}>
          <CustomBtn
            accessibilityLabel="Tap to Agree"
            btn_txt={agree}
            btn_width={width / 3}
            onPress={() => {
              // isSelected
              //   ?
              props.navigation.navigate('oneStepReg', {
                screen: 'Register',
              });
              // : props.navigation.navigate('Login');
            }}
            backgroundColor={Colors.primary_green}
          />
          <View style={{width: 30}}></View>
          <CustomBtn
            accessibilityLabel="Tap to Disagree"
            btn_txt={disagree}
            btn_width={width / 3}
            onPress={() => {
              props.navigation.replace('Dashboard');
            }}
            backgroundColor={Colors.primary_green}
          />
        </View>
      </View>

      {/* <CustomLoader visible={loader} /> */}
    </SafeAreaView>
  );
};

export default Term_Cond;
