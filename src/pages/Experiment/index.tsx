import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const TruthTable: React.FC = () => {
  const { id } = useParams();
  const [experimentData, setExperimentData] = useState<any>(null);
  const [outputData, setOutputData] = useState<string[][]>([]);
  const [inputCombinations, setInputCombinations] = useState<string[][]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

  useEffect(() => {
    const fetchExperimentData = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_URL}experiments/${id}`);
          const { data } = response.data;
          setExperimentData(data);
          generateCombinations(data.num_inputs);
        } catch (error) {
          console.error("Failed to fetch experiment data:", error);
        }
      }
    };

    fetchExperimentData();
  }, [id]);

  const generateCombinations = (n: number) => {
    const combinations: string[][] = [];
    const totalRows = 2 ** n;
    for (let i = 0; i < totalRows; i++) {
      const binary = i.toString(2).padStart(n, "0");
      combinations.push(binary.split(""));
    }
    setInputCombinations(combinations);
  };

  const handleSetupExperiment = async (): Promise<void> => {
    if (experimentData) {
      try {
        const { num_inputs, num_outputs } = experimentData;
        const config = {
          num_inputs: num_inputs,
          num_outputs: num_outputs,
          num_experiments: Number(id),
        };
        const params = new URLSearchParams();
        params.append("config", JSON.stringify(config));

        console.log("Sending data:", params.toString());
        const response = await axios.post("/set_experiment", params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        if (response.status >= 200 && response.status < 300) {
          setIsConfigured(true);
          console.log("Configuration updated successfully");
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error: any) {
        console.error("Failed to set experiment:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }
      }
    } else {
      console.error("Experiment data is missing");
    }
  };

  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(() => {
        axios
          .get(`/truth_table`)
          .then((res) => {
            setOutputData(res.data.truth_table);
          })
          .catch((err) => console.error("Failed to fetch truth table:", err));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isStarted]);

  const handleStart = async () => {
    if (!isConfigured) {
      console.error("Experiment not configured!");
      return;
    }

    try {
      await axios.post(`/update_truth_table`);
      setIsStarted(true);
    } catch (err) {
      console.error("Failed to start truth table update:", err);
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setOutputData([]);
  };

  const handleSendData = async () => {
    if (outputData.length === 0) {
      console.error("No data to send.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}experiments/${Number(id)}`, {
        experimentId: id,
        truthTable: outputData,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log("Truth table data sent successfully!");
      } else {
        console.error(
          "Failed to send truth table data. Status:",
          response.status
        );
      }
    } catch (err) {
      console.error("Error sending truth table data:", err);
    }
  };

  const numInputs = experimentData?.num_inputs || 0;
  const numOutputs = experimentData?.num_outputs || 0;
  const inputLabels = experimentData?.input_labels || [];
  const outputLabels = experimentData?.output_labels || [];

  return (
    <div className="p-4 py-20">
      <h1 className="font-bold mb-4 text-center md:text-3xl text-xl">
        Truth Table
      </h1>
      <Card className="max-w-lg p-0 mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead
                colSpan={numInputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                INPUT
              </TableHead>
              <TableHead
                colSpan={numOutputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                OUTPUT
              </TableHead>
            </TableRow>
            <TableRow className="text-center">
              {inputLabels.map((label: string, i: number) => (
                <TableHead
                  key={`input-header-${i}`}
                  className="text-xs px-1 py-1 text-center"
                >
                  {label}
                </TableHead>
              ))}
              {outputLabels.map((label: string, i: number) => (
                <TableHead
                  key={`output-header-${i}`}
                  className="text-xs px-1 py-1 text-center"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputCombinations.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} className="text-center text-xs">
                {row.map((value, colIndex) => (
                  <TableCell
                    key={`input-cell-${rowIndex}-${colIndex}`}
                    className="px-1 py-1 text-xs"
                    style={{ width: "30px" }}
                  >
                    {value}
                  </TableCell>
                ))}
                {outputData[rowIndex]?.map((output, colIndex) => (
                  <TableCell
                    key={`output-cell-${rowIndex}-${colIndex}`}
                    className="px-1 py-1 text-xs"
                    style={{ width: "30px" }}
                  >
                    {output}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <div className="flex justify-center gap-5 mx-auto max-w-lg mb-20 md:mb-0">
        {!isConfigured ? (
          <Button className="mt-4 w-full" onClick={handleSetupExperiment}>
            Setup Experiment
          </Button>
        ) : isStarted ? (
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={handleRestart}
          >
            Restart
          </Button>
        ) : (
          <Button className="mt-4 w-full" onClick={handleStart}>
            Start
          </Button>
        )}
        <Button className="mt-4 w-full" onClick={handleSendData}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default TruthTable;
