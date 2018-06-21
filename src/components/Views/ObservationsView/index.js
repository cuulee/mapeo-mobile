// @flow
import { connect } from 'react-redux';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';

import { observationSelect } from '../../../ducks/observations';
import { categoryList } from '../../../ducks/categories';
import { fieldList } from '../../../ducks/fields';
import ObservationsView from './ObservationsView';
import type { StateProps, DispatchProps } from './ObservationsView';

function mapStateToProps(state: StoreState): StateProps {
  const observations = values(state.app.observations).sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );
  const drawerOpened = state.app.drawers.observations;
  return { drawerOpened, observations, categories: state.app.categories };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    selectObservation: o => dispatch(observationSelect(o)),
    goToObservationDetail: () =>
      dispatch(
        NavigationActions.navigate({ routeName: 'ObservationDetailView' })
      ),
    goToSyncView: () =>
      dispatch(NavigationActions.navigate({ routeName: 'SyncView' })),
    goToSettings: () =>
      dispatch(NavigationActions.navigate({ routeName: 'SettingsView' })),
    listCategories: () => {
      dispatch(categoryList(''));
      dispatch(fieldList(''));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withNavigationFocus(ObservationsView)
);
