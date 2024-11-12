import React from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardContent,
  Card,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TruthTable: React.FC = () => {
  const inputs = 4;
  const outputs = 2;
  const location = useLocation();

  const getQueryParams = () => {
    const urlParams = new URLSearchParams(location.search);
    const module = urlParams.get("module") || "";
    const experiment = urlParams.get("experiment") || "";
    return { module, experiment };
  };

  const { module, experiment } = getQueryParams();

  const generateCombinations = (n: number) => {
    const combinations: string[][] = [];
    const totalRows = 2 ** n;
    for (let i = 0; i < totalRows; i++) {
      const binary = i.toString(2).padStart(n, "0");
      combinations.push(binary.split(""));
    }
    return combinations;
  };

  const inputCombinations = generateCombinations(inputs);

  const calculateOutputs = (row: string[]) => {
    const sum = row.reduce((acc, bit) => acc + Number(bit), 0);
    return [sum % 2, sum % 3];
  };

  const outputCombinations = inputCombinations.map((row) =>
    calculateOutputs(row)
  );

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token not found in local storage!");
      return;
    }

    const payload = {
      module,
      experiment,
      inputs: inputCombinations,
      outputs: outputCombinations,
    };

    try {
      const response = await fetch("/api/submit-truth-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Truth table submitted successfully!");
      } else {
        alert("Failed to submit truth table.");
      }
    } catch (error) {
      console.error("Error submitting truth table:", error);
      alert("An error occurred while submitting the truth table.");
    }
  };

  return (
    <div className="p-4 py-20">
      <h1 className="text-lg font-bold mb-4 text-center">Truth Table</h1>
      <Card className="max-w-lg p-0 mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead
                colSpan={inputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                INPUT
              </TableHead>
              <TableHead
                colSpan={outputs}
                className="text-xs px-1 py-1 font-bold text-center"
              >
                OUTPUT
              </TableHead>
            </TableRow>
            <TableRow className="text-center 0">
              {Array.from({ length: inputs }, (_, i) => (
                <TableHead
                  key={`input-header-${i}`}
                  className="text-xs px-1 py-1 text-center"
                >
                  {String.fromCharCode(97 + i)}
                </TableHead>
              ))}
              {Array.from({ length: outputs }, (_, i) => (
                <TableHead
                  key={`output-header-${i}`}
                  className="text-xs px-1 py-1 text-center"
                >
                  {String.fromCharCode(112 + i)}
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
                {outputCombinations[rowIndex].map((output, colIndex) => (
                  <TableCell
                    key={`output-cell-${rowIndex}-${colIndex}`}
                    className="px-1 py-1 text-xs "
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
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Submit
        </Button>
        <Button variant="secondary" className="mt-4 w-full">
          Ulangi
        </Button>
      </div>
    </div>
  );
};

export default TruthTable;
