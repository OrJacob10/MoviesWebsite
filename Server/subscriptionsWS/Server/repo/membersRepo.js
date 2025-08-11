const membersModel = require('../model/membersModel');

const getAllMembers = () => {
    return membersModel.find({});
}

const getMemberById = (id) => {
    return membersModel.findById(id);
}

const addMember = (member) => {
    return membersModel.create(member);
}

const updateMember = (id, member) => {
    return membersModel.findByIdAndUpdate(id, member);
}

const deleteMember = (id) => {
    return membersModel.findByIdAndDelete(id);
}



module.exports = {getAllMembers, getMemberById, addMember, updateMember, deleteMember};