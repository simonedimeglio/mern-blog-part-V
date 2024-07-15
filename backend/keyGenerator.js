// Importa il modulo 'crypto' che è integrato in Node.js. 
// Questo modulo fornisce funzionalità di crittografia, comprese le funzioni per generare numeri casuali sicuri.
import crypto from 'crypto';

console.log(crypto.randomBytes(64).toString('hex'));
// 	crypto.randomBytes(64): Genera 64 byte di dati casuali in formato binario.
// 	.toString('hex'): Converte i dati casuali in una stringa "hex" ovvero esadecimale.

// APPROFONDIMENTO: 
// Una stringa esadecimale (o semplicemente “hex”) è una rappresentazione dei dati in base 16. 
// In questa notazione, si utilizzano 16 simboli distinti: 

// i numeri da 0 a 9 e le lettere da A a F (o da a a f), dove:
// A (o a) rappresenta il valore 10, 
// B (o b) rappresenta il valore 11, 
// e così via fino a F (o f), che rappresenta il valore 15.