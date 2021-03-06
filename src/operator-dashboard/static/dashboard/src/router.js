/*
 SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import { getLocale } from './utils/utils';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

const currentLocale = getLocale();
addLocaleData(currentLocale.data);
function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const BasicLayout = routerData['/'].component;
  return (
    <IntlProvider locale={currentLocale.locale} messages={currentLocale.messages}>
      <LocaleProvider locale={currentLocale.antd}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/exception" component={BasicLayout} />
            <AuthorizedRoute
              path="/administrator"
              render={props => <BasicLayout {...props} />}
              authority={['administrator']}
              redirectPath="/exception/403"
            />
            <AuthorizedRoute
              path="/"
              render={props => <BasicLayout {...props} />}
              authority={['administrator', 'operator']}
              redirectPath="/exception/403"
            />
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    </IntlProvider>
  );
}

export default RouterConfig;
