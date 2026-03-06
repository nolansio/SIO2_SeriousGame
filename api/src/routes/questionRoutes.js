const express = require("express");
const router = express.Router();

const questionController = require("@controllers/questionController");
const authMiddleware = require("@middleware/authMiddleware");

/**
 * @swagger
 * /quizzes/{id}/questions:
 *   post:
 *     summary: Création d'un Question dans un Quizz
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID du Quizz à de la nouvelle Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enonce:
 *                 type: string
 *                 example: Son vrai nom est-il François-Marie Arouet ?
 *               reponse:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Création de la Question avec succès
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
 *                   example: Parameters 'enonce' and 'reponse' required
 *       404:
 *         description: Quizz non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Quizz not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An User can only create a new Question in his own Quizzes
 *       401:
 *         $ref: '#/components/responses/TokenMissing'
 */
router.post(
    "/quizzes/:id/questions",
    authMiddleware,
    questionController.createQuestion,
);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Suppression d'une Question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID de la Question à supprimer
 *     responses:
 *       200:
 *         description: Suppression de la Question avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Question not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An User can only delete a Question in his own Quizzes
 *       401:
 *         $ref: '#/components/responses/TokenMissing'
 */
router.delete(
    "/questions/:id",
    authMiddleware,
    questionController.deleteQuestion,
);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Mise à jour d'une Question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID de la Question à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enonce:
 *                 type: string
 *                 example: Son vrai nom est-il François-Marie Arouet ?
 *               reponse:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Mise à jour de la Question avec succès
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
 *                   example: Parameters 'enonce' and 'reponse' required
 *       404:
 *         description: Question non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Question not found
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An User can only update a Question in his own Quizzes
 *       401:
 *         $ref: '#/components/responses/TokenMissing'
 */
router.put("/questions/:id", authMiddleware, questionController.updateQuestion);

// router.post("/users", userController.createUser);

module.exports = router;
