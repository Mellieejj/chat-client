function reducer(state = [], action) {
  console.log(action);

  switch (action.type) {
    case "ALL_CHANNELS":
      console.log("payload test:", action.payload);
      return action.payload;
    case "NEW_CHANEL":
      return [...state, action.payload];
    default:
      return state;
  }
}

export default reducer;
