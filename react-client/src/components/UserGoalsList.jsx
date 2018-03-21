import React from 'react';
import { Grid, Segment, Header, Statistic, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as incubatorActions from '../actions/incubatorActions';

const UserGoalsList = (props) => {
  const makeDeadLineMessage = (goal) => {
    const nowUTC = moment.utc();
    const now = moment();
    console.log(nowUTC);
    console.log(now);
    const deadline = moment.utc(goal.user_goal_end_date);
    const days = deadline.diff(now, 'days');
    if (days >= 1) {
      return `${(days + 1)} days`;
    }
    const hours = deadline.diff(now, 'hours');
    if (hours >= 1) {
      return `${(hours + 1)} hours`;
    }
    return `${deadline.diff(now, 'minutes') + 1} minutes`;
  };

  const actvitiyName = (goalActivity) => {
    switch (goalActivity) {
      case 'distance':
        return 'Miles';
      case 'floors':
        return 'Flights';
      case 'steps':
        return 'steps';
      default:
        return 'activity not recognized';
    }
  };

  const statusIndicator = (goal) => {
    if (goal.user_goal_concluded && !goal.user_goal_finalized) {
      if (goal.user_goal_success) {
        return (
          <Button onClick={() => { props.incubatorActions.markGoalSuccess(goal.user_goal_id); }}>
            Goal Success!
          </Button>);
      }
      return (
        <Button onClick={() => { props.incubatorActions.markGoalFailure(goal.user_goal_id); }}>
          Goal Failed :(
        </Button>);
    }
    if (goal.user_goal_finalized) {
      if (goal.user_goal_success) {
        return <div> You failed this goal :( </div>;
      }
      return <div> You passed this goal! </div>;
    }
    if (goal.user_goal_end_date) {
      return (
        <Grid.Row columns={2}>
          <Grid.Column>
            <Statistic
              floated="right"
              size="mini"
            >
              <Statistic.Value>
                {goal.user_goal_target - goal.user_goal_current} {actvitiyName(goal.goal_activity)}
              </Statistic.Value>
              <Statistic.Label>
           to go!
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            {makeDeadLineMessage(goal)} left!
          </Grid.Column>
        </Grid.Row>
      );
    }
    return (
      <div>
        <Statistic
          floated="right"
          size="mini"
        >
          <Statistic.Value>
            {goal.user_goal_target - goal.user_goal_current}
          </Statistic.Value>
          <Statistic.Label>
            {actvitiyName(goal.goal_activity)} to go!
          </Statistic.Label>
        </Statistic>
      </div>
    );
  };

  if (props.goals) {
    return (
      <Segment.Group raised>
        {props.goals.map(goal => (
          <Segment
            key={goal.user_goal_id}
            compact
            clearing
          >
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header as="h4">{goal.goal_name}</Header>
                </Grid.Column>
              </Grid.Row>
              {statusIndicator(goal)}

            </Grid>
          </Segment>))
            }
      </Segment.Group>

    );
  }
  return (
    <span>You have no goals!</span>
  );
};

UserGoalsList.propTypes = {
  // state: PropTypes.shape({
  //   steps: PropTypes.number,
  //   distance: PropTypes.number,
  //   stairs: PropTypes.number,
  // }).isRequired,
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  incubatorActions: PropTypes.shape({
    markGoalSuccess: PropTypes.func,
    markGoalFailure: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => (
  {
    state: state.main,
  }
);

const mapDispatchToProps = dispatch => (
  {
    incubatorActions: bindActionCreators(incubatorActions, dispatch),
  }
);
export default connect(mapStateToProps, mapDispatchToProps)(UserGoalsList);
