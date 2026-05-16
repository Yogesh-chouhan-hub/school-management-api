const School = require("../models/schoolModel");
const calculateDistance = require("../utils/distanceCalculator");

// Add School
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude must be numbers",
      });
    }

    const school = await School.create({
      name,
      address,
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: school,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// List Schools
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schools = await School.findAll();

    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude,
      );

      return {
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: school.latitude,
        longitude: school.longitude,
        distance: distance.toFixed(2) + " km",
      };
    });

    schoolsWithDistance.sort((a, b) => {
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

    res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addSchool,
  listSchools,
};
