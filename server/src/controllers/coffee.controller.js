import * as coffeeService from '../services/coffee.service.js';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.js';
import { MESSAGES } from '../config/constants.js';

/**
 * Get all coffee products
 */
export const getAllCoffee = async (req, res) => {
  const coffee = await coffeeService.getAllCoffee();
  sendSuccess(res, coffee);
};

/**
 * Get single coffee product by ID
 */
export const getCoffeeById = async (req, res) => {
  const product = await coffeeService.getCoffeeById(req.params.id);
  sendSuccess(res, product);
};

/**
 * Create a new coffee product
 */
export const createCoffee = async (req, res) => {
  const savedCoffee = await coffeeService.createCoffee(req.body);
  sendCreated(res, savedCoffee, MESSAGES.COFFEE_CREATED);
};

/**
 * Update coffee product by ID
 */
export const updateCoffee = async (req, res) => {
  const updatedCoffee = await coffeeService.updateCoffee(req.params.id, req.body);
  sendSuccess(res, updatedCoffee, MESSAGES.COFFEE_UPDATED);
};

/**
 * Delete coffee product by ID
 */
export const deleteCoffee = async (req, res) => {
  const deletedCoffee = await coffeeService.deleteCoffee(req.params.id);
  sendSuccess(res, deletedCoffee, MESSAGES.COFFEE_DELETED);
};
