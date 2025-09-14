export class GenerateRandomCode {
  randomCode() {
    // Generate random code for send to client/user in login with email logic
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
