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
import { toast } from "@/hooks/use-toast";
import { postWithParams } from "@/lib/pos2esp";

const TruthTable: React.FC = () => {
  const { id } = useParams();
  const [experimentData, setExperimentData] = useState<any>(null);
  const [outputData, setOutputData] = useState<string[][]>([]);
  const [inputCombinations, setInputCombinations] = useState<string[][]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

  const showToast = (
    variant: "default" | "destructive",
    title: string,
    description: string
  ) => {
    toast({ variant, title, description });
  };

  const generateCombinations = (n: number) => {
    const totalRows = 2 ** n;
    const combinations: string[][] = [];
    for (let i = 0; i < totalRows; i++) {
      const binary = i.toString(2).padStart(n, "0");
      combinations.push(binary.split(""));
    }
    setInputCombinations(combinations);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setOutputData([]);
    showToast("default", "Success", "Experiment restarted.");
  };

  const handleStart = async () => {
    if (!isConfigured) {
      showToast("destructive", "Error", "Experiment is not configured.");
      return;
    }
    try {
      await axios.post(`/update_truth_table`);
      setIsStarted(true);
      showToast("default", "Success", "Experiment started.");
    } catch (err) {
      showToast("destructive", "Error", "Failed to start experiment.");
    }
  };

  const SetupExperiment = async (data: any): Promise<void> => {
    if (data) {
      const { num_inputs, num_outputs } = data;
      const config = { num_inputs, num_outputs, num_experiments: Number(id) };
      try {
        await postWithParams("/set_experiment", config);
        setIsConfigured(true);
      } catch (error) {
        showToast("destructive", "Error", "Failed to setup experiment.");
      }
    } else {
      showToast("destructive", "Error", "Experiment data is missing.");
    }
  };

  const handleSendData = async () => {
    if (outputData.length === 0) {
      showToast("destructive", "Error", "No data to send.");
      return;
    }
    try {
      await axios.post(`${API_URL}experiment/${Number(id)}`, {
        experimentId: id,
        truthTable: outputData,
      });
      showToast("default", "Success", "Truth table data sent successfully.");
    } catch (err) {
      showToast("destructive", "Error", "Failed to send truth table data.");
    }
  };

  const fetchExperimentData = async (id: string | undefined) => {
    if (id) {
      try {
        const response = await axios.get(`${API_URL}experiment/${id}`);
        const { data } = response.data;
        setExperimentData(data);
        generateCombinations(data.num_inputs);
        SetupExperiment(data);
      } catch (error) {
        showToast("destructive", "Error", "Failed to fetch experiment data.");
      }
    }
  };

  const pollForTruthTable = () => {
    const interval = setInterval(() => {
      axios
        .get(`/truth_table`)
        .then((res) => {
          setOutputData(res.data.truth_table);
        })
        .catch((err) => console.error("Failed to fetch truth table:", err));
    }, 3000);

    return interval;
  };

  useEffect(() => {
    fetchExperimentData(id);
  }, [id]);

  useEffect(() => {
    if (isStarted) {
      const interval = pollForTruthTable();
      return () => clearInterval(interval);
    }
  }, [isStarted]);

  const dataIo = {
    num_inputs: experimentData?.num_inputs || 0,
    num_outputs: experimentData?.num_outputs || 0,
    input_labels: experimentData?.input_labels || [],
    output_labels: experimentData?.output_labels || [],
  };
  return (
    <div className="p-4 md:py-20">
      <div className="text-center pb-5">
        <h1 className="text-2xl font-semibold md:text-3xl text-center">
          {experimentData?.name}
        </h1>
        <p className="text-xl text-muted-foreground md:text-xl text-center">
          Experiment {id} Truth Table
        </p>
      </div>
      <Card className="max-w-lg p-0 mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead
                colSpan={dataIo.num_inputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                INPUT
              </TableHead>
              <TableHead
                colSpan={dataIo.num_outputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                OUTPUT
              </TableHead>
            </TableRow>
            <TableRow className="text-center">
              {dataIo.input_labels.map((label: string, i: number) => (
                <TableHead
                  key={`input-header-${i}`}
                  className="text-xs px-1 py-1 text-center"
                >
                  {label}
                </TableHead>
              ))}
              {dataIo.output_labels.map((label: string, i: number) => (
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
          <Button
            className="mt-4 w-full"
            onClick={() => SetupExperiment(experimentData)}
          >
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
