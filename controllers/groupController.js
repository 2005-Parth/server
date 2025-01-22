const crypto = require("crypto");
const Group = require("../models/groupModel");
const User = require("../models/userModel");


// Functions:
// 1. createGroup
// 2. getGroupById
// 3. getGroups
// 4. joinGroup
// 5. getGroupMembers

// Function to create a group
const createGroup = async (req, res) => {
    try{
        const {name, description, firebaseId} = req.body;
        // use date and time to create a unique join code with random bytes

        const date = new Date().getTime().toString();
        const randomBytes = crypto.randomBytes(64).toString("hex");
        const joinCode = crypto.createHash("sha256").update(date + randomBytes).digest("hex");

        const user = await User.findOne({firebaseId});

        if (!user){
            return res.status(404).json({message: "User not found"});
        }
        // Create a new group
        const newGroup = new Group({
            name,
            description,
            joinCode,
            members: [user._id]
        });

        // Save the group to the database
        await newGroup.save();
        // add to users groups
        user.groups.push(newGroup._id);
        await user.save();
        return res.status(201).json({message: "Group created successfully", newGroup});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};

// join a group

const joinGroup = async (req, res) => {
    try{
        const {joinCode, firebaseId} = req.body;
        const user = await User.findOne({firebaseId});

        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        const group = await Group.findOne({joinCode});
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        group.members.push(user._id);
        await group.save();

        user.groups.push(group._id);
        await user.save();

        return res.status(200).json({message: "Group joined successfully", group});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};

// get group by id
const getGroupById = async (req, res) => {
    try{
        const {groupId} = req.params;
        const group = await Group.findById(groupId);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        return res.status(200).json({group});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};

// get all groups
const getGroups = async (req, res) => {
    try{
        const {firebaseId} = req.body;
        const user = await User.findOne({firebaseId});
        if (!user){
            return res.status(404).json({message: "User not found"});
        }
        const groups = await Group.find({_id: {$in: user.groups}});
        return res.status(200).json({groups});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
}

// get group members
const getGroupMembers = async (req, res) => {
    try{
        const {groupId} = req.params;
        const group = await Group.findById(groupId);
        if (!group){
            return res.status(404).json({message: "Group not found"});
        }
        const members = await User.find({_id: {$in: group.members}});
        return res.status(200).json({members});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
};

module.exports = {createGroup, getGroupById, getGroups, joinGroup, getGroupMembers};