/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '@/utils/utils';
import React from 'react';
import {  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';

type PropsType = {
  graphData: any[],
  XLabel?: string,
  YLabel?: string,
  areaColor?: string,
  lineColor?: string,
  barColor?: string,
  xValueKey?: string,
  valueKey?: string,
  title?: string,
  subTitle?: string,
  isArea?: boolean,
  isLine?: boolean,
};

const LineBarGraph = ({ graphData, XLabel, YLabel, areaColor, lineColor, barColor, title, subTitle, valueKey,xValueKey,isArea,isLine }: PropsType) => {
  console.log(graphData)


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className=" bg-white bg-opacity-40 dark:bg-opacity-10 backdrop-blur-lg p-2">
          <p className="label">{`${XLabel || `Date`} : ${typeof label !== 'string' ? label.toString().split('T')[1] ? formatDate(label) : label: label}`}</p>
          <p className="label">{`${YLabel || `Value`} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };
  // console.log(filteredGraphData,title)
  return (
    <div className="w-full h-fit bg-white p-4 rounded-lg border-1 shadow-md " >
      <div className="flex items-center justify-start">
        <div className="flex flex-col w-[60%]">
          <h1 className='text-lg'>{title}</h1>
          <h2>{subTitle}</h2>
        </div>
      </div>
      <ResponsiveContainer width={"100%"} height={300}>
        <ComposedChart
          width={500}
          height={400}
          data={graphData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey={xValueKey || "date"}  label={{ value: XLabel || "Date", position: 'insideBottomRight' }} tick={{fontSize:"14px"}} tickFormatter={(tick)=>formatDate(tick)} />
          <YAxis dataKey={valueKey || "value"} label={{ value: YLabel || 'Price', angle: -90, position: 'insideLeft' }} />
          <Tooltip isAnimationActive content={<CustomTooltip />} />
          {isArea && <Area type="monotone" dataKey={valueKey || "value"} fill={areaColor || "#8884d8"} stroke={areaColor || "#8884d8"} />}
          <Bar dataKey={valueKey || "value"} barSize={20} fill={barColor || "#413ea0"} />
          {isLine && <Line type="monotone" dataKey={valueKey || "value"} stroke={lineColor || "#ff7300"} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineBarGraph;
