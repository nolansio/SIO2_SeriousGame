const express = require('express');
const router = express.Router();

const quizController = require('@controllers/quizController');
const authMiddleware = require('@middleware/authMiddleware');
const authorizeRoles = require("@middleware/authorizeRoles");

// router.get('/users/:id', userController.getUserById);

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Création d'un quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Quiz Voltaire
 *               description:
 *                 type: string
 *                 example: Révision vie de Voltaire
 *     responses:
 *       201:
 *         description: Quiz créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizMinimal'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'title' and 'description' required
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can't create a quiz for another user
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
router.post('/quizzes', authMiddleware, quizController.create);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: Mise à jour d'un quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID du quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Quiz Voltaire
 *               description:
 *                 type: string
 *                 example: Révision vie de Voltaire
 *     responses:
 *       200:
 *         description: Quiz mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizMinimal'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'id', 'title' and 'description' required
 *       404:
 *         description: Quiz non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quiz not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only update his own quizzes
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 */
router.put('/quizzes/:id', authMiddleware, quizController.update);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Récupération des informations d'un quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID de la question
 *     responses:
 *       200:
 *         description: Quiz récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizFull'
 *       404:
 *         description: Quiz non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quiz not found
 */
router.get("/quizzes/:id", authMiddleware, quizController.get);

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Récupération de tous les quizz (admin uniquement)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les quizz
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuizFull'
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 *       403:
 *         description: Non autorisé
 */
router.get('/quizzes', authMiddleware, authorizeRoles('ADMIN'), quizController.getAll);

/**
 * @swagger
 * /quizzes/{code}:
 *   get:
 *     summary: Récupération d'un quizz par son code
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *           required: true
 *           description: Code unique du quizz
 *     responses:
 *       200:
 *         description: Quiz récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizFull'
 *       404:
 *         description: Quiz non trouvé
 */
router.get('/quizzes/:code', quizController.getByCode);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Suppression d'un quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID du quiz
 *     responses:
 *       200:
 *         description: Quiz supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizMinimal'
 *       404:
 *         description: Quiz non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quiz not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only delete his own quizzes
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 */
router.delete('/quizzes/:id', authMiddleware, quizController.delete);

module.exports = router;
