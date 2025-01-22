const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Transaction = require("../models/transactionModel");

const addExpense = async (req, res) => {
    try {
        const { grpId, payerId, users, amount, description } = req.body;
        const newTransaction = new Transaction({
            grpId,
            payerId,
            users,
            amount,
            description
        });
        await newTransaction.save();

        // Add amount to All Users accounts
        const owedUsers = await User.find({ _id: { $in: users } });
        const payer = await User.findById(payerId);
        const amountPerUser = amount / users.length;
        owedUsers.forEach(async (user) => {
            user.account.push({
                userId: payerId,
                amount: -amountPerUser
            });

            await user.save();
            payer.account.push({
                userId: user._id,
                amount: amountPerUser
            });

            await payer.save();
        });

        res.status(201).json({ message: "Transaction added successfully", newTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const settleUp = async (req, res) => {
    try{
        const { id, payerId } = req.body;
        const user = await User.findById(id);
        const payer = await User.findById(payerId);

        // delete account of user in payer's account

        payer.account = payer.account.filter((acc) => acc.userId.toString() !== id);

        // delete account of payer in user's account
        user.account = user.account.filter((acc) => acc.userId.toString() !== payerId);

        await user.save();
        await payer.save();

        res.status(200).json({message: "Settled up successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

module.exports = { addExpense, settleUp };