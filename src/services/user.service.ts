/**
 * User related services module
 * @module /src/services/user.ts
 */

import { FilterQuery } from "mongoose";

import { UserClass, UserModel } from "../models/user.model";

/**
 * Get a single user
 * @param {FilterQuery} filter Query for filtering out a user
 * @returns Promise of a user
 */
export const getUserService = async (filter: FilterQuery<UserClass>) => {
  return await UserModel.findOne(filter, "-__v").exec();
};

/**
 * Get count of users that match the filter
 * @param {FilterQuery} filter Query for filtering out a user
 * @returns {Promise<number>} Promise of user counts that match the filter
 */
export const userExistsService = async (
  filter: FilterQuery<UserClass>
): Promise<number> => {
  return await UserModel.count(filter).exec();
};

/**
 * Create a new user
 * @param {Partial<UserClass>} data User data to be saved
 * @returns Promise of a user
 */
export const createUserService = async (data: Partial<UserClass>) => {
  const user = new UserModel(data);
  return await user.save();
};

/**
 * Update a user
 * @param {FilterQuery} filter Query for filtering out a user
 * @param {Partial<UserClass>} data User data to be updated
 * @returns Promise of a user
 */
export const updateUserService = async (
  filter: FilterQuery<UserClass>,
  data: Partial<UserClass>
) => {
  return await UserModel.findOneAndUpdate(filter, data, {
    new: true,
    fields: "-_id -__v",
  }).exec();
};

export const getUserWithFieldsService = async (
  filter: FilterQuery<UserClass>,
  select: string
) => {
  return await UserModel.findOne(filter).select(`${select} -__v`).exec();
};

export const deleteUserService = async (filter: FilterQuery<UserClass>) => {
  return await UserModel.findOneAndDelete(filter).exec();
};
