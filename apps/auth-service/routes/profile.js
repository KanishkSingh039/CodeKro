const express = require('express');
const { authenticate } = require('@codekro/authentication-middleware');
const {
  searchUsers,
  checkUsername,
  getUserProfile,
  getUserActivity,
  getSolvedProblems,
  getSolvedSolution,
  followUser,
  updateProfile,
  updateUsername,
  updateAvatar,
  changePassword,
  deleteAccount,
  resetPassword,
} = require('../controller/profile');

const router = express.Router();

router.get('/users/search', authenticate, searchUsers);
router.get('/users/check-username', authenticate, checkUsername);
router.get('/users/:username', authenticate, getUserProfile);
router.get('/users/:username/activity', authenticate, getUserActivity);
router.get('/users/:username/solved', authenticate, getSolvedProblems);
router.get('/users/:username/solved/:problemId', authenticate, getSolvedSolution);
router.patch('/users/:username/follow', authenticate, followUser);

router.patch('/profile', authenticate, updateProfile);
router.patch('/profile/username', authenticate, updateUsername);
router.patch('/profile/avatar', authenticate, updateAvatar);
router.patch('/profile/password', authenticate, changePassword);
router.delete('/profile', authenticate, deleteAccount);
router.post('/password/reset', resetPassword);

module.exports = router;
