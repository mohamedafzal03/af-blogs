const express = require('express')
const router = express.Router();
const db = require('./db');
const Article = require('../models/articles');
const articlePage = require('./articles');
// const articlePage = require('./shorts');

router.get('/articles',articlePage);