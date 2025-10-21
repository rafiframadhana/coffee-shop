import * as coffeeService from '../services/coffee.service.js';
import { MESSAGES, HTTP_STATUS } from '../config/constants.js';

/**
 * Get all coffee products
 */
export const getAllCoffee = async (req, res) => {
  const coffee = await coffeeService.getAllCoffee();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: coffee,
  });
};

/**
 * Get single coffee product by ID
 */
export const getCoffeeById = async (req, res) => {
  const product = await coffeeService.getCoffeeById(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Success',
    data: product,
  });
};

/**
 * Create a new coffee product
 */
export const createCoffee = async (req, res) => {
  const savedCoffee = await coffeeService.createCoffee(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.COFFEE_CREATED,
    data: savedCoffee,
  });
};

/**
 * Update coffee product by ID
 */
export const updateCoffee = async (req, res) => {
  const updatedCoffee = await coffeeService.updateCoffee(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.COFFEE_UPDATED,
    data: updatedCoffee,
  });
};

/**
 * Delete coffee product by ID
 */
export const deleteCoffee = async (req, res) => {
  const deletedCoffee = await coffeeService.deleteCoffee(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.COFFEE_DELETED,
    data: deletedCoffee,
  });
};
