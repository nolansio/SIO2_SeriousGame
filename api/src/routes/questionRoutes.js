const express = require('express');
const router = express.Router();

const questionController = require('@controllers/questionController');
const authMiddleware = require('@middleware/authMiddleware');

/**
 * @swagger
 * /quizzes/{id}/questions:
 *   post:
 *     summary: Création d'une question
 *     tags: [Question]
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
 *                 example: Son vrai nom est-il François-Marie Arouet ?
 *               answer:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: question créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'title' and 'answer' required
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
 *                   example: An user can only create a new question in his own quizzes
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 */
router.post('/quizzes/:id/questions', authMiddleware, questionController.create);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Suppression d'une question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID de la question
 *     responses:
 *       200:
 *         description: Question supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/question'
 *       404:
 *         description: Question non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: question not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only delete a question in his own quizzes
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 */
router.delete('/questions/:id', authMiddleware, questionController.delete);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Mise à jour d'une question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID de la question à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Son vrai nom est-il François-Marie Arouet ?
 *               answer:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Mise à jour de la question avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/question'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'title' and 'answer' required
 *       404:
 *         description: question non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: question not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An User can only update a question in his own quizzes
 *       401:
 *         $ref: '#/components/responses/InvalidOrMissingToken'
 */
router.put('/questions/:id', authMiddleware, questionController.update);

// router.post('/users', userController.createUser);

module.exports = router;
