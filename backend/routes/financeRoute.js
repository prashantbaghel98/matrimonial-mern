const express = require("express");
const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createFinance,
    getAllFinance,
    getFinanceById,
    updateFinance,
    deleteFinance,
} = require("../controllers/financeController");

// Create Membership
router.post(
    "/membership-create",
    authMiddleware,
    createFinance
);

// Get All Memberships
router.get(
    "/all",
    authMiddleware,
    getAllFinance
);

// Get Single Membership
router.get(
    "/:id",
    authMiddleware,
    getFinanceById
);

// Update Membership
router.put(
    "/update/:id",
    authMiddleware,
    updateFinance
);

// Delete Membership
router.delete(
    "/delete/:id",
    authMiddleware,
    deleteFinance
);

module.exports = router;