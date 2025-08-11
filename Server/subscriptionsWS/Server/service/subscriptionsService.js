const subscriptionsRepo = require('../repo/subscriptionsRepo')

const getAllSubscriptions = async () => {
    return subscriptionsRepo.getAllSubscriptions();
}

const getSubscriptionById = async (id) => {
    return subscriptionsRepo.getSubscriptionById(id);
}

const getAllSubscriptionsWithDetails = async () => {
    return subscriptionsRepo.getAllSubscriptionsWithDetails();
}

const addSubscription = async (subscription) => {
    await subscriptionsRepo.addSubscription(subscription);
    return 'Created';
}

const updateSubscription = async (id, subscription) => {
    await subscriptionsRepo.updateSubscription(id, subscription);
    return 'Updated';
}

const deleteSubscription = async (id) => {
    await subscriptionsRepo.deleteSubscription(id);
    return 'Deleted';
}

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    getAllSubscriptionsWithDetails,
    addSubscription,
    updateSubscription,
    deleteSubscription
};