const membersRepo = require("../repo/membersRepo");
const subscriptionsRepo = require("../repo/subscriptionsRepo");
const moviesRepo = require("../repo/moviesRepo");
const membersModel = require("../model/membersModel");
const subscriptionsModel = require("../model/subscriptionsModel");

// get all members with the movies that they are subscribed to.
const getAllMembers = async () => {
  const membersArray = await membersRepo.getAllMembers();
  const subscriptionsArray = await subscriptionsRepo.getAllSubscriptions();
  const moviesArray = await moviesRepo.getAllMovies();

  const membersPlain = membersArray.map((member) =>
    member.toObject ? member.toObject() : member
  );

  const mergedArray = membersPlain.map((member) => {
    const movies = subscriptionsArray
      .filter(
        (subscription) =>
          subscription.memberId.toString() === member._id.toString()
      )
      .map((subscription) => {
        const movie = moviesArray.find(
          (movie) => movie._id.toString() === subscription.movieId.toString()
        );
        return movie
          ? {
              _id: movie._id.toString(),
              name: movie.name,
              dateWatched: subscription.dateWatched,
            }
          : null;
      })
      .filter((movie) => movie !== null);

    return { ...member, moviesSubscribed: movies };
  });

  return mergedArray;
};

const getMemberById = async (id) => {
  return membersRepo.getMemberById(id);
};

const addMember = async (member) => {
  const email = member.email;
  const existingMember = await membersModel.findOne({ email });

  if (!existingMember) {
    return membersRepo.addMember(member);
  } else {
    throw new Error("Email already exists");
  }
};

const updateMember = async (id, member) => {
  await membersRepo.updateMember(id, member);
  return "Updated";
};

const deleteMember = async (id) => {
  try {
    // Delete the member
    const deletedMember = await membersModel.findByIdAndDelete(id);

    if (!deletedMember) {
      throw new Error("Member not found");
    }

    // Delete all subscriptions related to this member
    await subscriptionsModel.deleteMany({ memberId: id });

    return { message: "Member and related subscriptions deleted successfully" };
  } catch (error) {
    console.error("Error in deleteMember service:", error);
    throw error;
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
};
