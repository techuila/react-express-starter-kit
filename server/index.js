const express = require('express');
const Server = require('./Server');
const { NODE_ENV, PORT, HOST } = require('./enums/environment');

const server = new Server(express, PORT, NODE_ENV, HOST);

server.start();
