import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchWrapper } from "_helpers";

// create slice

const name = "cards";
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const cardActions = { ...slice.actions, ...extraActions };
export const cardsReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    cards: { cardList: [] },
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/cards`;

  return {
    getAllCards: getAllCards(),
    addCard: addCard(),
  };

  function getAllCards() {
    return createAsyncThunk(
      `${name}/getAllCards`,
      async (pageNumber) =>
        await fetchWrapper.get(`${baseUrl}?limit=10&page=${pageNumber}`)
    );
  }
  function addCard() {
    return createAsyncThunk(
      `${name}/addCard`,
      async (body) => await fetchWrapper.post(baseUrl, body)
    );
  }
}

function createExtraReducers() {
  return {
    ...getAllCards(),
    ...addCard(),
  };

  function getAllCards() {
    var { pending, fulfilled, rejected } = extraActions.getAllCards;
    return {
      [pending]: (state) => {
        state.cards = { loading: true };
      },
      [fulfilled]: (state, action) => {
        if (state?.cards?.page !== action.payload?.page) {
          state.cardList = [...state?.cardList || [], ...action?.payload?.results];
        }
        state.cards = action.payload;
      },
      [rejected]: (state, action) => {
        state.cards = { error: action.error };
      },
    };
  }
  function addCard() {
    var { pending, fulfilled, rejected } = extraActions.addCard;
    return {
      [pending]: (state) => {
        state.card = { loading: true };
      },
      [fulfilled]: (state, action) => {
        state.card = action.payload;
      },
      [rejected]: (state, action) => {
        state.card = { error: action.error };
      },
    };
  }
}
