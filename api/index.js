const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();

// Middleware para habilitar CORS
app.use(cors({
  origin: "http://192.168.0.109:8080"  // Este es el puerto donde probablemente esté corriendo tu cliente
}));



// Configura Sequelize para conectarse a tu base de datos MySQL
const sequelize = new Sequelize('Pokedex', 'avnadmin', '', {
  host: 'proyectoamadecasa-facundosettembrinoet36-ee7b.g.aivencloud.com',
  port: 25979,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false // Si es necesario usar SSL
    }
  }
});

// Define el modelo Pokedex
const Pokedex = sequelize.define('Pokedex', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  evolucion: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  color1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalmenteEvolucionado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'pokedex',
  timestamps: false,
});

// Verifica la conexión y sincroniza el modelo
sequelize.sync()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Ruta para obtener un Pokémon por ID o nombre
app.get('/pokedex/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Consulta SQL para obtener un Pokémon
    const [results] = await sequelize.query(
      `SELECT * FROM pokemones WHERE id = ? OR nombre = ?`, 
      {
        replacements: [id, id],
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ message: `Pokémon con ID o nombre ${id} no encontrado` });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al ejecutar la consulta' });
  }
});

// Ruta para servir el archivo HTML en la raíz


// Arranca el servidor
app.listen(3000, '0.0.0.0',() => { //Se le pone 0.0.0.0 para que express escuche en todas las interfaces de red dispoinbles, permitiendo acceder al backend desde otros dispositivos en la misma red
  console.log('Servidor escuchando en el puerto 3000');
});