import Message from './message.js';
const message = new Message();

class User {
  static async getUsers() {
    try {
      const resp = await axios.get('http://localhost:3000/users');
      return resp.data;
    } catch (error) {
      message.error(error.message);
    }
  }
  static async createUser(user) {
    try {
      const newUser = await axios.post('http://localhost:3000/users', user);
      return newUser.data;
    } catch (error) {
      message.error(error.message);
    }
  }
  static async updateUser(id, user) {
    try {
      const updatedUser = await axios.put('http://localhost:3000/users/' + id, user);
      return updatedUser.data;
    } catch (error) {
      message.error(error.message);
    }
  }
  static deleteUser(userID) {
    try {
      axios.delete('http://localhost:3000/users/' + userID);
    } catch (error) {
      message.error(error.message);
    }
  }
}

export default User;
