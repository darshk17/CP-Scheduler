const contestRoutes = require('./contestRoutes');
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const emailRoutes = require('./emailRoutes');
const cpRoutes = require('./cpRoutes');
const userRoutes = require('./userRoutes');

// Mount routes under logical prefixes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/contests', contestRoutes);
router.use('/cp', cpRoutes);
router.use('/users', userRoutes);
router.use('/', emailRoutes);
module.exports = router;
