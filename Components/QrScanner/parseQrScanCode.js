import * as actionTypes from '../../Redux/Action/types';
import {Platform} from 'react-native';
const qrType = ['DYNAMIC', 'STATIC'];

const breakString = (str) => {
  let idx = 0,
    map = {};

  while (idx < str.length) {
    let tag = String(str).substring(idx, idx + 2);
    let length = Number(str.substring(idx + 2, idx + 4));
    let value = str.substring(idx + 4, idx + 4 + length);
    idx += 4 + length;
    object = {tag: value};
    map[tag] = value;
  }
  return map;
};

const currency = {
  971: 'Afghani',
  8: 'LBANIA',
  12: 'ALGERIA',
  840: 'AMERICAN SAMOA',
  978: 'ANDORRA',
  973: 'ANGOLA',
  951: 'ANGUILLA',
  951: 'ANTIGUA AND BARBUDA',
  32: 'ARGENTINA',
  51: 'RMENIA',
  533: 'ARUBA',
  36: 'AUSTRALIA',
  978: 'AUSTRIA',
  944: 'AZERBAIJAN',
  44: 'BAHAMAS (THE)',
  48: 'BAHRAIN',
  50: 'BANGLADESH',
  52: 'BARBADOS',
  974: 'BELARUS',
  978: 'BELGIUM',
  84: 'BELIZE',
  952: 'BENIN',
  60: 'BERMUDA',
  64: 'BHUTAN',
  356: 'BHUTAN',
  68: 'BOLIVIA (PLURINATIONAL STATE OF)',
  984: 'BOLIVIA (PLURINATIONAL STATE OF)',
  840: 'BONAIRE, SINT EUSTATIUS AND SABA',
  977: 'BOSNIA AND HERZEGOVINA',
  72: 'BOTSWANA',
  578: 'BOUVET ISLAND',
  986: 'BRAZIL',
  840: 'BRITISH INDIAN OCEAN TERRITORY (THE)',
  96: 'BRUNEI DARUSSALAM',
  975: 'BULGARIA',
  952: 'BURKINA FASO',
  108: 'BURUNDI',
  132: 'CABO VERDE',
  116: 'CAMBODIA',
  950: 'CAMEROON',
  124: 'CANADA',
  136: 'CAYMAN ISLANDS (THE)',
  950: 'CENTRAL AFRICAN REPUBLIC (THE)',
  950: 'CHAD',
  990: 'CHILE',
  152: 'CHILE',
  156: 'CHINA',
  36: 'CHRISTMAS ISLAND',
  36: 'COCOS (KEELING) ISLANDS (THE)',
  170: 'COLOMBIA',
  970: 'COLOMBIA',
  174: 'COMOROS (THE)',
  976: 'CONGO (THE DEMOCRATIC REPUBLIC OF THE)',
  950: 'CONGO (THE)',
  554: 'COOK ISLANDS (THE)',
  188: 'COSTA RICA',
  191: 'CROATIA',
  931: 'CUBA',
  192: 'CUBA',
  532: 'CURAÇAO',
  978: 'CYPRUS',
  203: 'CZECH REPUBLIC (THE)',
  952: "CÔTE D'IVOIRE",
  208: 'DENMARK',
  262: 'DJIBOUTI',
  951: 'DOMINICA',
  214: 'DOMINICAN REPUBLIC (THE)',
  840: 'ECUADOR',
  818: 'EGYPT',
  222: 'EL SALVADOR',
  840: 'EL SALVADOR',
  950: 'EQUATORIAL GUINEA',
  232: 'ERITREA',
  978: 'ESTONIA',
  230: 'ETHIOPIA',
  978: 'EUROPEAN UNION',
  238: 'FALKLAND ISLANDS (THE) [MALVINAS]',
  208: 'FAROE ISLANDS (THE)',
  242: 'FIJI',
  978: 'FINLAND',
  978: 'FRANCE',
  978: 'FRENCH GUIANA',
  953: 'FRENCH POLYNESIA',
  978: 'FRENCH SOUTHERN TERRITORIES (THE)',
  950: 'GABON',
  270: 'GAMBIA (THE)',
  981: 'GEORGIA',
  978: 'GERMANY',
  936: 'GHANA',
  292: 'GIBRALTAR',
  978: 'GREECE',
  208: 'GREENLAND',
  951: 'GRENADA',
  978: 'GUADELOUPE',
  840: 'GUAM',
  320: 'GUATEMALA',
  826: 'GUERNSEY',
  324: 'GUINEA',
  952: 'GUINEA-BISSAU',
  328: 'GUYANA',
  332: 'HAITI',
  840: 'HAITI',
  36: 'HEARD ISLAND AND McDONALD ISLANDS',
  978: 'HOLY SEE (THE)',
  340: 'HONDURAS',
  344: 'HONG KONG',
  348: 'HUNGARY',
  352: 'ICELAND',
  356: 'INDIA',
  360: 'INDONESIA',
  960: 'INTERNATIONAL MONETARY FUND (IMF) ',
  364: 'IRAN (ISLAMIC REPUBLIC OF)',
  368: 'IRAQ',
  978: 'IRELAND',
  826: 'ISLE OF MAN',
  376: 'ISRAEL',
  978: 'ITALY',
  388: 'JAMAICA',
  392: 'JAPAN',
  826: 'JERSEY',
  400: 'JORDAN',
  398: 'KAZAKHSTAN',
  404: 'KENYA',
  36: 'KIRIBATI',
  408: 'KOREA (THE DEMOCRATIC PEOPLE’S REPUBLIC OF)',
  410: 'KOREA (THE REPUBLIC OF)',
  414: 'KUWAIT',
  417: 'KYRGYZSTAN',
  418: 'LAO PEOPLE’S DEMOCRATIC REPUBLIC (THE)',
  978: 'LATVIA',
  422: 'LEBANON',
  426: 'LESOTHO',
  710: 'LESOTHO',
  430: 'LIBERIA',
  434: 'LIBYA',
  756: 'LIECHTENSTEIN',
  978: 'LITHUANIA',
  978: 'LUXEMBOURG',
  446: 'MACAO',
  807: 'MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)',
  969: 'MADAGASCAR',
  454: 'MALAWI',
  458: 'MALAYSIA',
  462: 'MALDIVES',
  952: 'MALI',
  978: 'MALTA',
  840: 'MARSHALL ISLANDS (THE)',
  978: 'MARTINIQUE',
  478: 'MAURITANIA',
  480: 'MAURITIUS',
  978: 'MAYOTTE',
  965: 'MEMBER COUNTRIES OF THE AFRICAN DEVELOPMENT BANK GROUP',
  484: 'MEXICO',
  979: 'MEXICO',
  840: 'MICRONESIA (FEDERATED STATES OF)',
  498: 'MOLDOVA (THE REPUBLIC OF)',
  978: 'MONACO',
  496: 'MONGOLIA',
  978: 'MONTENEGRO',
  951: 'MONTSERRAT',
  504: 'MOROCCO',
  943: 'MOZAMBIQUE',
  104: 'MYANMAR',
  516: 'NAMIBIA',
  710: 'NAMIBIA',
  36: 'NAURU',
  524: 'NEPAL',
  978: 'NETHERLANDS (THE)',
  953: 'NEW CALEDONIA',
  554: 'NEW ZEALAND',
  558: 'NICARAGUA',
  952: 'NIGER (THE)',
  566: 'NIGERIA',
  554: 'NIUE',
  36: 'NORFOLK ISLAND',
  840: 'NORTHERN MARIANA ISLANDS (THE)',
  578: 'NORWAY',
  512: 'OMAN',
  586: 'PAKISTAN',
  840: 'PALAU',
  590: 'PANAMA',
  840: 'PANAMA',
  598: 'PAPUA NEW GUINEA',
  600: 'PARAGUAY',
  604: 'PERU',
  608: 'PHILIPPINES (THE)',
  554: 'PITCAIRN',
  985: 'POLAND',
  978: 'PORTUGAL',
  840: 'PUERTO RICO',
  634: 'QATAR',
  946: 'ROMANIA',
  643: 'RUSSIAN FEDERATION (THE)',
  646: 'RWANDA',
  978: 'RÉUNION',
  978: 'SAINT BARTHÉLEMY',
  654: 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA',
  951: 'SAINT KITTS AND NEVIS',
  951: 'SAINT LUCIA',
  978: 'SAINT MARTIN (FRENCH PART)',
  978: 'SAINT PIERRE AND MIQUELON',
  951: 'SAINT VINCENT AND THE GRENADINES',
  882: 'SAMOA',
  978: 'SAN MARINO',
  678: 'SAO TOME AND PRINCIPE',
  682: 'SAUDI ARABIA',
  952: 'SENEGAL',
  941: 'SERBIA',
  690: 'SEYCHELLES',
  694: 'SIERRA LEONE',
  702: 'SINGAPORE',
  532: 'SINT MAARTEN (DUTCH PART)',
  994: 'SISTEMA UNITARIO DE COMPENSACION REGIONAL DE PAGOS',
  978: 'SLOVAKIA',
  978: 'SLOVENIA',
  90: 'SOLOMON ISLANDS',
  706: 'SOMALIA',
  710: 'SOUTH AFRICA',
  728: 'SOUTH SUDAN',
  978: 'SPAIN',
  144: 'SRI LANKA',
  938: 'SUDAN (THE)',
  968: 'SURINAME',
  578: 'SVALBARD AND JAN MAYEN',
  748: 'SWAZILAND',
  752: 'SWEDEN',
  947: 'SWITZERLAND',
  756: 'SWITZERLAND',
  948: 'SWITZERLAND',
  760: 'SYRIAN ARAB REPUBLIC',
  901: 'TAIWAN (PROVINCE OF CHINA)',
  972: 'TAJIKISTAN',
  834: 'TANZANIA, UNITED REPUBLIC OF',
  764: 'THAILAND',
  840: 'TIMOR-LESTE',
  952: 'TOGO',
  554: 'TOKELAU',
  776: 'TONGA',
  780: 'TRINIDAD AND TOBAGO',
  788: 'TUNISIA',
  949: 'TURKEY',
  934: 'TURKMENISTAN',
  840: 'TURKS AND CAICOS ISLANDS (THE)',
  36: 'TUVALU',
  800: 'UGANDA',
  980: 'UKRAINE',
  784: 'UNITED ARAB EMIRATES (THE)',
  826: 'UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND (THE)',
  840: 'UNITED STATES MINOR OUTLYING ISLANDS (THE)',
  840: 'UNITED STATES OF AMERICA (THE)',
  997: 'UNITED STATES OF AMERICA (THE)',
  940: 'URUGUAY',
  858: 'URUGUAY',
  860: 'UZBEKISTAN',
  548: 'VANUATU',
  937: 'VENEZUELA (BOLIVARIAN REPUBLIC OF)',
  704: 'VIET NAM',
  840: 'VIRGIN ISLANDS (BRITISH)',
  840: 'VIRGIN ISLANDS (U.S.)',
  953: 'WALLIS AND FUTUNA',
  504: 'WESTERN SAHARA',
  886: 'YEMEN',
  967: 'ZAMBIA',
  932: 'ZIMBABWE',
  978: 'ÅLAND ISLANDS',
};

