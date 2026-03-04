const express = require("express");
const router = express.Router();

const userController = require("@controllers/userController");

// router.get("/users/:id", userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Suppression d'un utilisateur
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Succès de la suppression de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMinimal'
 *       403:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               userDeleteAnotherAccount:
 *                 summary: Suppression d'un autre utilisateur sans être admin
 *                 value:
 *                   error: An User can only delete his own account
 *               tryDeleteAdminAccount:
 *                 summary: Suppression d'un admin
 *                 value:
 *                   error: This user is an admin, you're not allowed to delete this account
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
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
