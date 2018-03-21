import axios from 'axios';

export const setUserGoals = (userGoals) => {
  const sortedGoals = {
    distance: [],
    steps: [],
    floors: [],
  };

  userGoals.forEach((goal) => {
    sortedGoals[goal.goal_activity].push(goal);
  });
  return { type: 'SET_USER_GOALS', payload: sortedGoals };
};

export const getUserGoals = () => (
  dispatch => (
    axios.get('/userGoals')
      .then((res) => {
        console.log(res.data);
        dispatch(setUserGoals(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
  )
);

const setEggStatus = eggData => ({ type: 'EGG_DATA', payload: eggData });

export const fetchEggStatus = () => (
  dispatch => (
    axios.get('/eggStatus')
      .then((res) => {
        dispatch(setEggStatus(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
  )
);

const newSquaddie = squaddie => ({ type: 'NEW_SQUADDIE', payload: squaddie });

export const hatchEgg = extraXP => (
  dispatch => (
    axios.post('/hatchEgg', { xp: extraXP })
      .then((res) => {
        dispatch(newSquaddie(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
  )
);

// const userGoalFinalize = userGoalID => ({ type: 'FINALIZE_GOAL', payload: userGoalID });

export const markGoalSuccess = userGoalID => (
  dispatch => (
    axios.patch('/completeGoal', { goalID: userGoalID })
      .then((res) => {
        dispatch(getUserGoals(userGoalID));
        dispatch(fetchEggStatus(res.data));
      })
      .catch((err) => {
        console.log(err);
      })
  )
);

export const markGoalFailure = userGoalID => (
  dispatch => (
    axios.patch('/failGoal', { goalID: userGoalID })
      .then(() => {
        dispatch(getUserGoals(userGoalID));
      })
      .catch((err) => {
        console.log(err);
      })
  )
);
