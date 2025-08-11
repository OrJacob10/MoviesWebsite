const subscriptionsModel = require('../model/subscriptionsModel');

const getAllSubscriptions = () => {
    return subscriptionsModel.find({});
}

const getSubscriptionById = (id) => {
    return subscriptionsModel.findById(id);
}

const getAllSubscriptionsWithDetails = async () => {
    try {
        console.log('Fetching subscriptions with details...');
        const subscriptions = await subscriptionsModel.find({})
            .populate('memberId', 'name email city')
            .populate('movieId', 'name genres image premiered');
        console.log('Found subscriptions:', subscriptions);
        return subscriptions;
    } catch (error) {
        console.error('Error in getAllSubscriptionsWithDetails:', error);
        throw error;
    }
}

const addSubscription = (subscription) => {
    return subscriptionsModel.create(subscription);
}

const updateSubscription = (id, subscription) => {
    return subscriptionsModel.findByIdAndUpdate(id, subscription);
}

const deleteSubscription = (id) => {
    return subscriptionsModel.findByIdAndDelete(id);
}

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    getAllSubscriptionsWithDetails,
    addSubscription,
    updateSubscription,
    deleteSubscription
};