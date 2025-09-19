'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const winston = require('winston');
const Joi = require('joi');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();

const BlockchainService = require('./blockchain-service');

// Initialize logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'blockchain-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Initialize blockchain service
const blockchainService = new BlockchainService();

// Swagger documentation setup - prefer loading the complete YAML spec if available
let swaggerSpec;
try {
    const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
    if (fs.existsSync(openapiPath)) {
        const fileContents = fs.readFileSync(openapiPath, 'utf8');
        swaggerSpec = yaml.load(fileContents);
        logger && logger.info && logger.info(`Loaded OpenAPI spec from ${openapiPath}`);
    }
} catch (err) {
    logger && logger.warn && logger.warn('Failed to load openapi.yaml, falling back to swagger-jsdoc:', err.message);
}

if (!swaggerSpec) {
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Blockchain Service API',
                version: '1.0.0',
                description: 'API for blockchain-based tourist identity management and incident logging using Hyperledger Fabric',
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: 'Development server',
                },
            ],
        },
        apis: [__filename],
    };

    swaggerSpec = swaggerJsdoc(swaggerOptions);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'blockchain-service',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Basic routes for demo
app.post('/blockchain/registerDeID', async (req, res) => {
    try {
        const result = await blockchainService.registerTouristDeID(req.body);
        res.status(201).json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/blockchain/logIncident', async (req, res) => {
    try {
        const result = await blockchainService.logIncident(req.body);
        res.status(201).json({
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Start server
const startServer = async () => {
    try {
        await blockchainService.initialize().catch(error => {
            const forceDemo = (process.env.FORCE_DEMO || 'false').toLowerCase() === 'true';
            if (forceDemo) {
                logger.warn('Blockchain service initialization failed, running in demo mode (FORCE_DEMO=true):', error.message);
            } else {
                logger.error('Blockchain service initialization failed and FORCE_DEMO is not enabled. Exiting. Error:', error.message);
                process.exit(1);
            }
        });

        app.listen(port, () => {
            logger.info(`Blockchain Service API running on port ${port}`);
            logger.info(`Health check: http://localhost:${port}/health`);
            logger.info(`API Documentation: http://localhost:${port}/api-docs`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
