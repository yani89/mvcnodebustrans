var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');

const http = require('http');

const express = require('express');
const tracking =  require('./track');

let busModel = require('../models/bustransx');
exports.loggedIn = function(req, res, next)
{
	if (req.session.user) { // req.session.passport._id

		next();

	} else {

		res.redirect('/login');

	}

}



exports.home = function(req, res) {
	var title = "Bustrans Jakarta";

	let data = new busModel();

	
	io.of("/home").on('connection', function(io){
		console.log('a user connected');
		tracking.run(io);
	});
	
	res.render('home.ejs', {
		error : req.flash("error"),
		success: req.flash("success"),
		session:req.session,
		title: title,
		//data : tracking.run(io),
		isidata: data
	 });
	 
}


exports.signup = function(req, res) {

	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('signup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}

}


exports.login = function(req, res) {


	
	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('login', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});

	}
	
}


    
