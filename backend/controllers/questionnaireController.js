const pool = require('../config/db');

exports.submitQuestionnaire = async (req, res) => {
    try {
        const { answers } = req.body; 
        const user_id = req.user.id;

        // Create questionnaire record
        const [qRes] = await pool.query('INSERT INTO questionnaires (user_id) VALUES (?)', [user_id]);
        const questionnaire_id = qRes.insertId;

        let internal_score = 0;
        let external_score = 0;

        // Insert answers and calculate scores
        for (let answer of answers) {
            await pool.query(
                'INSERT INTO answers (questionnaire_id, question, score, type) VALUES (?, ?, ?, ?)',
                [questionnaire_id, answer.question, answer.score, answer.type]
            );

            if (answer.type === 'internal') {
                internal_score += parseInt(answer.score);
            } else if (answer.type === 'external') {
                external_score += parseInt(answer.score);
            }
        }

        // Calculate insight
        let conclusion = "";
        let internalPercent = (internal_score / (internal_score + external_score)) * 100 || 50;
        let externalPercent = (external_score / (internal_score + external_score)) * 100 || 50;

        if (internal_score > external_score) {
            conclusion = "Your assessment indicates a strong internal influence. You are significantly driven by your own emotions, mindset, and personal reflection. This is an introspective strength, allowing you to self-regulate, though it may also mean you take a lot of pressure upon yourself.";
        } else if (external_score > internal_score) {
            conclusion = "Your assessment indicates a strong external influence. Your environment, social circles, and worldly events heavily impact your well-being. Being highly receptive can foster deep empathy, but ensure you also establish grounding boundaries against excessive external pressure.";
        } else {
            conclusion = "Your assessment indicates a beautifully balanced state. You are equally aware of your internal feelings and the external environment. This equilibrium serves as a solid foundation for mental resilience.";
        }

        // Save result
        await pool.query(
            'INSERT INTO results (questionnaire_id, internal_score, external_score, conclusion) VALUES (?, ?, ?, ?)',
            [questionnaire_id, Math.round(internalPercent), Math.round(externalPercent), conclusion]
        );

        res.status(201).json({ message: 'Submitted successfully', result_id: questionnaire_id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.getResult = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM results WHERE questionnaire_id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Result not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
