import {Platform} from 'react-native';
export const fontFamily = {
  'ArticulatCF-Bold':
    Platform.OS === 'ios' ? 'ArticulatCF-Bold' : 'ArticulatCF-Bold',
  'ArticulatCF-DemiBold': 'ArticulatCF-DemiBold',
  'ArticulatCF-Normal':
    Platform.OS === 'ios' ? 'ArticulatCF-Normal' : 'ArticulatCF-Normal',
  NotoNastaliq: Platform.OS === 'ios' ? 'NotoNastaliq' : 'NotoNastaliq',
};
