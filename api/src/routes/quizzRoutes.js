const express = require("express");
const router = express.Router();

const quizzController = require("@controllers/quizzController");
const authMiddleware = require("@middleware/authMiddleware");

// router.get("/users/:id", userController.getUserById);

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Création d'un Quizz
 *     tags: [Quizz]
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
 *                 example: Quizz Voltaire
 *               description:
 *                 type: string
 *                 example: Résision vie de Voltaire
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Création d'un Quizz avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizzMinimal'
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
 *       401:
 *         $ref: '#/components/responses/TokenMissing'
 */
router.post("/quizzes", authMiddleware, quizzController.createQuizz);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: Mise à jour d'un Quizz
 *     tags: [Quizz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: ID du Quizz à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Quizz Voltaire
 *               description:
 *                 type: string
 *                 example: Résision vie de Voltaire
 *     responses:
 *       200:
 *         description: Mise à jour du Quizz avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizzMinimal'
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
 *                   example: An User can only update his own quizzes
 *       401:
 *         $ref: '#/components/responses/TokenMissing'
 */
router.put("/quizzes/:id", authMiddleware, quizzController.updateQuizz);

module.exports = router;
