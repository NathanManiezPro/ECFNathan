const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const chargerQuestions = () => {
    try {
        const data = fs.readFileSync('questions.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier des questions', err);
        return [];
    }
};

const chargerScores = () => {
    try {
        const data = fs.readFileSync('scores.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier des scores', err);
        return [];
    }
};

const sauvegarderScores = (scores) => {
    try {
        fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2), 'utf8');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde des scores', err);
    }
};

app.get('/api/questions', (req, res) => {
    const questions = chargerQuestions();
    res.json(questions);
});

app.post('/api/scores', (req, res) => {
    const { score } = req.body;
    if (typeof score !== 'number') {
        return res.status(400).json({ message: 'Score invalide' });
    }

    const scores = chargerScores();
    scores.push(score);
    scores.sort((a, b) => b - a); // Trier les scores de manière décroissante
    scores.splice(10); // Garder seulement les 10 meilleurs scores
    sauvegarderScores(scores);
    res.status(200).json(scores);
});

app.get('/api/scores', (req, res) => {
    const scores = chargerScores();
    res.json(scores);
});

app.listen(port, () => {
    console.log(`Le serveur fonctionne sur http://localhost:${port}`);
});
