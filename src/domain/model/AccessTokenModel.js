export default class AccessTokenModel {
  constructor(userId, accessToken) {
    this.userId = userId;
    this.accessToken = accessToken;
  }

  getData() {
    return {"user_id": this.userId, "access_token": this.accessToken};
  }
}
