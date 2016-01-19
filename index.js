'use strict';

var handlebars = require('handlebars'),
    fs         = require('fs'),
    mkdirp     = require('mkdirp'),
    rimraf     = require('rimraf'),
    moment     = require('moment'),
    async      = require('async');

var invoiceData     = require('./invoice.json');
var templateFile    = 'templates/index.html';

////////////////////

handlebars.registerHelper('formatCurrency', function(amount, options) {
    return amount.toFixed(2).toString().replace('.', ',');
});

invoiceData.invoiceEntries.forEach(function(entry) {
    if (entry.billable) {
        entry.price = (invoiceData.invoiceData.pricePerHour) *  convertHourToInteger(entry.hours);
    } else {
        entry.price = 0;
    }
});

var totalHours = invoiceData.invoiceEntries.reduce(function(total, entry) {
    if (entry.billable) {
        return total.add(entry.hours)
    }
    return total;
}, moment.duration()).asHours();

var totalMinutes = Math.floor((totalHours % 1) * 60);
totalHours   = Math.floor(totalHours);

invoiceData.hours = totalHours + ':' + totalMinutes + ':00';

invoiceData.total = invoiceData.invoiceEntries.reduce(function(total, entry) {
    return total + entry.price
}, 0);

async.waterfall([
    clearDistFolder,
    readHandlebarsTemplate,
    saveHtml
]);

function convertHourToInteger(hour) {
    let split   = hour.split(':');
    let hours   = parseInt(split[0]);
    let minutes = parseInt(split[1]);
    let seconds = parseInt(split[2]);

    return hours + (minutes / 60) + (seconds / 3600);
}

function clearDistFolder(callback) {
    rimraf('dist', function() {
        mkdirp('dist');
        callback(null);
    });
}

function readHandlebarsTemplate(callback) {
    fs.readFile(templateFile, 'utf8', function(err, data) {
        let templateFunction = handlebars.compile(data);
        callback(null, templateFunction(invoiceData));
    });
}

function saveHtml(htmlTemplate, callback) {
    fs.writeFile('dist/index.html', htmlTemplate, function(err) {
        console.log('index.html generated');
        callback(null);
    });
}