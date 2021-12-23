import { handleActions, createAction } from "redux-actions";
import { apis } from "../../shared/apis";
import axios from "axios";

import produce from "immer";

// initialState
const initialState = {
  list: [],
};

// action
const LOAD = "freeboard/LOAD";
const ADD = "freeboard/POST";
const UPDATE = "freeboard/UPDATE";
const DELETE = "freeboard/DELETE";

// action creater
export const loadBoard = createAction(LOAD, (postList) => ({
  postList,
}));
export const addBoard = createAction(ADD, (postData) => ({ postData }));
export const updateBoard = createAction(UPDATE, (postData) => ({ postData }));
export const deleteBoard = createAction(DELETE, (postId) => ({ postId }));

// token
const accessToken = document.cookie.split("=")[1];
const token = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${accessToken}`,
  },
};
// thunk
export const loadBoardDB =
  (skiResort) =>
  async (dispatch, getState, { history }) => {
    const data = await apis.getPost(skiResort);
    dispatch(loadBoard(data.data));
  };

export const addBoardDB =
  (skiResort, datas) =>
  async (dispatch, getState, { history }) => {
    const data = await apis.writeFreePost(skiResort, token, datas);
    dispatch(addBoard(data));
    dispatch(loadBoardDB());
  };

export const updateBoardDB =
  (postId, datas) =>
  async (dispatch, getState, { history }) => {
    if (!postId) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const data = await apis.updateFreePost(postId, token, datas);
    dispatch(updateBoard(data));
    dispatch(loadBoardDB());
  };

export const deleteBoardDB =
  (postId) =>
  async (dispatch, getState, { history }) => {
    apis.deleteFreePost(postId, token).then((res) => {
      dispatch(deleteBoard(postId));
    });
  };

// reducer
export default handleActions(
  {
    [LOAD]: (state, action) => {
      return {
        ...state,
        list: action.payload.postList,
      };
    },
    [ADD]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.postData);
      }),
    [DELETE]: (state, action) => {
      return {
        ...state,
        list: state.list.filter((list) => list.id !== action.payload.postId),
      };
    },
  },
  initialState
);

const userCreators = {
  addBoardDB,
  loadBoardDB,
  updateBoardDB,
  deleteBoardDB,
};

export { userCreators };
