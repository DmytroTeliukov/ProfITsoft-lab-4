import axios from "axios";
import log4js from "log4js";

/* Url path to dish (external) service */
const dishServiceUrl = 'http://172.23.0.1:9090/api/dishes';

/* Function to check if a dish exists by its ID */
export const checkDishExistsById = async (dishId: number): Promise<boolean> => {
  const getDishByIdUrl = `${dishServiceUrl}/${dishId}`;

  try {
    const response = await axios.get(getDishByIdUrl);

    /* Return true if the response status is 200 (OK) (Dish exists by id) */
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log4js.getLogger().error(`Error fetching dish with ID ${dishId}:`, error.message);
    } else {
      log4js.getLogger().error('Unexpected error:', error);
    }
    return false;
  }
};