const Finance = require("../models/financeModel");

// ==========================
// CREATE MEMBERSHIP
// ==========================

const createFinance = async (req, res) => {
  try {
    const {
      name,
      contactNo,
      genderSearch,
      planDuration,
      amount,
      startDate,
    } = req.body;

    const membershipStartDate = startDate
      ? new Date(startDate)
      : new Date();

    const expiryDate = new Date(membershipStartDate);

    if (planDuration === "1 Month") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planDuration === "6 Months") {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    } else if (planDuration === "1 Year") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const finance = await Finance.create({
      user: req.userId,
      name,
      contactNo,
      genderSearch,
      planDuration,
      amount,
      startDate: membershipStartDate,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: "Membership created successfully",
      finance,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// GET ALL MEMBERSHIPS
// ==========================

const getAllFinance = async (req, res) => {
  try {

    const memberships = await Finance.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      memberships,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// GET SINGLE MEMBERSHIP
// ==========================

const getFinanceById = async (req, res) => {
  try {

    const membership = await Finance.findById(
      req.params.id
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      membership,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// UPDATE MEMBERSHIP
// ==========================

const updateFinance = async (req, res) => {
  try {

    const {
      name,
      contactNo,
      genderSearch,
      planDuration,
      amount,
      startDate,
    } = req.body;

    const membership = await Finance.findById(
      req.params.id
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    const membershipStartDate = startDate
      ? new Date(startDate)
      : membership.startDate;

    const expiryDate = new Date(
      membershipStartDate
    );

    if (planDuration === "1 Month") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (planDuration === "6 Months") {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    } else if (planDuration === "1 Year") {
      expiryDate.setFullYear(
        expiryDate.getFullYear() + 1
      );
    }

    const updatedMembership =
      await Finance.findByIdAndUpdate(
        req.params.id,
        {
          name,
          contactNo,
          genderSearch,
          planDuration,
          amount,
          startDate: membershipStartDate,
          expiryDate,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Membership updated successfully",
      membership: updatedMembership,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// DELETE MEMBERSHIP
// ==========================

const deleteFinance = async (req, res) => {
  try {

    const membership = await Finance.findById(
      req.params.id
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    await Finance.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Membership deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createFinance,
  getAllFinance,
  getFinanceById,
  updateFinance,
  deleteFinance,
};