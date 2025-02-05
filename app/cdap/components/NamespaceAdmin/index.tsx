/*
 * Copyright © 2021 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { useEffect } from 'react';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { getCurrentNamespace } from 'services/NamespaceStore';
import {
  getNamespaceDetail,
  reset,
  getPreferences,
  getDrivers,
  getConnections,
  getAndSetSourceControlManagement,
} from 'components/NamespaceAdmin/store/ActionCreator';
import { Provider } from 'react-redux';
import Store from 'components/NamespaceAdmin/store';
import Description from 'components/NamespaceAdmin/Description';
import Metrics from 'components/NamespaceAdmin/Metrics';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
import { getProfiles, resetProfiles } from 'components/Cloud/Profiles/Store/ActionCreator';
import { FeatureProvider } from 'services/react/providers/featureFlagProvider';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import { AdminTabs } from 'components/NamespaceAdmin/AdminTabs';

const eventEmitter = ee(ee);

const useStyle = makeStyle(() => {
  return {
    content: {
      padding: '0 18px',
    },
    titleHeading: {
      padding: '15px 0 0 18px',
    },
  };
});

const NamespaceAdmin = () => {
  const namespace = getCurrentNamespace();
  const classes = useStyle();

  useEffect(() => {
    getNamespaceDetail(namespace);
    getPreferences(namespace);
    getDrivers(namespace);
    getConnections(namespace);
    getProfiles(namespace);
    getAndSetSourceControlManagement(namespace);

    eventEmitter.on(globalEvents.NSPREFERENCESSAVED, getPreferences);
    eventEmitter.on(globalEvents.ARTIFACTUPLOAD, getDrivers);

    return () => {
      eventEmitter.off(globalEvents.NSPREFERENCESSAVED, getPreferences);
      eventEmitter.off(globalEvents.ARTIFACTUPLOAD, getDrivers);
      reset();
      resetProfiles();
    };
  }, []);

  return (
    <Provider store={Store}>
      <div>
        <Heading
          type={HeadingTypes.h4}
          label={`Namespace '${namespace}'`}
          className={classes.titleHeading}
        />
        <div className={classes.content}>
          <Description />
          <Metrics />
          <FeatureProvider>
            <AdminTabs />
          </FeatureProvider>
        </div>
      </div>
    </Provider>
  );
};

export default NamespaceAdmin;
