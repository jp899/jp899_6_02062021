const winston = require('winston');

// Réglage des couleurs 
const myCustomColorLevels = {
    error: 'red',
    warning: 'yellow',
};
winston.addColors(myCustomColorLevels);


// Uniquement le message (sans le niveau)
const messageOnlyFormat = winston.format.printf(({level, message}) => {
    return message;
});

// Message + niveau
const messageAndLevelFormat = winston.format.printf(({level, message}) => {
    return `${level}: ${message}`;
});

// Filtre des niveaux info seulement
const onlyInfo = winston.format((info, opts) => {
    if (info.level === 'info') return info; 
    else return false;
});

// Format pour les messages de niveau info (dans la console)
const consoleOnlyInfoMessageFormat = winston.format.combine(
    onlyInfo(),
    messageOnlyFormat,
);


// Format de ligne avec colorisation (pour la console)
const consoleColorizedFormat = winston.format.combine(
    winston.format.colorize(),
    messageAndLevelFormat,
);


// Format de ligne avec timestamp+message si niveau info et sinon timestamp+niveau+message (pour fichier)
const completeFormat = winston.format.printf(({ level, message, timestamp }) => {
    if (level === 'info') return `${timestamp} ${message}`;
    else return `${timestamp} ${level}: ${message}`;
});


// Format de ligne le plus complet pour écriture dans le fichier de log
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    completeFormat,
);


// Initialisation du logger
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    exitOnError: false,
    // Rediriger les messages à la fois vers la console et le fichier, mais avec des règles de format différentes
    transports: [
        new winston.transports.Console({ level: 'warning' , format: consoleColorizedFormat}),
        new winston.transports.Console({ level: 'info' , format: consoleOnlyInfoMessageFormat}),
        new winston.transports.File({ level:'info', filename: `./logs/all.log`, format: fileFormat}),
    ],
});

module.exports = logger;