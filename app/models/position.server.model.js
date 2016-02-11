'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Position Schema
 */
var PositionSchema = new Schema({
    // Position model fields
    symbol: {
        type: String,
        trim: true
    },
    displaySymbol: {
        type: String,
    },
    account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    lots: [{
        type: Schema.ObjectId,
        ref: 'Lot'
    }]
});

mongoose.model('Position', PositionSchema);
