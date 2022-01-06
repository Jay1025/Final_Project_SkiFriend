import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { apis } from "../../shared/apis";

//action
const GET_CARPOOL = "GET_CARPOOL";
const ADD_CARPOOL = "ADD_CARPOOL";
const EDIT_CARPOOL = "EDIT_CARPOOL";
const DELETE_CARPOOL = "DELETE_CARPOOL";
const FILTER_CARPOOL = "FILTER_CARPOOL";
const GET_MYCARPOOL = "GET_MYCARPOOL";
// const IS_LOADING = "IS_LOADING";
// const IS_NEXT = "IS_NEXT";
const IMAGE_RESORT = 'IMAGE_RESORT';

// acrtion creators
const getCarpool = createAction(GET_CARPOOL, (skiResort, list) => ({ 
  skiResort,
  list,
}));
const addCarpool = createAction(ADD_CARPOOL, (carpool) => ({ carpool }));
const editCarpool = createAction(EDIT_CARPOOL, (postId, carpool) => ({
  postId,
  carpool,
}));
const deleteCarpool = createAction(DELETE_CARPOOL, (postId) => ({ postId }));
const getMyCarpool = createAction(GET_MYCARPOOL, (myCarpools) => ({
  myCarpools,
}));
const filterCarpool = createAction(FILTER_CARPOOL, (carpool) => ({carpool}))
// const isLoading = createAction(IS_LOADING, (state) => ({ state }));
// const isNext = createAction(IS_NEXT, (state) => ({ state }));
const imageResort = createAction(IMAGE_RESORT, (url) => ({url}))

// middlewares
const imageResortDB = (skiResort) => {
  return async function(dispatch) {
    console.log(skiResort)
    try {
      const response = await apis.imageResort(skiResort);
      console.log(response.data.resortImg);

      response && dispatch(imageResort(response.data.resortImg))
    } catch(err) {
      console.log(err)
    }
  }
}

const getCarpoolDB = (skiResort, page) => {
  return async function (dispatch) {
    // dispatch(isLoading(true));

    try {
      const response = await apis.getCarpool(skiResort, page);
      console.log(response)
      response && dispatch(getCarpool(skiResort, response.data));
      // if (response.data.length === 3) {
      //   dispatch(getCarpool(skiResort, response.data));
      //   dispatch(isNext(true));
      // } else {
      //   dispatch(getCarpool(skiResort, response.data));
      //   dispatch(isNext(false));
      // }
    } catch (err) {
      console.log(err);
    }
  };
};

const addCarpoolDB = (skiResort, carpool) => {
  return async function (dispatch, getState, { history }) {
    console.log(skiResort, carpool);

    try {
      const response = await apis.addCarpool(skiResort, carpool);
      console.log(response.data);

      response && history.push(`/carpool/${skiResort}`);
      dispatch(addCarpool(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

const editCarpoolDB = (postId, carpool) => {
  return async function (dispatch, getState, { history }) {
    console.log(postId, carpool);

    try {
      const response = await apis.editCarpool(postId, carpool);

      response && history.goBack();
      dispatch(editCarpool(postId, response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

const deleteCarpoolDB = (skiResort, postId) => {
  return async function (dispatch, getState, { history }) {
    console.log(skiResort, postId);

    try {
      await apis.deleteCarpool(postId);

      dispatch(deleteCarpool(postId));
      // history.push(`/carpool/${skiResort}`);
    } catch (err) {
      console.log(err);
    }
  };
};

const completeCarpoolDB = (skiResort, postId) => {
  return async function (dispatch, getState, { history }) {
    try {
      await apis.completeCarpool(postId);
      console.log("모집완료");

      dispatch(getCarpoolDB(skiResort));
    } catch (err) {
      console.log(err);
    }
  };
};

const filterCarpoolDB = (skiResort, form) => {
  return async function (dispatch, getState, { history }) {
    console.log(skiResort, form);

    try {
      const response = await apis.filterCarpool(skiResort, form);

      if (response.data.length === 0) {
        window.alert("필터에 맞는 정보가 없습니다");
        return null;
      } else {
        dispatch(filterCarpool(response.data));
        history.push(`/filter/${skiResort}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
};

const getMyCarpoolDB = () => {
  return async function (dispatch, getState, { history }) {
    console.log("내가 쓴 카풀");
    try {
      const response = await apis.getMyCarpool();
      console.log(response.data);

      response && dispatch(getMyCarpool(response.data));
    } catch (err) {
      console.log(err);
    }
  };
};

// initialState
const initialState = {
  resortImg: '',
  list: [],
  filterList: [],
  myList: [],
  page: 1,
  is_loading: false,
  is_next: false,
};

// reducer
export default handleActions(
  {
    [GET_CARPOOL]: (state, action) =>
      produce(state, (draft) => {
        console.log(action.payload.list);
        const skiResort = action.payload.skiResort;
        draft.loading = false;
        // draft.page += 1;
        draft.list = action.payload.list;
        // draft.list.push(...draft.list, {[skiResort]: action.payload.list});
      }),

    [ADD_CARPOOL]: (state, action) =>
      produce(state, (draft) => {
        console.log(action.payload.carpool);
        draft.list.unshift(action.payload.carpool);
      }),

    [EDIT_CARPOOL]: (state, action) =>
      produce(state, (draft) => {
        const idx = draft.list.findIndex(
          (l) => l.postId === Number(action.payload.postId)
        );
          console.log(idx)
        draft.list[idx] = { ...draft.list[idx], ...action.payload.carpool };
      }),

    [DELETE_CARPOOL]: (state, action) =>
      produce(state, (draft) => {
        let deleted_list = draft.list.filter(
          (l) => l.postId !== action.payload.postId
        );

        draft.list = deleted_list;
      }),

    [FILTER_CARPOOL]: (state, action) =>
      produce(state, (draft) => {
        draft.filterList = action.payload.carpool;
      }),

    [GET_MYCARPOOL]: (state, action) =>
      produce(state, (draft) => {
        draft.myList = action.payload.myCarpools;
      }),

    // [IS_LOADING]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.is_loading = action.payload.state;
    //   }),

    // [IS_NEXT]: (state, action) =>
    //   produce(state, (draft) => {
    //     draft.is_next = action.payload.state;
    //   }),

    [IMAGE_RESORT]: (state, action) =>
      produce(state, (draft) => {
        console.log(action.payload.url)
        draft.resortImg = action.payload.url;
      }),
  },
  initialState
);

const carpoolActions = {
  getCarpool,
  addCarpool,
  editCarpool,
  deleteCarpool,
  getCarpoolDB,
  addCarpoolDB,
  editCarpoolDB,
  deleteCarpoolDB,
  completeCarpoolDB,
  filterCarpoolDB,
  getMyCarpoolDB,
  imageResortDB,
};

export { carpoolActions };
