const userModel = require("../model/usersModel");
const bcrypt = require("bcrypt");
const jFile = require("jsonfile");
const path = require("path");

const permissionsJsonFile = path.join(__dirname, "../data/permissions.json");
const usersJsonFile = path.join(__dirname, "../data/users.json");

const getAllUsers = async () => {
  const usersJsonData = await jFile.readFile(usersJsonFile);
  const users = usersJsonData.users;

  const permissionsJsonData = await jFile.readFile(permissionsJsonFile);
  const usersPermissions = permissionsJsonData.usersPermissions;

  const usersWithPermissions = users.map((user) => {
    const userPermissions = usersPermissions.find((p) => p.id === user.id);
    return {
      ...user,
      permissions: userPermissions ? userPermissions.permissions : [],
    };
  });

  return usersWithPermissions;
};

const getUser = async (id) => {
  const usersJsonData = await jFile.readFile(usersJsonFile);
  const user = usersJsonData.users.find((user) => user.id === id);
  console.log("this is the user from json: " + user);

  const permissionsJsonData = await jFile.readFile(permissionsJsonFile);
  const usersPermissions = permissionsJsonData.usersPermissions.find(
    (p) => p.id === id
  );
  return {
    ...user,
    permissions: usersPermissions ? usersPermissions.permissions : [],
  };
};

// add user to the database and to both json files
const addUser = async (user) => {
  try {
    const username = user.username;
    const existingUser = await userModel.findOne({ username });
    console.log(existingUser);
    let newUser = null;
    if (!existingUser){
      console.log("not existing")
       newUser = await userModel.create({ username: user.username });
    }
    else
    throw new Error("Username already exists");

    const usersJsonFileData = await jFile.readFile(usersJsonFile);
    const newUsersArr = [...usersJsonFileData.users];
    const now = new Date();

    const createdUser = {
      id: newUser._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      createdDate: `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}`,
      sessionTimeOut: user.sessionTimeOut,
    };
    
    newUsersArr.push(createdUser);
    console.log(createdUser);
    await jFile.writeFile(usersJsonFile, { users: newUsersArr });
    // reading the json file (users) 
    const usersPermissionsData = await jFile.readFile(permissionsJsonFile);
    const newUsersPremissionsArr = [...usersPermissionsData.usersPermissions];
    // adding the user 
    newUsersPremissionsArr.push({
      id: newUser._id,
      permissions: user.permissions,
    });
    await jFile.writeFile(permissionsJsonFile, {
      usersPermissions: newUsersPremissionsArr,
    });

    return { ...createdUser, permissions: user.permissions };
  } catch (error) {
    console.error("Error in addUser:", error.message);
    throw new Error(error.message);
  }
};

const updateUser = async (id, user) => {


  await userModel.findByIdAndUpdate(id, user);

  // Update user in users JSON file
  const usersJsonFileData = await jFile.readFile(usersJsonFile);
  const newUsersArr = usersJsonFileData.users.map((userFromJson) => {
    if (userFromJson.id === id) {
      const { permissions, ...userWithoutPermissions } = {
        ...userFromJson,
        ...user,
      };
      return userWithoutPermissions; // Return object without permissions
    }
    return userFromJson;
  });

  await jFile.writeFile(usersJsonFile, { users: newUsersArr });

  // Update user permissions in permissions JSON file
  const usersPermissionsData = await jFile.readFile(permissionsJsonFile);
  console.log(usersPermissionsData);
  const newPermissionsArr = usersPermissionsData.usersPermissions.map((perm) =>
    perm.id === id ? { ...perm, permissions: user.permissions } : perm
  );

  await jFile.writeFile(permissionsJsonFile, {
    usersPermissions: newPermissionsArr,
  });

  return "Updated";
};

// delete user from database and both json files
const deleteUser = async (id) => {
  await userModel.findByIdAndDelete(id);
  // getting users from json file
  const usersJsonFileData = await jFile.readFile(usersJsonFile);
  const newUsersArr = usersJsonFileData.users.filter((user) => user.id !== id);
  await jFile.writeFile(usersJsonFile, { users: newUsersArr });

  // getting users permissions from json file
  const usersPermissionsData = await jFile.readFile(permissionsJsonFile);
  console.log(usersPermissionsData);
  const newUsersPermissionsArr = usersPermissionsData.usersPermissions.filter(
    (user) => user.id !== id
  );
  console.log(newUsersPermissionsArr);
  await jFile.writeFile(permissionsJsonFile, {
    usersPermissions: newUsersPermissionsArr,
  });

  return "Deleted";
};

const getUserByUsername = async (username) => {
  const user = await userModel.findOne({ username: username });
  if (user) return user;
  else throw new Error("User not found");
};

// updating user permissions in json file
const setUserPermissions = async (id, updatedPermissions) => {
  try {
    const data = await jFile.readFile(permissionsJsonFile);

    const userIndex = data.usersPermissions.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    data.usersPermissions[userIndex].permissions = updatedPermissions;

    await jFile.writeFile(permissionsJsonFile, data);

    return `Permissions for user with ID ${id} have been updated successfully.`;
  } catch (error) {
    console.error("Error updating user permissions:", error.message);
    throw error;
  }
};

const createAccount = async (username, password) => {
  try {
    const existingUser = await userModel.findOne({ username });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check if the password is already set
    if (existingUser.password && existingUser.password.trim() !== "") {
      throw new Error("Password already set for this user");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.updateOne({ username }, { password: hashedPassword });

    return "Account created successfully";
  } catch (error) {
    throw new Error(
      error.message || "An error occurred while creating the account"
    );
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getUserByUsername,
  setUserPermissions,
  createAccount,
};
