import axios from 'axios';

export const findIfTicketsExist = async (): Promise<{
  policeRecords: boolean;
  kvish6Records: boolean;
}> => {
  if (!process.env.FUNCTION_URL) {
    throw new Error('FUNCTION_URL is not defined');
  }

  if (!process.env.PERSONAL_ID) {
    throw new Error('PERSONAL_ID is not defined');
  }

  if (!process.env.DRIVER_LICENSE_ID) {
    throw new Error('DRIVER_LICENSE_ID is not defined');
  }

  const response = await axios.post(process.env.FUNCTION_URL, {
    id: process.env.PERSONAL_ID,
    drivers_license_id: process.env.DRIVER_LICENSE_ID,
    car_number: process.env.CAR_NUMBER || '1385460',
  });

  if (!response.data) {
    throw new Error('No response data');
  }

  return response.data;
};
