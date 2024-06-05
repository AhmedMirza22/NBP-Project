import {Platform} from 'react-native';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import {logs} from '../../Config/Config';
export const InAppUpdate = (versionObject) => {
  const inAppUpdates = new SpInAppUpdates(
    true, // isDebug
  );
  inAppUpdates.checkNeedsUpdate().then((result) => {
    logs.log('Version Fetch:', result);
    if (result.shouldUpdate) {
      if (versionObject.currentVersion < versionObject.minVersion) {
        logs.log('Current Version is less than minimum Version');
        const updateOptions: StartUpdateOptions = Platform.select({
          ios: {
            title: 'Update available',
            message:
              'There is a new version of the app available on the App Store, do you want to update it?',
            buttonUpgradeText: 'Update',
            buttonCancelText: 'Cancel',
            forceUpgrade: true,
            // :point_left::skin-tone-2: the country code for the specific version to lookup for (optional)
          },
          android: {
            updateType: IAUUpdateKind.IMMEDIATE,
          },
        });
        inAppUpdates.startUpdate(updateOptions);
        inAppUpdates.addStatusUpdateListener(onStatusUpdate);
      } else if (
        versionObject.currentVersion > versionObject.minVersion &&
        versionObject.currentVersion < versionObject.maxVersion
      ) {
        logs.log(
          'Current Version is greater than minimum Version but less than max Version',
        );
        const updateOptions: StartUpdateOptions = Platform.select({
          ios: {
            title: 'Update available',
            message:
              'There is a new version of the app available on the App Store, do you want to update it?',
            buttonUpgradeText: 'Update',
            buttonCancelText: 'Cancel',
            forceUpgrade: false,
            // :point_left::skin-tone-2: the country code for the specific version to lookup for (optional)
          },
          android: {
            updateType: IAUUpdateKind.FLEXIBLE,
          },
        });
        inAppUpdates.startUpdate(updateOptions);
        inAppUpdates.addStatusUpdateListener(onStatusUpdate);
      }
    } else {
      logs.log('====>>>>version are fine do nothing');
    }
  });
  const onStatusUpdate = (status) => {
    console.log('data Status', status);
  };
};
