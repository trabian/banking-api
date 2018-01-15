import R from "ramda";

class InMemorySDK {
  constructor(initialState, context) {
    this.state = initialState;
    this.context = context;
  }

  getCurrentUser = () => ({
    id: this.context.userId
  });

  getAccount = id =>
    R.pipe(
      R.prop("accounts"),
      R.find(R.propEq("id", id)),
      R.unless(R.propEq("userId", this.context.userId), () => {
        throw "This is not your account.";
      })
    )(this.state);

  getAccounts = () =>
    R.pipe(
      R.prop("accounts"),
      R.filter(R.propEq("userId", this.context.userId))
    )(this.state);
}

export default InMemorySDK;
