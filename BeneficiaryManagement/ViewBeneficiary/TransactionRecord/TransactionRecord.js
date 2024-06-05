import React, {useState} from 'react';
import {View, Text, Dimensions, FlatList} from 'react-native';
import GlobalHeader from '../../../../Components/GlobalHeader/GlobalHeader';
import SubHeader from '../../../../Components/GlobalHeader/SubHeader/SubHeader';
import TabNavigator from '../../../../Components/TabNavigate/TabNavigate';
import Loader from '../../../../Components/Custom_Loader/Custom_Loader';
import {userData} from './Data';
import {bindActionCreators} from 'redux';
import styles from './TransactionRecordStyling';
import * as reduxActions from '../../../../Redux/Action/Action';
import {connect} from 'react-redux';
import {hp} from '../../../../Constant';
const screenWidth = Dimensions.get('window').width;
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}
class TransactionRecord extends React.PureComponent {
  state = {
    loader: false,
    data: [],
  };

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.props.reduxActions.setCurrentFlow('View Beneficiary');
    });
    //  this.props.reduxActions.all_benef(this.props.reduxState.token,this.props.navigation,1,this.props.route.params)
    let Data = this.props.reduxState.beneficiaries;

    const data = Data.sort(function (a, b) {
      var nameA = a.benefAlias.toLowerCase(),
        nameB = b.benefAlias.toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
    this.setState({data: data});
    // this.setState({data: this.props.reduxState.beneficiaries});
  }

  // flatlist render item function
  render() {
    // const loader = useSelector((state) => state.reducers.loader);

    const renderTransactionRecordFlatlist = ({item, index, separators}) => (
      <TabNavigator
        border={true}
        tabHeading={item.benefAlias}
        text={item.benefAccount}
        navigation={this.props.navigation}
        fontSize={wp(4.2)}
        // width={WP}
        textWidth={'100%'}
        numberOfLines={1}
        //   onPress={() => {
        //     props.navigation.push('TransactionRecord', {
        //       data: 'details',
        //     });
        //   }}

        onPress={() => {
          let itm = {...item, type: this.props.route.params?.data};
          this.props.navigation.navigate('BeneficiaryDetail', {data: itm});
        }}
      />
    );

    // flatlist render item function ends here
    return (
      <View style={styles.container}>
        {/* <GlobalHeader navigation={this.props.navigation} /> */}
        <SubHeader
          navigation={this.props.navigation}
          title={'View Beneficiary'}
          description={'View List of Beneficiaries'}
        />
        {this.state.data.length == 0 ? (
          <Text
            style={{
              textAlign: 'center',
              fontSize: wp(5),
              marginTop: wp(10),
            }}>
            No Beneficiaries Found
          </Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            renderItem={renderTransactionRecordFlatlist}
            data={this.state.data == [] ? userData : this.state.data}
            removeClippedSubviews={true}
            keyExtractor={(item) => item.benefID}
            disableVirtualization={false}
          />
        )}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionRecord);
