import { User } from "../@types/user.js";
import { userServiceInstance } from "./index.js";

class AuthService {
  auth = async (user: User) : Promise<User> => {
    try {
      const userData = await userServiceInstance.getById(user.id)

      if(!userData) {
        const createdUser = await userServiceInstance.create({
          id: user.id,
          name: user.name,
          email: user.email
        })

        if (!createdUser) throw new Error("There's something error on registering user")

        return createdUser
      } else {
        return userData
      }
    } catch (error) {
      throw error
    }
  }
}

export default AuthService