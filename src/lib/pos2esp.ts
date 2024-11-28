import axios from 'axios';

export const postWithParams = async (url: string, config: Record<string, any>) => {
  const params = new URLSearchParams();
  params.append("config", JSON.stringify(config));

  try {
    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error making request:", error);
    throw new Error(error?.response?.data?.message || "Failed to make request");
  }
};
