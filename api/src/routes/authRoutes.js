const express = require('express');
const router = express.Router();

const authController = require('@controllers/authController');
const authMiddleware = require('@middleware/authMiddleware');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: S'inscrire
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.fr
 *               password:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Se connecter
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.fr
 *               password:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupérer son utilisateur
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *       401:
 *         description: Jeton manquant ou invalide
 *       403:
 *         description: Accès refusé
 */
router.get('/me', authMiddleware, authController.myself);

module.exports = router;
