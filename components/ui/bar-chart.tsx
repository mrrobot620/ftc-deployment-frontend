import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

type Props = {};

export type Deployment = {
    station: string,
    wf: number
};

type api = {
    apiUrl: string
};


export default function PieChartComponent({ apiUrl }: api) {
    const [data, setData] = useState<Deployment[]>([]);

    useEffect(() => {
        const fetchDeployment = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();

                const transformedData = Object.entries(result.stations_wise.type).map(
                    ([station, wf]) => ({
                        station,
                        wf: Number(wf),
                    })
                );

                setData(transformedData);
                console.log(transformedData);
            } catch (error) {
                console.error("Error fetching deployment data:", error);
            }
        };
        fetchDeployment();
    }, [apiUrl]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie 
                    data={data} 
                    dataKey="wf" 
                    nameKey="station" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
