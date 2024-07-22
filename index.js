const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
require('dotenv').config();


const app = express();
const port = 3005;
const cors = require('cors');
app.use(cors());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MariaDB');
});

// Fonction pour fetch et stocker les données de l'API
const fetchAndStoreData = async () => {
    try {
        // Récupérer les données de l'API currency
        const currencyResponse = await axios.get(process.env.API_CURRENCY_FETCH);
        const currencyData = currencyResponse.data;

        // Récupérer les données de l'API fragment
        const fragmentResponse = await axios.get(process.env.API_FRAGMENT_FETCH);
        const fragmentData = fragmentResponse.data;

        // Récupérer les données de l'API armour
        const armourResponse = await axios.get(process.env.API_ARMOUR_FETCH);
        const armourData = armourResponse.data;

        // Récupérer les données de l'API accessory
        const accessoryResponse = await axios.get(process.env.API_ACCESSORY_FETCH);
        const accessoryData = accessoryResponse.data;

        // Récupérer les données de l'API weapon
        const weaponResponse = await axios.get(process.env.API_WEAPON_FETCH);
        const weaponData = weaponResponse.data;

           // Récupérer les données de l'API weapon
           const flaskResponse = await axios.get(process.env.API_FLASK_FETCH);
           const flaskData = flaskResponse.data;

               // Récupérer les données de l'API weapon
           const mapResponse = await axios.get(process.env.API_MAP_FETCH);
           const mapData = mapResponse.data;

           
               // Récupérer les données de l'API weapon
               const jewelResponse = await axios.get(process.env.API_JEWEL_FETCH);
               const jewelData = jewelResponse.data;

                // Récupérer les données de l'API weapon
                const cardResponse = await axios.get(process.env.API_CARD_FETCH);
                const cardData = cardResponse.data;
                
               
           

        // Fusionner les données dans un tableau unique
        const mergedData = [
            ...currencyData.map(item => ({ category: 'currency', name: item.name, mean: item.mean, icon: item.icon })),
            ...fragmentData.map(item => ({ category: 'fragment', name: item.name, mean: item.mean, icon: item.icon })),
            ...armourData.map(item => ({ category: 'armour', name: item.name, mean: item.mean, icon: item.icon })),
            ...accessoryData.map(item => ({ category: 'accessory', name: item.name, mean: item.mean, icon: item.icon })),
            ...weaponData.map(item => ({ category: 'weapon', name: item.name, mean: item.mean, icon: item.icon })),
            ...flaskData.map(item => ({ category: 'weapon', name: item.name, mean: item.mean, icon: item.icon })),
            ...mapData.map(item => ({ category: 'weapon', name: item.name, mean: item.mean, icon: item.icon })),
            ...jewelData.map(item => ({ category: 'weapon', name: item.name, mean: item.mean, icon: item.icon })),
            ...cardData.map(item => ({ category: 'weapon', name: item.name, mean: item.mean, icon: item.icon })),
        ];

        // Vider la table avant d'insérer les nouvelles données
       // db.query('TRUNCATE TABLE currency', (err, result) => {
         //   if (err) {
           //     console.error('Erreur lors du vidage de la table currency:', err);
             //   return;
           // }
            //console.log('Table currency vidée avec succès');
        //});

        // Insérer les nouvelles données (seulement "category", "name", "mean" et "icon")
        const insertQuery = 'INSERT INTO currency (name, mean, icon) VALUES ?';
        const values = mergedData.map(item => [item.name, item.mean, item.icon]);

        db.query(insertQuery, [values], (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion des données dans currency:', err);
                return;
            }
            console.log('Données insérées avec succès dans currency');
        });

    } catch (error) {
        console.error('Erreur lors du fetch des données:', error);
    }
};

// Fonction pour fetch les données toutes les heures
const fetchPeriodically = () => {
    fetchAndStoreData();
    setInterval(fetchAndStoreData, 60 * 60 * 1000); // toutes les heures (en millisecondes)
};

// Lancer le fetch initial et démarrer la récupération périodique
fetchPeriodically();

// Route pour obtenir les données stockées
app.get('/data', (req, res) => {
    db.query('SELECT * FROM currency', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données:', err);
            res.status(500).send('Erreur lors de la récupération des données');
            return;
        }
        res.json(results);
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