export const parseQrScanCode = (read, navigation) => async (dispatch) => {
  dispatch({
    type: actionTypes.SET_QR_STRING,
    payload: read.data,
  });
  try {
    let response = breakString(read.data);
    let merchantAccountInformation,
      merchantCategoryCode,
      transactionCurrency,
      transactionAmount,
      convenienceIndicator,
      convenienceFixed,
      conveniencePercentage,
      additionalData,
      merchantInformationLanguageTemplate,
      type,
      countryCode,
      merchantName,
      merchantCity,
      postalCode,
      crc;
    if (!response['00']) {
      // {
      //   Platform.os === 'ios'
      //     ? dispatch({
      //         type: actionTypes.SET_ELSE_RESPONSE_ALERT,
      //         payload: {
      //           state: true,
      //           alertTitle: 'NO_PAYLOAD_INDICATOR_FOUND',
      //           alertText: 'NO_PAYLOAD_INDICATOR_FOUND',
      //         },
      //       })
      //     : global.showToast.show('NO_PAYLOAD_INDICATOR_FOUND', 1000);
      // }
      return false;
    } else if (response['00'] !== '01') {
      // dispatch(setAppAlert(`INVALID_PAYLOAD_INDICATOR => ${response["00"]}`))
      // dispatch({
      //     type: actionTypes.SET_QR_SCANNER_STATE,
      //     payload: false,
      //   });
      // {
      //   Platform.OS === 'android'
      //     ? dispatch({
      //         type: actionTypes.SET_ELSE_RESPONSE_ALERT,
      //         payload: {
      //           state: true,
      //           alertTitle: `INVALID_PAYLOAD_INDICATOR => ${response['00']}`,
      //           alertText: `INVALID_PAYLOAD_INDICATOR => ${response['00']}`,
      //         },
      //       })
      //     : global.showToast.show('NO_PAYLOAD_INDICATOR_FOUND', 1000);
      // }
      return false;
    } else if (!('01' in response)) {
      // dispatch(setAppAlert('NO_POINT_OF_INITIATION_FOUND'))
      // dispatch({
      //     type: actionTypes.SET_QR_SCANNER_STATE,
      //     payload: false,
      //   });
      // {
      //   Platform.OS === 'android'
      //     ? dispatch({
      //         type: actionTypes.SET_ELSE_RESPONSE_ALERT,
      //         payload: {
      //           state: true,
      //           alertTitle: 'NO_POINT_OF_INITIATION_FOUND',
      //           alertText: 'NO_POINT_OF_INITIATION_FOUND',
      //         },
      //       })
      //     : global.showToast.show('NO_PAYLOAD_INDICATOR_FOUND', 1000);
      // }
      return false;
    } else {
      type = response['01'] === '12' ? qrType[0] : qrType[1];
      merchantAccountInformation = response['15'];
      merchantCategoryCode = response['52'];
      transactionCurrency = response['53'];

      if (response['54']) {
        transactionAmount = response['54'];
      }

      // this.convenienceIndicator = QRCodeConvenienceType.NONE;
      // if (response["55"]) {
      //     convenienceIndicator = QRCodeConvenienceType.fromValue((String)tlv.get("55"));
      // }

      if (response['56']) {
        convenienceFixed = response['56'];
      }

      if (response['57']) {
        conveniencePercentage = response['57'];
      }
      countryCode = response['58'];
      merchantName = response['59'];
      merchantCity = response['60'];
      postalCode = response['61'];
      if (response['62']) {
        additionalData = response['62'];
      }

      if (response['64']) {
        merchantInformationLanguageTemplate = response['64'];
      }

      crc = response['63'];
    }

    let object = {
      crc: crc,
      merchantInformationLanguageTemplate: merchantInformationLanguageTemplate,
      additionalData: additionalData,
      postalCode: postalCode,
      countryCode: countryCode,
      merchantName: merchantName,
      merchantCity: merchantCity,
      conveniencePercentage,
      convenienceFixed,
      transactionAmount,
      merchantCategoryCode,
      merchantAccountInformation,
      type,
      merchantCategoryCode,
      transactionCurrency,
      transactionAmount,
      convenienceIndicator,
      convenienceFixed,
      conveniencePercentage,
      additionalData,
      merchantInformationLanguageTemplate,
      type,
      countryCode,
      merchantName,
      merchantCity,
      postalCode,
      crc,
      country: currency[transactionCurrency],
    };
    dispatch({
      type: actionTypes.SET_SCANNED_QR_OBJECT,
      payload: object,
    });
    dispatch({
      type: actionTypes.SET_QR_SCANNER_STATE,
      payload: false,
    });
    // navigation();
    return true;
  } catch (error) {
    return false;
  }
};
